<?php
/**
 * Get a list of all categories (except those that are listed on the blacklist).
 *
 * @author  Ikaros Kappler
 * @date    2017-01-08
 * @version 1.0.0
 **/

header( "Content-Type: text/json; charset=utf-8" );

define( 'BLACKLIST_FILE', '../.category_blacklist' );

$_CATEGORY_BLACKLIST = array(); 
if( file_exists(BLACKLIST_FILE) && is_readable(BLACKLIST_FILE) ) {
    $_CATEGORY_BLACKLIST = explode("\n", file_get_contents(BLACKLIST_FILE));
}

require_once( "../database/bootstrap/autoload.php" );

$list = DB::table('notes')
    ->select( DB::raw('category as name') )
    ->distinct()
    ->whereNull('deleted_at');
foreach( $_CATEGORY_BLACKLIST as $exclude ) {
    $exclude = trim($exclude);
    if( strlen($exclude) == 0 )
        continue;
    $list = $list->where('category','NOT LIKE',$exclude);
}
$list = $list
    ->orderBy('category','desc')
    ->get();

$result = array( 'meta' => array(),
                 'list' => $list );
echo json_encode( $result, JSON_PRETTY_PRINT );


?>