<?php
/**
 * This script checks if there are new records since
 * a given time stamp.
 *
 * @author  Ikaros Kappler
 * @date    2017-01-05
 * @version 1.0.0
 **/
header( "Content-Type: text/json; charset=utf-8" );

require_once( "../database/bootstrap/autoload.php" );

$since = null;
if( !array_key_exists('since',$_GET) ) {
    header( 'HTTP/1.1 400 Bad Request' );
    echo json_encode( array( 'message' => "Param 'since' is missing." ) );
    die();
}

$since = $_GET['since'];
$cat   = (array_key_exists('cat',$_GET) ? $_GET['cat'] : '');

if( !$since || strlen($since) == 0 ) {
    header( 'HTTP/1.1 400 Bad Request' );
    echo json_encode( array( 'message' => "Param 'since' is empty." ) );
    die();
}

    
//$results = DB::select('select * from notes;', array(1));

$result = Note::
    select(DB::raw('COUNT(notes.id) as num_new'))
    ->whereNull('deleted_at')
    ->where('category',$cat)
                              ->where(DB::raw('UNIX_TIMESTAMP(created_at)'),'>',$since)    // MySQL allows comparison of DATETIME and TIMESTAMP formats :)
        //->skip($skip)
    ->take($limit)
        //->orderBy('created_at','desc')
    ->get()
                              ->first()
    ->toArray();

// print_r( $result );

$result = array( 'meta' => array( 'since' => $since ),
                 'count' => $result['num_new'] );
echo json_encode( $result, JSON_PRETTY_PRINT );


?>