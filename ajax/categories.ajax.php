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

$_CATEGORY_BLACKLIST = array(); // array( '%nsfw%' );
if( file_exists(BLACKLIST_FILE) && is_readable(BLACKLIST_FILE) ) {
    //echo "Reading blacklist " . $_BLACKLIST_FILE . " ...\n";
    /*
    $file = fopen(BLACKLIST_FILE, "r");
    while( !feof($file) ) {      
        $line_of_text = fgets($file);
        //echo $line_of_text . "\n";
        $tmp = explode('\n',$line_of_text);
        //$_CATEGORY_BLACKLIST = $_CATEGORY_BLACKLIST + explode('\n', $line_of_text);
        foreach( $tmp as $line )
            $_CATGEORY_BLACKLIST[] = trim($line);
    }
    fclose($file);
    */
    $_CATEGORY_BLACKLIST = explode("\n", file_get_contents(BLACKLIST_FILE));
    //print_r( $_CATEGORY_BLACKLIST );
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
    //echo "ignoring: " . $exclude . "\n";
    $list = $list->where('category','NOT LIKE',$exclude);
}
$list = $list
    ->orderBy('category','desc')
    ->get();

$result = array( 'meta' => array(),
                 'list' => $list );
echo json_encode( $result, JSON_PRETTY_PRINT );


?>