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
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::post('/products/get', [ProductController::class, 'index']);


// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
  Route::get('/user', function (Request $request) {
    return $request->user();
  });

  Route::apiResource('products', ProductController::class)
    ->only(['store', 'update', 'destroy']);

  Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);

  Route::apiResource('orders', OrderController::class);
  Route::apiResource('user', UserController::class);
  Route::post('/logout', [AuthController::class, 'logout']);
});
