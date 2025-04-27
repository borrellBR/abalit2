<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
  protected $fillable = ['name', 'description', 'price', 'image', 'category_id'];
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


  public function category()
  {
    return $this->belongsTo(Category::class);
  }
}
