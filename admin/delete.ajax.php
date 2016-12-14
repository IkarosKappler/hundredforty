<?php
/**
 * @author  Ikaros Kappler
 * @date    2016-11-30
 * @version 1.0.0
 **/

require_once( "../database/bootstrap/autoload.php" );

header( 'Content-Type: text/json; charset=utf-8' );


if( !array_key_exists('id',$_GET) ) {
    header( 'HTTP/1.1 400 Bad Request' );
    echo json_encode( array( 'message' => "Param 'id' is missing." ) );
    die();
}
if( !array_key_exists('key',$_GET) ) {
    header( 'HTTP/1.1 400 Bad Request' );
    echo json_encode( array( 'message' => "Param 'key' is missing." ) );
    die();
}

$id  = $_GET['id'];
$key = $_GET['key'];

if( !is_numeric($id) ) {
    header( 'HTTP/1.1 400 Bad Request' );
    echo json_encode( array( 'message' => "Param 'id' is not numeric." ) );
    die();
}

if( $key == '' ) {
    header( 'HTTP/1.1 400 Bad Request' );
    echo json_encode( array( 'message' => "Param 'key' is empty." ) );
    die();
}


// Check if there are already more than 10 notes from withing the last 5 minutes
$affected = Note::
      where('id',$id)
    ->where('sha256',$key)
    ->whereNull('deleted_at')
    ->take(1)
    ->update( array( 'deleted_at' => DB::raw('NOW()') ) );

//->save();

if( !$affected ) {
    header( 'HTTP/1.1 404 Not Found' );
    echo json_encode( array( 'message' => 'ID not found.' ) );
    die();
}


echo json_encode( array( "message" => "Note marked as deleted." ) );


?>