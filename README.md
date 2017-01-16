# hundredforty

This is a simple note remembererererererer.



Todos:
 * Write docs for the create-script.
 * Write docs for the delete-script.
 * Write docs for the list-script.
 * Write docs for the get-script.
 * Write docs for the main.js file.
 * Bug: If note is deleted then loading more fails about one record.
 * DONE. Category listing.
 * DONE. Category blacklist.
 * Hashtag search.
 * DONE. Image uploads.
 * URL shortener.
 * Handle generic file uploads that do not return thumbnails.

Files
-----
 ./database/.env
 This file should contain your DB credentials
```text
  APP_KEY=SomeRandomString
  DB_USERNAME=
  DB_PASSWORD=
  DB_DATABASE=
  DB_HOST=
```

Include the script
------------------
...

Create the MySQL/Maria database
-------------------------
```sql
CREATE TABLE IF NOT EXISTS `notes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `data` varchar(140) COLLATE utf8_unicode_ci NOT NULL,
  `category` varchar(256) COLLATE utf8_unicode_ci NOT NULL DEFAULT '' COMMENT 'A category.',
  `sha256` varchar(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '' COMMENT 'A hash.',
  `remote_address` varchar(40) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL DEFAULT '',
  `referrer` varchar(256) COLLATE utf8_unicode_ci NOT NULL DEFAULT '' COMMENT 'The HTTP referrer website.',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `image_refs` varchar(4096) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `deleted_at` (`deleted_at`),
  KEY `category` (`category`(255),`sha256`),
  KEY `referrer` (`referrer`(255))
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=243 ;
```


HTML
----
```html
    <div id="hundredforty">
      <h1>//hundredforty//</h1>
         <div id="input-container">
            <textarea id="note-text" maxlength="140" placeholder="Deine Nachricht | Your message"></textarea><br/>
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
   </div>
```

[2017-01-16, Ika, v1.0.5]
 * Added image uploads.
 * Added the 'referrer' field to the database.

[2017-01-08, Ika, v1.0.4]
 * Added a category listing hook: ajax/categories.ajax.php.
 * Added a category blacklist in the file '.category_blacklist'.
 * Displaying categories on the frontend.

[2017-01-07, Ika, v1.0.3]
 * Added a new column to the notes database: 'image_refs'.
 * Added a HTTP method check to the create-note script.
 * Changed the create-note method from GET to POST.
 * Prepared image URL uploads.

[2017-01-06, Ika, v1.0.2]
 * Added a 'There are new notes' button which loads new
   available records at the top of the list.

[2017-01-05, Ika]
 * Additionally returning the 'created_at' field as a UNIX timestamp in the
   AJAX scripts.
 * Added a new AJAX script: checknew.ajax.php.

[2016-12-13, Ika]
 * Added 'category' and hash (sha256) fields.

[2016-12-06, Ika]
 * Added a 'delete' hook for deleting notes.

[2016-12-01, Ika]
 * Created the base files and PDO setup ('Eloquent').
 * Note class location is /app/database/models/Note.php