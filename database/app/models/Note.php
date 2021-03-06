<?php
//namespace App\models;
/**
 * Class Note
 *
 * @property-read  int    $id
 * @property-read  string $created_at {@type date}
 * @property-read  string $updated_at {@type date}
 * @property       string $data
 * 
 */
class Note extends Eloquent
{
    
    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'notes';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [ //TODO: edit fillable
        'data',
        'category',
        'sha256',
        'remote_address',
        'image_refs',
        'referrer'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'remote_address',
        'referrer'
    ];

}
