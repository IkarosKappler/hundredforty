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
 * @date     2016-12-01
 * @version  1.0.4
 **/


_DISPLAY_LIMIT = 7;


/**
 * Initialize the app.
 **/
$( document ).ready( function() {

    // First of all catch the GET params. We are especially interested
    // in the 'cat' param (category). If left blank, use the empty
    // category ''.
    var URI_PARAMS = getURIParams();
    var CATEGORY   = ('cat' in URI_PARAMS) ? URI_PARAMS['cat'].toLowerCase() : '';
    var ID         = ('id' in URI_PARAMS) ? URI_PARAMS['id'] : '';
    var KEY        = ('key' in URI_PARAMS) ? URI_PARAMS['key'] : '';

    // Fetch frequently asked questions ... ehm ... fetch frequently used DOM objects.
    var $hundredforty = $( '#hundredforty' );                    // The main container.
    var $container    = $hundredforty.find( '#notes' );          // The sub container for all notes.
    var $template     = $container.find( '#_template-note' );    // The note template.
    var $btnLoadNew   = $( '#btn-loadnew' );                     // The button for loading new notes.
    var $btnMore      = $( '#btn-more' );                        // The button for loading more notes.
    var $inputArea    = $hundredforty.find( '#note-text' );      // The text input area (max 140 chars).
    var $categoryList = $hundredforty.find( '#category-list ul' );
    var $_loading     = $( '<img/>', { src : 'img/loading3.svg', width : 32, height : 32 } ); // A loading animation.

    
    // Add loading animations to the loading containers.
    var $loadingSend  = $( '#loading-send' ).append( $_loading.clone() );
    var $loadingMore  = $( '#loading-more' ).append( $_loading.clone() );


    // Init the template with the current timestamp (used for latest 'loaded' timestamp if there
    // are no notes present).
    $template.data('created_at_ts',Math.round(Date.now()/1000)); // Convert milliseconds to seconds.

    // Initially there are no new notes.
    $btnLoadNew.data('num_new',0);
    
    
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
	    /*
	    var jqxhr = $.getJSON( 'ajax/create.ajax.php?cat=' + encodeURIComponent(CATEGORY)+ '&note=' + encodeURIComponent( $inputArea.val() ) )
		.done( function( json ) {
		    // // Note was posted. Add new note element to DOM and clear input area.
		    $note = createNoteNode( json.note );		    
		    $note.insertAfter( $template ); 
		    $inputArea.val('');
		    $textLength.empty().html( '0' );
		} )
		.fail( function(jqxhr, textStatus, error) {
		    setErrorStatus( error + ": " + textStatus + " " + jqxhr.responseJSON.message );
		} )
		.always( function() {
		    $_btn.prop( 'disabled', false );
		    $loadingSend.addClass('invisible');
		} );
	    */
	    // --- BEGIN --------------------------------------
	    var data = new FormData();
            data.append( 'cat',        CATEGORY );
	    data.append( 'note',       $inputArea.val() );
	    data.append( 'image_refs', '{}' );
	    
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

	var rand       = noteData.id; 
	var $note      = $template.clone().removeClass('hidden').attr('id','note_'+rand);
	$note.data('created_at_ts',noteData['created_at_ts']);
	var $showLink  = $( '<a/>', { href   : '?cat=' + encodeURIComponent(CATEGORY) + '&id=' + encodeURIComponent(noteData.id) + '&key=' + encodeURIComponent(noteData.sha256),
				      name   : 'note_'+noteData.id,
				      target : '_blank'
				    } ).addClass('inner-link').addClass('clickable').html( $linkImage ); // '&#x1f517;' );    
	$note.find( '#_template-date' ).attr('id','template-date-'+rand).empty().html( $showLink ).append( ' '+noteData.created_at );
	$note.find('a.boxclose').click( function() { requestDelete(noteData); } ); 
	$note.find( '#_template-data' ).attr('id','template-data-'+rand).empty().html( formatText(noteData.data) ).linkify().hashtagify();
	return $note;
    };


    
    var processResult = function( data, appendBefore ) {
	clearErrorStatus();
	console.debug( data );
	data.list.forEach( function(noteData) {
	    console.debug( JSON.stringify(noteData) );
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
	console.debug( 'Loading ' + numNew + ' new records ...' );
	// Load the next new [n] notes.
	$btnLoadNew.css( 'visibility', 'hidden' );
	loadNotes( 0, numNew, true );  // true -> append before	
    } );
    
    $btnMore.click( function() {
	console.debug( "btn.data.skip=" + $btnMore.data('skip') + ", btn.data.limit=" + $btnMore.data('limit') );
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
	console.log( 'Checking for new notes ...' );
	clearErrorStatus();
	// The first note container is th _template container, which is OK!
	var $secondNoteContainer = $( '.note-container:nth-child(2)');
	//console.debug( $secondNoteContainer.length );
	var since = -1;
	if( $secondNoteContainer.length ) since = $secondNoteContainer.data('created_at_ts'); // '2016-12-01';
	else                              since = $tamplate.data('created_at_ts');
	var jqxhr = $.getJSON( 'ajax/checknew.ajax.php?cat=' + encodeURIComponent(CATEGORY) + '&since=' + since )
		.done( function( json ) {
		    console.debug( JSON.stringify(json) );
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
	console.debug( "Loading categories ... ");
	$categoryList.empty();
	var jqxhr = $.getJSON( 'ajax/categories.ajax.php' )
	    .done( function( json ) {
		//processResult(json,appendBefore);
		console.debug( "Categories: " + JSON.stringify(json) );
		for( var index in json.list ) {
		    var cat = json.list[index];
		    console.debug( "category: " + JSON.stringify(cat) );
		    $categoryList.append( $( '<li/>' ).html( '<a href="?cat=' + cat.name + '">' + (cat.name==''?'<i>none</i>':cat.name) + '</a>' ) );
		}
	    } )
	    .fail( function(jqxhr, textStatus, error) {
		$categoryList.html( "Error: " + textStatus + " " + error );
	    } );
    }
    
    
    /**
     * A wrapper for the text-length display.
     **/
    var $textLength = $( 'span#textlength' );
    $inputArea.keyup( function() {
	$textLength.empty().html( $inputArea.val().length );
    } );


    
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
		//$btnMore.prop( 'disabled', false );
		//$loadingMore.addClass('invisible');
	    } );
    }


    /**
     * Start a timer that checks for new notes since the latest loaded one
     * since the latest loaded one.
     **/
    window.setInterval( checkForNewNotes, 1000*10 );
} );
