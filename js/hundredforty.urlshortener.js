/**
 * This a basic URL shortener using remote URL shortener service via jQuery.ajax().
 *
 * Usage A (pass a single URL):
 *  new URLShortener().shortenURL( 'http://www.yourwebsite.com/any/location/you/want/', 
 *                                 function( shortURL ) { }, 
 *                                 function{ error ) { }
 *                               )
 *
 * Usage B (pass an array of URLs):
 *  new URLShortener().shortenArray( [ 'http://www.yourwebsite.com', 'https://yourfriendswebsite.net' ], 
 *                                   function( shortURLs ) { }, 
 *                                   function{ error ) { }
 *                               )
 * Usage C (pass a full text with URLs):
 *  new URLShortener().shortenText( 'For further information visit http://www.bing.com. Maybe also http://google.com has anwers.' ], 
 *                                  function( shortenedText ) { }, 
 *                                  function{ error ) { }
 *                               )
 *
 * @require jQuery
 *
 * @author  Ikaros Kappler
 * @date    2017-02-25
 * @version 1.0.0
 **/


var URLShortener = (function($) {

    /**
     * If you don't want to use func.name's url shortener use
     * any other shortener of your need here.
     **/
    var REQUEST_URL = 'https://url.func.name/shorten/{url}';

    /**
     * @param urls A a single URL or an array of URLs.
     * @param onComplete function( shortenedURLs )
     * @param onFail function( error, index )
     **/
    function shortenURL( url, onComplete, onFailure ) {
	this.shortenArray( [url], function(urls) { onComplete(urls[0]) }, onFailure );
    }
    
    /**
     * @param urls A a single URL or an array of URLs.
     * @param onComplete function( shortenedURLs )
     * @param onFail function( error, index )
     **/
    function shortenArray( urls, onComplete, onFailure ) {
	var i = 0;
	var shortenedURLs = [];	
	_shorten( urls, 0, shortenedURLs, onComplete, onFailure );
    }

    /**
     * This function shortens all URLs in the passed text.
     *
     * @
     **/
    function shortenText( text, onComplete, onFailure ) {
	// First detect and collect all URLs and build a temp string with placeholders.
	// Found this RegEx at
	//    http://stackoverflow.com/questions/1500260/detect-urls-in-text-with-javascript
	var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	var urls = [];
	var tmpText = text.replace(urlRegex, function(url) {
	    urls.push( url );
	    // The '%%' cannot be contained in properly formed URLs :)
            return '%%url{'+(urls.length-1)+'}%%';
	} );
	var shortenedURLs = [];
	function handleComplete( shortenedURLs ) {
	    for( var i = 0; i < shortenedURLs.length; i++ ) {
		tmpText = tmpText.replace('%%url{'+i+'}%%',shortenedURLs[i]);
	    }
	    onComplete( tmpText );
	};
	_shorten( urls, 0, shortenedURLs, handleComplete, onFailure );
    }
    
    /**
     * The actual (non public) function that sends the request.
     *
     * @param urls An array of URLs.
     * @param i    The index of the next URL to process.
     * @param 
     **/
    function _shorten( urls, i, shortenedURLs, onComplete, onFailure ) {
	if( i >= urls.length ) {
	    onComplete( shortenedURLs );
	    return;
	}
	$.ajax( { url : 'https://url.func.name/shorten/'+urls[i] } )
	    .done(function( data ) {
		shortenedURLs.push( data );
		_shorten( urls, i+1, shortenedURLs, onComplete, onFailure );
	    })
	    .fail(function( error ) {
		console.debug( JSON.stringify(error) );
		onFailure( error, i );
	    });
	
    }
    
    function URLShortener() {
	this.shortenURL   = shortenURL;
	this.shortenArray = shortenArray;
	this.shortenText  = shortenText;
    }

    return URLShortener;
})($);
