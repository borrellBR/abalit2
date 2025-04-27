<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::get('/categories', [CategoryController::class, 'index']);


Route::middleware('auth:sanctum')->group(function () {

  Route::get('/user', [UserController::class, 'show']);
  Route::put('/user', [UserController::class, 'update']);
  Route::post('/logout', [AuthController::class, 'logout']);

  Route::apiResource('products', ProductController::class)
    ->only(['store', 'update', 'destroy']);

  Route::apiResource('categories', CategoryController::class)
    ->only(['show', 'store', 'update', 'destroy']);

  Route::apiResource('orders', OrderController::class);
});
