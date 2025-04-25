<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens; // <--- AÑADE ESTO
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
  use HasApiTokens, HasFactory; //

  protected $fillable = [
    'name',
    'email',
    'password',
    'phone',
    'user_type',
  ];

  protected $hidden = [
    'password',
    'remember_token',
  ];

  public function orders()
  {
    return $this->hasMany(Order::class);
  }
}
