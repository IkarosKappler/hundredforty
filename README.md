# hundretforty

This is a simple note remembererererererer.



Todos:
 * Write docs for the create-script.
 * Write docs for the delete-script.
 * Write docs for the list-script.
 * Write docs for the get-script.
 * Write docs for the main.js file.

Install
-------
 * Create the database <database> (I used MySQL).
 * Download the notes_struct.sql file containing the table structure.
 * Create the table:
    mysql --user <user> --database <database> -p < notes_struct.sql
 * Upload all files from this repository to your www-directory (e.g. to {www-root}/hundredforty/).
 * Edit the database/.env file and enter your database credentials.
 * Done.


File Uploads
------------
Note that there currently is no interface for file uploads. Even though the functionality exists.

Simple file uploads (like images) work by default via the /ajax/imageupload.ajax.php interface. If
you want images automatically to be resized after upload you should install Imagemagick and the PHP
imagemagick library/wrapper.

Test uploads in
 * /tests/test_imageupload.php


Files
-----
 ./database/.env
 This file should contain your DB credentials
 ```
  APP_KEY=SomeRandomString
  DB_USERNAME=
  DB_PASSWORD=
  DB_DATABASE=
  DB_HOST=

.

[2016-12-13, Ika]
 * Added 'category' and hash (sha256) fields.

[2016-12-06, Ika]
 * Added a 'delete' hook for deleting notes.

[2016-12-01, Ika]
 * Created the base files and PDO setup ('Eloquent').
 * Note class location is /app/database/models/Note.php