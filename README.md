# hundretforty

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

Files
-----
 ./database/.env
 This file should contain your DB credentials
  APP_KEY=SomeRandomString
  DB_USERNAME=
  DB_PASSWORD=
  DB_DATABASE=
  DB_HOST=

.

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