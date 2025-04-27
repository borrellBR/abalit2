<?php

use Illuminate\Support\Facades\Route;


// definimos stores.html como rootpage
Route::get('/', fn() => redirect('/home.html'));

// Rutas de autenticación
Route::get('/login', function () {
  return redirect('login.html');
})->name('login');

Route::get('/register', function () {
  return redirect('register.html');
})->name('register');
