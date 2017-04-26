<?php
/**
 * @author Ikaros Kappler
 * @date   2017-03-29 
 **/

header( "Content-Type: text/json; charset=utf-8" );

require_once( "../database/bootstrap/autoload.php" );

$limit  = 12;
if( !array_key_exists('search',$_GET) ) {
    header( 'HTTP/1.1 400 Bad Request' );
    echo json_encode( array( 'message' => "Param 'search' is missing." ) );
    die();
}
$search = $_GET['search'];
if( array_key_exists('limit',$_GET) ) {
    $limit = $_GET['limit'];
    if( !is_numeric($limit) ) {
         header( 'HTTP/1.1 400 Bad Request' );
         echo json_encode( array( 'message' => "Param 'limit' is not numeric." ) );
         die();
    }
}


$cat = (array_key_exists('cat',$_GET) ? $_GET['cat'] : '');

$list = Note::
      select(DB::raw('*,UNIX_TIMESTAMP(created_at) AS created_at_ts'))
    ->whereNull('deleted_at')
    ->where('category',$cat)
    ->where(DB::raw('LOWER(data)'),'LIKE','%'.strtolower($search).'%')
    // ->skip($skip)
    ->take($limit)
    ->orderBy('created_at','desc')
    ->get()
    ->toArray();

$result = array( 'meta' => array( 'limit' => $limit ),
                 'list' => $list );
echo json_encode( $result, JSON_PRETTY_PRINT );


?>