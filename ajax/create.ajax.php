<?php
/**
 * @author  Ikaros Kappler
 * @date    2016-11-30
 * @version 1.0.0
 **/

require_once( "../database/bootstrap/autoload.php" );

header( 'Content-Type: text/json; charset=utf-8' );


if( strtoupper($_SERVER['REQUEST_METHOD']) != 'POST' ) {
    header( 'HTTP/1.1 400 Bad Request' );
    echo json_encode( array( 'message' => "Only POST requests supported." ) );
    die();
}

if( !array_key_exists('note',$_POST) ) {
    header( 'HTTP/1.1 400 Bad Request' );
    echo json_encode( array( 'message' => "Param 'note' is missing." ) );
    die();
}

$note       = $_POST['note'];
$cat        = (array_key_exists('cat',$_POST)?$_POST['cat']:'');
$image_refs = (array_key_exists('image_refs',$_POST) ? $_POST['image_refs'] : '{}' );
$author     = (array_key_exists('author',$_POST) ? $_POST['author']:'');

if( strlen($note) > 140 ) {
    header( 'HTTP/1.1 400 Bad Request' );
    echo json_encode( array( 'message' => "Param 'note' is too long." ) );
    die();
}
if( !strlen($note) ) {
    header( 'HTTP/1.1 400 Bad Request' );
    echo json_encode( array( 'message' => "Param 'note' is empty." ) );
    die();
}


$sha256 = hash( 'sha256', time().'_'.$_SERVER['REMOTE_ADDR']."$".$note );


// Check if there are already more than 10 notes from withing the last 5 minutes
$list = Note::
      where('remote_address',$_SERVER['REMOTE_ADDR'])
    ->where('created_at', '>=', DB::raw('DATE_SUB(NOW(), INTERVAL 5 MINUTE)'))
    ->take(11)
    ->get()
    ->toArray();

if( count($list) > 10 ) {
    header( 'HTTP/1.1 449 Too Many Requests' );
    echo json_encode( array( 'message' => "Too many requests. Try again in 5 minutes." ) );
    die();
}


$noteObject = new Note( array( 'data'           => $note,
                               'category'       => $cat,
                               'sha256'         => $sha256,
                               'remote_address' => $_SERVER['REMOTE_ADDR'],
                               'image_refs'     => $image_refs,
                               'referrer'       => $_SERVER['HTTP_REFERER'],
                               'author'         => $author
) );
$noteObject->save();

$noteObject->created_at_ts = strtotime( $noteObject->created_at );

echo json_encode( array( "message" => "Note stored (" . strlen($note) . " chars).",
'note' => $noteObject
) );


// Send notification email
mail( 'info@int2byte.de',
      'Note stored (id='.$noteObject->id.'), cat='.$cat.'.',
      'Note was stored (remote_address=' . $noteObject->remote_address . ")\n".
        'data: ' . $note
);

?>