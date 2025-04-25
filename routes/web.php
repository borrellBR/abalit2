<?php

use Illuminate\Support\Facades\Route;


// definimos stores.html como rootpage
Route::get('/', fn() => redirect('categories.html'));
