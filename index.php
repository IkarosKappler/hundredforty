<!DOCTYPE html>
<html>
  <head>
    <title>// hundretfourty //</title>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="description" content="Content Description" />
    <meta name="keywords" content="This is not twitter, hundretfourty, hundretforty, shoutbox" />
    <meta name="author" content="Ikaros Kappler" />
    <meta name="date" content="2016-12-01" />

    <script src="js/jquery-3.1.1.min.js"></script>
    <script src="js/jquery-ui.min.js"></script>
    <script src="js/jquery-confirm.min.js"></script>
    <script src="js/jquery-linkify.js"></script>
    <script src="js/jquery-hashtagify.js"></script>
    <script src="js/function.getURIParams.js"></script>
    <script src="js/main.js"></script>
    <!-- <link rel="stylesheet" type="text/css" media="screen" href="css/jquery-ui.css" /> -->
    <link rel="stylesheet" type="text/css" media="screen" href="css/dialog.css" />
    <link rel="stylesheet" type="text/css" media="screen" href="css/jquery-confirm.min.css" />
    <link rel="stylesheet" type="text/css" media="screen" href="css/style.css" />
    <link rel="stylesheet" type="text/css" media="screen" href="css/theme.blue.css" />
  </head>

  <body>

      <div id="hundretforty">
      <h1>//hundretforty//</h1>
         <div id="input-container">
            <textarea id="note-text" maxlength="140" placeholder="Deine Nachricht | Your message"></textarea><br/>
            <div id="sub-input">
               <button id="btn-sendnote">Send</button>
               <span id="textlength">0</span>/140
            </div>
         </div>
         <div id="loading-send" class="invisible"></div>
         <div id="error-status"></div>
         <div id="notes">
            <div id="_template-note" class="note-container hidden" data-id>
               <a class="boxclose"></a>
               <div id="_template-date" class="note-date"></div>
               <div id="_template-data" class="note-data dont-break-out"></div>
            </div>
         </div>
         <button id="btn-more">Load more</button>
         <div id="loading-more" class="invisible"></div>

         <!-- Invisible by default -->
         <div id="dialog" style="display: none;">
            DIALOG
         </div>
      
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
           PHP<br/>
           MySQL<br/>
           AJAX<br/>
           CSS3<br/>
           Emacs<br/>
           Debian Jessie<br/>

          <div id="delete-dialog">

          </div>
      
         </div>
      </div>
  </body>
</html>