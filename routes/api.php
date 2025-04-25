<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;

/* --------------------------------------------------------------------------
 |  RUTAS  PÚBLICAS  (no requieren token)                                   |
 * ------------------------------------------------------------------------*/

//  ──  auth  ───────────────────────────────────────────────────────────────
Route::post('/login', [AuthController::class, 'login']);
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

//  ──  lectura de recursos  ────────────────────────────────────────────────
Route::get('/products', [ProductController::class, 'index']);   // lista
Route::get('/products/{id}', [ProductController::class, 'show']);    // detalle

// 👉  lista de categorías (la Home la necesita sin autenticación)
Route::get('/categories', [CategoryController::class, 'index']);


/* --------------------------------------------------------------------------
 |  RUTAS  PROTEGIDAS  (token Sanctum)                                      |
 * ------------------------------------------------------------------------*/
Route::middleware('auth:sanctum')->group(function () {

  // ── usuario ───────────────────────────────────────────────────────────
  Route::get('/user', [UserController::class, 'show']);   // ver perfil
  Route::put('/user', [UserController::class, 'update']); // editar perfil
  Route::post('/logout', [AuthController::class, 'logout']);

  // ── productos ─────────────────────────────────────────────────────────
  Route::apiResource('products', ProductController::class)
    ->only(['store', 'update', 'destroy']);

  // ── categorías ────────────────────────────────────────────────────────
  //    «index» ya es público, aquí protegemos el resto de acciones
  Route::apiResource('categories', CategoryController::class)
    ->only(['show', 'store', 'update', 'destroy']);

  // ── pedidos ───────────────────────────────────────────────────────────
  Route::apiResource('orders', OrderController::class);
});
