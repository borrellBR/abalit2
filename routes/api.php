<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;

// Rutas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
  Route::get('/user', function (Request $request) {
    return $request->user();
  });

  Route::apiResource('products', ProductController::class);
  Route::apiResource('categories', CategoryController::class);
  Route::apiResource('orders', OrderController::class);
  Route::apiResource('user', UserController::class);
  Route::post('/logout', [AuthController::class, 'logout']);
});
