<?php

// app/Models/Category.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
  protected $fillable = ['name', 'description', 'image'];
  protected $appends = ['image_url'];


  // Accessor: siempre devuelve la URL válida en `image_url`
  // app/Models/Category.php (y análogo en Product.php)
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
