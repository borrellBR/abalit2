<?php

use Illuminate\Support\Facades\Route;


Route::get('/', fn() => redirect('/home.html'));

Route::get('/login', function () {
  return redirect('login.html');
})->name('login');

Route::get('/register', function () {
  return redirect('register.html');
})->name('register');
