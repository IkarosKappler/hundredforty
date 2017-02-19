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
 * @date     2016-12-01
 * @version  1.0.8
 **/


_DISPLAY_LIMIT        = 7;

_ALLOW_FILE_UPLOADS   = true;
_IMAGE_URL_BASE       = 'https://files.func.name';
_UPLOAD_URL           = _IMAGE_URL_BASE + '/ajax/imageupload.ajax.php';

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
    var ID             = ('id' in URI_PARAMS) ? URI_PARAMS['id'] : '';
    var KEY            = ('key' in URI_PARAMS) ? URI_PARAMS['key'] : '';

    // Fetch frequently asked questions ... ehm ... fetch frequently used DOM objects.
    var $hundredforty  = $( '#hundredforty' );                    // The main container.
    var $container     = $hundredforty.find( '#notes' );          // The sub container for all notes.
    var $template      = $container.find( '#_template-note' );    // The note template.
    var $uploadWidget  = $( '#upload-widget' );                   // A dropzone for file uploads.
    var $uploadPreview = $( '#upload-preview' );                  // An area for previewing uploaded images.
    var $btnLoadNew    = $( '#btn-loadnew' );                     // The button for loading new notes.
    var $btnMore       = $( '#btn-more' );                        // The button for loading more notes.
    var $inputArea     = $hundredforty.find( '#note-text' );      // The text input area (max 140 chars).
    var $categoryList  = $hundredforty.find( '#category-list ul' );
    var $_loading      = $( '<img/>', { src : 'img/loading3.svg', width : 32, height : 32 } ); // A loading animation.

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
	$loadingSend.removeClass('invisible');
	$_btn = $(this);
	$_btn.prop( 'disabled', 'disabled' );
	window.setTimeout( function() {
	    // --- BEGIN --------------------------------------
	    var image_refs = [];
	    //var urlBase    = 'https://files.func.name';
	    var j          = 0;
	    $('.upload-info').each( function(index) {
		var uploadInfo = $(this).data('upload-info'); // Array
		for( var i = 0; i < uploadInfo.length; i++ ) {
		    var info = uploadInfo[i];
		    //console.debug( 'uploadInfo=' + JSON.stringify(uploadInfo[i]) );
		    image_refs[j] = { image_url_base : _IMAGE_URL_BASE, uri : info.uri };
		    if( ('dimensions' in info) && ('64x64' in info['dimensions']) )
			image_refs[j].thumbnail = info['dimensions']['64x64'].uri;
		    //console.debug('refs '+index+'=' + image_refs[index] );
		    j++;
		}
	    } );
	    var data = new FormData();				     
            data.append( 'cat',            CATEGORY );
	    data.append( 'note',           $inputArea.val() );
	    data.append( 'image_refs',     JSON.stringify(image_refs) );
	    
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
	var $container = $hundredforty.find( '#notes' );

	var $linkImage = $( '<img/>', { src : 'img/link_symbol.svg', width : 16, height : 16 } ).css( { width : '16px', height : '16px' } );
	
	var newID      = 'template-data-'+noteData.id; 
	var $note      = $template.clone().removeClass('hidden').attr('id','note_'+noteData.id);
	$note.data('created_at_ts',noteData['created_at_ts']);
	var $showLink  = $( '<a/>', { href   : '?cat=' + encodeURIComponent(CATEGORY) + '&id=' + encodeURIComponent(noteData.id) + '&key=' + encodeURIComponent(noteData.sha256),
				      name   : 'note_'+noteData.id,
				      target : '_blank'
				    } ).addClass('inner-link').addClass('clickable').html( $linkImage ); // '&#x1f517;' );    
	$note.find( '#_template-date' ).attr('id','template-date-'+noteData.id).empty().html( $showLink ).append( ' '+noteData.created_at );
	$note.find('a.boxclose').click( function() { requestDelete(noteData); } ); 
	$note.find( '#_template-data' ).attr('id',newID).empty().html( formatText(noteData.data) ).linkify().hashtagify();
	$mediaContainer = $note.find( '#_template-media' ).attr('id','template-media-'+noteData.id);
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
	//console.debug( data );
	data.list.forEach( function(noteData) {
	    //console.debug( JSON.stringify(noteData) );
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
	//$btnMore.data( 'skip', $btnMore.data('skip') + numNew );
	//console.debug( 'Loading ' + numNew + ' new records ...' );
	// Load the next new [n] notes.
	$btnLoadNew.css( 'visibility', 'hidden' );
	loadNotes( 0, numNew, true );  // true -> append before	
    } );
    
    $btnMore.click( function() {
	//console.debug( "btn.data.skip=" + $btnMore.data('skip') + ", btn.data.limit=" + $btnMore.data('limit') );
	//$loadingMore.removeClass('invisible');
	$btnMore.prop( 'disabled', 'disabled' );
	loadNotes( $btnMore.data('skip'), $btnMore.data('limit'), false );  // false -> don't append before (append after)
    } );


    /**
     * Send the next load-request to the server. The answer should be
     * a JSON obejct with n more tweets .... ehhm notes.
     **/
    var loadNotes = function( skip, limit, appendBefore ) {
	$loadingMore.removeClass('invisible');	
	//$btnMore.prop( 'disabled', 'disabled' );
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
	//$( '#dialog' ).dialog('open');
    }


    
    var checkForNewNotes = function() {
	//console.log( 'Checking for new notes ...' );
	clearErrorStatus();
	// The first note container is th _template container, which is OK!
	var $secondNoteContainer = $( '.note-container:nth-child(2)');
	//console.debug( $secondNoteContainer.length );
	var since = -1;
	if( $secondNoteContainer.length ) since = $secondNoteContainer.data('created_at_ts'); // '2016-12-01';
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



    /**
     * Initialize the drop zone.
     **/
    if( _ALLOW_FILE_UPLOADS ) {
	try {
	    //Dropzone.autoDiscover = false;
	    var formData = new FormData();
	    //formData.append( file ); ???
	    dropZone = new Dropzone('#upload-widget', {
		url                : _UPLOAD_URL, // 'https://files.func.name/ajax/imageupload.ajax.php',
		method             : 'post',
		// withCredentials    : true,   // DO NOT SET FOR CORS!
		paramName          : 'file',
		maxFilesize        : 2, // MB
		addRemoveLinks     : true,
		maxFiles           : 5,
		//previewsContainer  : '#upload-preview',
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
		acceptedFiles      : 'image/*',
		init: function() {
		    this.on("addedfile", function(file) {
			$uploadPreview.css( 'display', 'inherit' );
		    });
		    this.on('success', function( file, response ) {			
			//console.debug('success. file=' + file + ', response=' + response );
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
		    this.on('sending',function(file,xhr,data){
			//console.debug( 'Sending ... data: ' + data );
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
