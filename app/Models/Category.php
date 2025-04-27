<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
  protected $fillable = ['name', 'description', 'image'];
  protected $appends = ['image_url'];


  public function getImageUrlAttribute(): string
  {
    if (!$this->image) {
      return asset('img/placeholder.jpg');
    }
    if (preg_match('#^https?://#i', $this->image)) {
      return $this->image;
    }
    return asset("storage/{$this->image}");
  }


  public function products()
  {
    return $this->hasMany(Product::class);
  }


}
