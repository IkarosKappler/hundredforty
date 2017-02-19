<!DOCTYPE html>
<html>
  <head>
    <title>// hundredforty //</title>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="description" content="Content Description" />
    <meta name="keywords" content="This is not twitter, hundredforty, hundredforty, shoutbox" />
    <meta name="author" content="Ikaros Kappler" />
    <meta name="date" content="2016-12-01" />

    <script src="js/jquery-3.1.1.min.js"></script>
    <script src="js/jquery-ui.min.js"></script>
    <script src="js/jquery-confirm.min.js"></script>
    <script src="js/jquery-linkify.js"></script>
    <script src="js/jquery-hashtagify.js"></script>
    <script src="js/function.getURIParams.js"></script>
    <script src="js/dropzone.js"></script>
    <script src="config.js"></script>
    <script src="js/main.js"></script>

    <link rel="stylesheet" type="text/css" media="screen" href="css/jquery-ui.css" />
    <link rel="stylesheet" type="text/css" media="screen" href="css/jquery-confirm.min.css" />
    <link rel="stylesheet" type="text/css" media="screen" href="css/dialog.css" />
    <link rel="stylesheet" href="css/dropzone.css" />
    <link rel="stylesheet" type="text/css" media="screen" href="css/style.css" />
    <link rel="stylesheet" type="text/css" media="screen" href="css/theme.blue.css" />
  </head>

  <body>

      <div id="hundredforty">
      <h1>//hundredforty//</h1>
         <div id="input-container">
            <textarea id="note-text" placeholder="Deine Nachricht | Your message"></textarea><br/>
            <div id="sub-input">
               <button id="btn-sendnote">Send</button>
               <span id="textlength">0</span>/140
            </div>
            <div id="upload-widget" class="dropzone"></div>
         </div>
         <div id="loading-send" class="invisible"></div>
         <div id="error-status"></div>
         <div id="category-list">
            <h4>Categories</h4>
            <ul></ul>
         </div>
      
         <!-- Invisible by default -->
         <div id="dialog" class="no-display"></div>

         <button id="btn-loadnew">Load new</button>
      
         <div id="notes">
            <div id="_template-note" class="note-container hidden">
               <a class="boxclose"></a>
               <div id="_template-date" class="note-date"></div>
               <div id="_template-data" class="note-data dont-break-out"></div>
               <div id="_template-media"></div>
            </div>
         </div>
         <button id="btn-more">Load more</button>
         <div id="loading-more" class="invisible"></div>
      
         <div id="hint">
            Hello there. I just wrote this app and wanted to give my jQuery and Eloquent skills a try. This app stores your 140 character message and displays it here. I hope you like it.<br/>
           <br/>
           Built with</br>
           jQuery<br/>
           Eloquent PDO</br>
           jQuery-linkify<br/>
           <br/>
           and the other ordinary stuff<br/>
           HTML5<br/>
           Javascript<br/>
           PHP 7.0<br/>
           MySQL<br/>
           AJAX<br/>
           CSS3<br/>
           Emacs<br/>
           Debian Jessie<br/>
           FontAwesome (Icons)<br/>

          <div id="delete-dialog">

          </div>
      
         </div>
      </div>
  </body>
</html>