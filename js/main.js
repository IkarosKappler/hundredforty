/**
 * @require  jquery
 * @require  jquery-confirm
 * @require  jquery-linkify
 * @require  getURIParams
 *
 * @author   Ikaros Kappler
 * @modified 2017-01-05 Added the 'Load New' functions.
 * @modified 2017-01-07 Added image-refs upload.
 * @modified 2017-01-08 Added category listings.
 * @modified 2017-01-16 Added image uploads. Added the 'referrer' field to the db.
 * @modified 2017-02-12 Added a simple RSS feed.
 * @modified 2017-02-19 Added the RSS icon plus link.
 * @modified 2017-02-25 Added URL shortener hook.
 * @modified 2017-04-12 Added non-image file uploads.
 *
 * @require jQuery
 * @optional URLShortener
 *
 * @date     2016-12-01
 * @modified 2017-03-25 (Added author).
 * @modified 2017-04-26 (Added the search bar).
 * @version  1.1.2
 **/


_DISPLAY_LIMIT        = 10;

_ALLOW_FILE_UPLOADS   = true;
// Emptpy images only: 'image/*'
// All files         : ''
_ALLOWED_FILE_TYPES   = '';
_IMAGE_URL_BASE       = 'https://files.func.name';
_UPLOAD_URL           = _IMAGE_URL_BASE + '/ajax/imageupload.ajax.php';

// This requires the URLShortener.
_SHORTEN_URLS         = true;
// If you want to use any other URL shortener here, use the code you need.
_URL_SHORTENER        = new URLShortener().shortenText;

_MAX_TEXT_LENGTH      = 140;


Dropzone.autoDiscover = false;

/**
 * Initialize the app.
 **/
$( document ).ready( function() {

    // First of all catch the GET params. We are especially interested
    // in the 'cat' param (category). If left blank, use the empty
    // category ''.
    var URI_PARAMS     = getURIParams();
    var CATEGORY       = ('cat' in URI_PARAMS) ? URI_PARAMS['cat'].toLowerCase() : '';
    var ID             = ('id'  in URI_PARAMS) ? URI_PARAMS['id'] : '';
    var KEY            = ('key' in URI_PARAMS) ? URI_PARAMS['key'] : '';

    // Fetch frequently asked questions ... ehm ... fetch frequently used DOM objects.
    var $hundredforty  = $( '#hundredforty' );                    // The main container.
    var $container     = $hundredforty.find( '#notes' );          // The sub container for all notes.
    var $template      = $container.find( '#_template-note' );    // The note template.
    var $resultTemplate = $hundredforty.find( '#_template-result' ); // The note template.
    var $uploadWidget  = $( '#upload-widget' );                   // A dropzone for file uploads.
    var $uploadPreview = $( '#upload-preview' );                  // An area for previewing uploaded images.
    var $btnLoadNew    = $( '#btn-loadnew' );                     // The button for loading new notes.
    var $btnMore       = $( '#btn-more' );                        // The button for loading more notes.
    var $inputArea     = $hundredforty.find( '#note-text' );      // The text input area (max 140 chars).
    var $authorInput   = $hundredforty.find( 'input#author' );
    var $categoryList  = $hundredforty.find( '#category-list ul' );
    var $_loading      = $( '<img/>', { src : 'img/loading3.svg', width : 32, height : 32 } ); // A loading animation.

    console.debug( 'result template = ' + $resultTemplate.attr('id') );

    var dropZone       = null;

    
    // Add loading animations to the loading containers.
    var $loadingSend  = $( '#loading-send' ).append( $_loading.clone() );
    var $loadingMore  = $( '#loading-more' ).append( $_loading.clone() );


    // Init the template with the current timestamp (used for latest 'loaded' timestamp if there
    // are no notes present).
    $template.data('created_at_ts',Math.round(Date.now()/1000)); // Convert milliseconds to seconds.

    // Initially there are no new notes.
    $btnLoadNew.data('num_new',0);


    function fallback( value, _default ) {
	if( value === null ) return _default;
	return value;
    }
    
    
    // Install 'send' button handler.
    $hundredforty.find( '#btn-sendnote' ).click( function() {
	if( !$inputArea.val() ) {
	    setErrorStatus( "You should enter some text." );
	    return;
	}
	clearErrorStatus();
	var sendCreateNoteRequest = function(text,author) {
	    $loadingSend.removeClass('invisible');
	    $_btn = $(this);
	    $_btn.prop( 'disabled', 'disabled' );
	    window.setTimeout( function() {
		// --- BEGIN --------------------------------------
		var image_refs = [];
		var j          = 0;
		$('.upload-info').each( function(index) {
		    var uploadInfo = $(this).data('upload-info'); // Array
		    for( var i = 0; i < uploadInfo.length; i++ ) {
			var info = uploadInfo[i];
			image_refs[j] = { image_url_base : _IMAGE_URL_BASE, uri : info.uri };
			if( ('dimensions' in info) && ('64x64' in info['dimensions']) )
			    image_refs[j].thumbnail = info['dimensions']['64x64'].uri;
			else if( 'icon_uri' in info )
			    image_refs[j].thumbnail = info['icon_uri'];
			j++;
		    }
		} );
		var data = new FormData();				     
		data.append( 'cat',            CATEGORY );
		data.append( 'note',           text );
		data.append( 'image_refs',     JSON.stringify(image_refs) );
		data.append( 'author',         author );
		
		$.ajax(
		    { url: 'ajax/create.ajax.php',
                      type: 'POST',
                      data: data,
                      cache: false,
                      dataType: 'json',
                      processData: false, // Don't process the files?
                      contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                      success: function(json, textStatus, jqXHR) {
			  // Note was posted. Add new note element to DOM and clear input area.
			  $note = createNoteNode( json.note );		    
			  $note.insertAfter( $template );
			  $authorInput.val('');
			  $inputArea.val('');
			  $textLength.empty().html( '0' );
			  $hundredforty.find('.upload-info').remove();
			  dropZone.removeAllFiles();
			  $uploadPreview.css( 'display', 'none' );
		      },
                      error: function( jqXHR, textStatus, error ) {
			  setErrorStatus( error + ": " + textStatus + " " + jqXHR.responseJSON.message );
                      }
		    }).always( function() {
			$_btn.prop( 'disabled', false );
			$loadingSend.addClass('invisible');
		    } );
		// --- END ----------------------------------------
	    }, 1000 );
	}; // END function sendCreateNoteRequest

	// Shorten URLs or send pure text to storage script?
	var input  = $inputArea.val();
	var author = $authorInput.val();
	if( _SHORTEN_URLS && input.length > _MAX_TEXT_LENGTH ) {
	    _URL_SHORTENER( input,
			    function( result ) { sendCreateNoteRequest(result,author); },
			    function( error ) { setErrorStatus( 'Failed to shorten URLs: ' + JSON.stringify(error) ); }
			  );
	} else {
	    sendCreateNoteRequest( input, author );
	}
    } );
    

    /**
     * This function sends a request to the remote server for
     * deleting the passed note.
     **/
    var requestDelete = function(noteData) {
	$.confirm({
	    title        : 'Delete Note',
	    content      : 'Do you really want to delete note #'+noteData.id+'?',
	    boxWidth     : '300px',
	    useBootstrap : false,  // Required so 'boxWidth' can override bootstrap
	    buttons: {	
		confirm : {
		    text: 'Yes',
		    btnClass: '',
		    keys: ['enter', 'shift'],
		    action: function(){
			deleteNote(noteData);
		    }
		},
		deny : {
		    text: 'No',
		    btnClass: '',
		    keys: ['esc'],
		    action: function(){
			// NOOP
		    }
		}
	    }
	});
    }
    

    /**
     * This function sends a request to the remote server for
     * deleting the passed note.
     **/
    var deleteNote = function(noteData) {
	var url = 'admin/delete.ajax.php?id=' + encodeURIComponent(noteData.id) + '&key=' + encodeURIComponent(noteData.sha256);
	var jqxhr = $.getJSON( url )
	    .done( function( json ) {
		// Remove from DOM
		$( '#note_'+noteData.id ).detach();
	    } )
	    .fail( function(jqxhr, textStatus, error) {
		// 401 Unauthorized?
		if( jqxhr.status == '401' ) {
		    $.alert({
			title        : 'Unauthorized',
			boxWidth     : '300px',
			useBootstrap : false,  // Required so 'boxWidth' can override bootstrap
			content      : 'It seems that authentication failed.<br/><br/>Want to try <a href="'+url+'" target="_blank">manually</a>?',
		    });
		} else {
		    setErrorStatus( '[' + jqxhr.status + '] ' + error + ": " + textStatus + " " + jqxhr.responseText );
		}
	    } );
    };

    /**
     * Replaces special characters (such as lines breaks, by '<br/>').
     **/
    var formatText = function( msg ) {
	msg = msg.replace(/\n/g, '<br/>');
	return msg;
    }



    
    
    var createNoteNode = function( noteData ) {
	return createNodeFromTemplate( noteData, $template, 'note_' );
    }

    var createResultNode = function( noteData ) {
	console.log( 'Creating result node from result template ... ' + $resultTemplate.attr('id') );
	return createNodeFromTemplate( noteData, $resultTemplate, 'result_' );
    }

    var createNodeFromTemplate = function( noteData, $templ, baseID ) {
	//var $container = $hundredforty.find( '#notes' );

	var $linkImage = $( '<img/>', { src : 'img/link_symbol.svg', width : 16, height : 16 } ).css( { width : '16px', height : '16px' } );
	
	// var newID      = 'template-data-'+noteData.id; 
	var $note      = $templ.clone().removeClass('hidden').attr('id',baseID+noteData.id);
	$note.data('created_at_ts',noteData['created_at_ts']);
	var $showLink  = $( '<a/>', { href   : '?cat=' + encodeURIComponent(CATEGORY) + '&id=' + encodeURIComponent(noteData.id) + '&key=' + encodeURIComponent(noteData.sha256),
				      name   : 'note_'+noteData.id,
				      target : '_blank'
				    } ).addClass('inner-link').addClass('clickable').html( $linkImage );
	$note.find( '#_template-author' ).attr('id',baseID+'template-author-'+noteData.id).empty().html( noteData.author );
	$note.find( '#_template-date' ).attr('id',baseID+'template-date-'+noteData.id).empty().html( $showLink ).append( ' '+noteData.created_at );
	$note.find('a.boxclose').click( function() { requestDelete(noteData); } );
	//console.debug(noteData.data);
	$note.find( '#_template-data' ).attr('id',baseID+'data-'+noteData.id).empty().html( formatText(noteData.data) ).linkify().hashtagify();
	$mediaContainer = $note.find( '#_template-media' ).attr('id',baseID+'template-media-'+noteData.id);
	appendImagesToNoteNode( $mediaContainer, noteData );
	return $note;
    };

    


    var appendImagesToNoteNode = function( $container, noteData ) {
	if( !noteData.image_refs )
	    return;
	var imageRefs = noteData.image_refs;
	//console.debug( 'imageRefs=' + imageRefs );
	if( (typeof imageRefs) == 'string' )
	    imageRefs = jQuery.parseJSON(imageRefs);
	for( var i in imageRefs ) {
	    //console.debug( 'imageRefs['+i+']=' + JSON.stringify(imageRefs[i]) + ", type " + (typeof imageRefs[i]) + ", URI=" + imageRefs[i].uri );
	    if( (typeof imageRefs[i]) == 'object' && imageRefs[i]['uri'] !== undefined ) {
		//console.debug( "Adding image ... ");
		var thumbnail = fallback( imageRefs[i].thumbnail, imageRefs[i].uri );
		
		$container.append( $( '<a/>', { href : _IMAGE_URL_BASE + imageRefs[i].uri, target : '_blank' } ).append( $('<img/>', { src : _IMAGE_URL_BASE + thumbnail } ).addClass('preview-image') ) );
	    }
	}
    }

    
    var processResult = function( data, appendBefore ) {
	clearErrorStatus();
	data.list.forEach( function(noteData) {
	    var $note = createNoteNode( noteData );
	    // Attach to DOM.
	    if( appendBefore )
		$note.insertAfter( $template );
	    else 
		$container.append( $note );
	} );
	// Update button settings.
	if( !appendBefore )
	    $btnMore.data( 'skip', parseInt(data.meta.skip) + $btnMore.data('limit') ); // +5 );
	// Disable 'more' button if history is fully loaded.
	if( data.list.length == 0 )
	    $btnMore.prop('disabled',true);
    };

    
    var setErrorStatus = function( msg ) {
	$( '#error-status' ).empty().html( msg );
    };

    var clearErrorStatus = function( ) {
	$( '#error-status' ).empty().html( '&nbsp;' );
    };

    $btnLoadNew.click( function() {
	var numNew = $btnLoadNew.data('num_new');
	$btnLoadNew.data('num_new',0);
	if( numNew == 0 )
	    return;
	// Don't forget to skip 'n' less new notes when loading older ones now.
	// Load the next new [n] notes.
	$btnLoadNew.css( 'visibility', 'hidden' );
	loadNotes( 0, numNew, true );  // true -> append before	
    } );
    
    $btnMore.click( function() {
	$btnMore.prop( 'disabled', 'disabled' );
	loadNotes( $btnMore.data('skip'), $btnMore.data('limit'), false );  // false -> don't append before (append after)
    } );


    /**
     * Send the next load-request to the server. The answer should be
     * a JSON obejct with n more tweets .... ehhm notes.
     **/
    var loadNotes = function( skip, limit, appendBefore ) {
	$loadingMore.removeClass('invisible');
	window.setTimeout( function() {
	    var jqxhr = $.getJSON( 'ajax/list.ajax.php?cat=' + encodeURIComponent(CATEGORY) + '&skip=' + skip + '&limit=' + limit )
		.done( function( json ) {
		    processResult(json,appendBefore);
		} )
		.fail( function(jqxhr, textStatus, error) {
		    setErrorStatus( error + ": " + textStatus + " " + jqxhr.responseJSON.message );
		} )
		.always( function() {
		    $btnMore.prop( 'disabled', false );
		    $loadingMore.addClass('invisible');
		} );
	}, 200 );
    };


    var showNoteDialog = function( noteData ) {
	setErrorStatus( 'Sorry, not yet implemented.' );
	var $node = createNoteNode(noteData);
	$( '#dialog' ).dialog( {
	    autoOpen    : false,
	    dialogClass : 'dialog',
	    draggable   : true,
	    resizeable  : false,
	    closeText   : 'X',
	    width       : '35%',
	    height      : 300,
	    modal       : true  // Not working?
	} ).append( $node );
    }


    
    var checkForNewNotes = function() {
	clearErrorStatus();
	// The first note container is the _template container, which is OK.
	var $secondNoteContainer = $( 'div#notes .note-container:nth-child(2)');
	var since = -1;
	if( $secondNoteContainer.length ) since = $secondNoteContainer.data('created_at_ts'); // 'YYYY-MM-DD';
	else                              since = $template.data('created_at_ts');
	var jqxhr = $.getJSON( 'ajax/checknew.ajax.php?cat=' + encodeURIComponent(CATEGORY) + '&since=' + since )
		.done( function( json ) {
		    //console.debug( JSON.stringify(json) );
		    if( json.count == 0 )
			return;
		    // Show 'load new button'
		    var oldValue = $btnLoadNew.data('num_new');
		    $btnLoadNew.data( 'num_new', json.count );
		    $btnLoadNew.css( 'visibility', 'visible' ).text( 'There are '+json.count+' new notes' );
		    // Don't forget to skip 'n' less new notes when loading older ones now.
		    $btnMore.data( 'skip', $btnMore.data('skip') + (json.count-oldValue) );
		} )
		.fail( function(jqxhr, textStatus, error) {
		    setErrorStatus( error + ": " + textStatus + " " + jqxhr.responseJSON.message );
		} )
		.always( function() {
		   
		} );
    }


    var loadCategoryList = function() {
	$categoryList.empty();
	var jqxhr = $.getJSON( 'ajax/categories.ajax.php' )
	    .done( function( json ) {
		for( var index in json.list ) {
		    var cat = json.list[index];
		    $categoryList.append( $( '<li/>' ).html( '<a href="?cat=' + cat.name + '">' + (cat.name==''?'<i>none</i>':cat.name) + '</a>' ) );
		}
	    } )
	    .fail( function(jqxhr, textStatus, error) {
		$categoryList.html( "Error: " + textStatus + " " + error );
	    } );
    };
    
    
    /**
     * A wrapper for the text-length display.
     **/
    var $textLength = $( 'span#textlength' );
    $inputArea.keyup( function() {
	var textLength = $inputArea.val().length;
	$textLength.empty().html( textLength );
	if( textLength > 140 ) $textLength.addClass( 'error' );
	else                   $textLength.removeClass( 'error' );
    } );


    var $searchContainer       = $( 'div#search-container' );
    var $searchField           = $searchContainer.find( 'input#search-term' );
    var $searchResultContainer = $searchContainer.find( 'div#search-results' );
    var latestSearchInputTime  = Date.now();
    $searchField.on( 'keyup', function() {
	$searchResultContainer.empty();
	var searchText = $searchField.val();
	if( !searchText || (searchText = searchText.trim()).length < 3 ) 
	    return; // Clear search?

	// Install some search delay and input speed measurements. Delay=300ms.
	var myInputTime = latestSearchInputTime = Date.now();
	window.setTimeout( function() {
	    console.debug( 'Search for ' + searchText + ' requested ... ' );
	    if( myInputTime < latestSearchInputTime )
		return;
	    console.debug( 'Search for ' + searchText + ' being performed.' );	    
	    var jqxhr = $.getJSON( 'ajax/search.ajax.php?cat=' + encodeURIComponent(CATEGORY) + '&search=' + encodeURIComponent(searchText) )
		.done( function( json ) {
		    // console.debug( JSON.stringify(json) );
		    // Display search result
		    json.list.forEach( function(noteData) {
			// Shorten note to 64 chars?
			//if( noteData.data.length > 64 )
			//	noteData.data = noteData.data.substring(0,64) + '&hellip;';
			var $note = createResultNode( noteData );
			//var $note = $( '<div/>' ).html( '<a href=
			// Attach to DOM.
			$searchResultContainer.append( $note );
		    } );
		} )
		.fail( function(jqxhr, textStatus, error) {
		    setErrorStatus( error + ": " + textStatus + " " + jqxhr.responseJSON.message );
		} )
		.always( function() {
		    
		} );
	}, 300 ); // END window.setTimeout
    } );
    
    

    /**
     * Initialize the drop zone.
     **/
    if( _ALLOW_FILE_UPLOADS ) {
	try {
	    var formData = new FormData();
	    dropZone = new Dropzone('#upload-widget', {
		url                : _UPLOAD_URL, // This is configured in line 29
		method             : 'post',
		// withCredentials    : true,     // DO NOT SET FOR CORS!
		paramName          : 'file',
		maxFilesize        : 2, // MB
		addRemoveLinks     : true,
		maxFiles           : 5,
		thumbnailWidth     : 64,
		thumbnailHeight    : 64,
		dictDefaultMessage : 'Drag an image here to upload, or click to select one.',
		headers: {
		    // These headers MUST be allowed by the CORS configuration of the server if you want to use them.
		    'x-csrf-token'                 : 'abcdef0123456789',
		    'Access-Control-Allow-Headers' : 'Authorization, Content-Type, Accept, X-Mashape-Authorization',
		    'Authorization'                : null, // Clear authorizationHeader
		    'Cache-Control'                : null,
		    'X-Requested-With'             : null
		},
		acceptedFiles      : _ALLOWED_FILE_TYPES,  // 'image/*',
		init: function() {
		    this.on("addedfile", function(file) {
			$uploadPreview.css( 'display', 'inherit' );
		    });
		    this.on('success', function( file, response ) {
			// Store result in the preview widget.
			// Must be an object
			//  {   uri : ...,
			//    [ dimensions : { '64x64' : { uri : ... } } ]
			//  }
			$uploadWidget.append( $( '<input/>',
						 { type : 'hidden', name : 'input_'+Math.floor(Math.random()*65535) }
					       ).data('upload-info',jQuery.parseJSON(response)).addClass('upload-info') );
		    });
		    this.on('error', function(file, response) {
			console.error( "Failed to upload file!" );
			console.error( "Error response: " + response );
			setErrorStatus( 'Failed to upload file: ' + response );
		    } );
		    this.on('sending',function(file,xhr,data) {
			// NOOP
		    });
		}
	    }  );
	} catch( e ) {
	    console.warn( "Failed to initialize the drop zone: " + e );
	}
	// Set visible.
	$( '#upload-widget' ).css( 'display', 'inherit' );
    }
    
    /**
     * Load the first chunk of notes.
     **/
    $btnMore.data('skip',0);
    $btnMore.data('limit',_DISPLAY_LIMIT);
    loadNotes( $btnMore.data('skip'), $btnMore.data('limit') );

    /**
     * Load the category list.
     **/
    loadCategoryList();

    /**
     * Add an RSS icon with link on top of the category list.
     **/
    $( '#category-list' ).prepend( $( '<a/>', { href : 'rss/?cat='+CATEGORY, target : '_blank' } ).append( $('<img/>', { src : 'img/icon_rss.svg' }).addClass('rss-icon') ) );
    
    /**
     * If an ID is passed load the article.
     **/
    if( ID ) {
	var jqxhr = $.getJSON( 'ajax/get.ajax.php?cat=' + encodeURIComponent(CATEGORY) + '&id=' + encodeURIComponent(ID) + '&key=' + encodeURIComponent(KEY) )
	    .done( function( json ) {
		showNoteDialog(json);
		$( '#dialog' ).dialog('open');
	    } )
	    .fail( function(jqxhr, textStatus, error) {
		setErrorStatus( error + ": " + textStatus + " " + jqxhr.responseJSON.message );
	    } )
	    .always( function() {

	    } );
    }


    /**
     * Start a timer that checks for new notes since the latest loaded one
     * since the latest loaded one.
     **/
    window.setInterval( checkForNewNotes, 1000*10 );
} );
