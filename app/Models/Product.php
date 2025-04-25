<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
  use HasFactory;

  protected $fillable = [
    'name',
    'description',
    'price',
    'category_id',
    'image'
  ];

  public function category()
  {
    return $this->belongsTo(Category::class);
  }
}
