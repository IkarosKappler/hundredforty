<?php
/**
 * @author  Ikaros Kappler
 * @date    2016-12-21
 * @version 1.0.0
 **/

//namespace Matriphe\Imageupload;
//namespace Imagine\Imagick;

//use \Imagine;

class Config {
    public static function get( $name, $default = FALSE ) {
        if( $name == 'imageupload.library' )
            return 'imagick_raw';
        else if( $name == 'imageupload.dimensions' )
            return array( '64x64' => array(64,64,false),
            '128x128' => array(128,128,false)
            );
        else if( $name == 'imageupload.newfilename' )
            return 'custom';
        else
            return $default;
    }
}
function public_path() {
    return '../public';
}
function public_uri() {
    return '/public';
}
//namespace Imagine\Imagick;
//$imagine = new \Imagine\Imagick\Imagine();
//$imagine = new Imagine();
//use \Imagine\Imagick\Imagine as Imagick;
//use Imagick as \Imagine\Imagick\Imagine;

//require_once( "../lib/imageupload/src/Matriphe/Imageupload/Imageupload.php" );
require_once( '../lib/Imageupload.php' );
//require_once( "../Matriphe/Imageupload/Imageupload.php" );

//require_once( "../database/vendor/league/flysystem/src/Config.php" );
//echo "Class Config=";
//print_r( Config::class );
//echo "\n";

//require_once( "../database/vendor/league/flysystem/src/Handler.php" );
//require_once( "../database/vendor/league/flysystem/src/File.php" );
//use \League\File as File;

class File {

    protected $path;
    protected $meta;
    
    public static function isWritable($path) {
        return is_writable($path);
    }

    public static function isDirectory($path) {
        return is_dir($path);
    }
    /*
    public static function move( $newPath, $oldPath ) {
        return rename( $oldPath, $newPath );
    }
    */

    public static function makeDirectory($path, $mode = FALSE, $_foo = FALSE) {
        mkdir($path);
        chmod($path,$mode);
    }

    public function __construct($path, $uploadMeta) {
        $this->path = $path;
        $this->meta = $uploadMeta;
    }

    public function getPath() { return $this->path; }
    
    public function move( $newDir, $newName ) {
        //echo "file exists? " . file_exists($this->path) ."\n";
        return rename( $this->path, $newDir.DIRECTORY_SEPARATOR.$newName );
    }
    
    public function getMimeType() {
        return $this->meta['type']; // NOT SAFE!!!
    }

    public function getClientOriginalName() {
        //echo "original=" . $this->meta['name'];
        //print_r( $this->meta );
        return $this->meta['name'];
    }

    public function getClientOriginalExtension() {
        return pathinfo($this->meta['name'], PATHINFO_EXTENSION);
    }

    public function getRealPath() {
        return realpath($this->path);
    }

    public function getSize() {
        return filesize($this->path);
    }
}

header( 'Content-Type: text/json; charset=utf-8' );

//echo "Class=".Imageupload::class;

if( $_SERVER['REQUEST_METHOD'] != 'POST' ) {
    header( 'HTTP/1.1 400 Bad Request' );
    echo json_encode( array( 'message' => "Request method must be POST." ) );
    die();
}

if( !$_FILES || count($_FILES) == 0 ) {
    header( 'HTTP/1.1 400 Bad Request' );
    echo json_encode( array( 'message' => "No files passed." ) );
    die();
}


//echo "_POST=";
//print_r( $_POST );
//echo "\n";
//echo "_FILES=";
//print_r( $_FILES );
//echo "\n";

//$uploader = new \Matriphe\Imageupload\Imageupload();
$uploader = new Imageupload();
$result = array();
foreach( $_FILES as $key => $file ) {
    $uploader->results['original_filename'] = $file['name'];
    $result[] = $uploader->upload( new File($file['tmp_name'],$file),
                                   date('Ymd-His') . '-' . $file['name']
    );
}
echo json_encode( $result, JSON_PRETTY_PRINT );

?>