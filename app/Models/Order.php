<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
  use HasFactory;

  protected $fillable = [
    'user_id',
    'pickup_day',
    'pickup_time',
    'address',
    'payment_type',
    'status',
  ];

  public function user()
  {
    return $this->belongsTo(User::class);
  }
}
