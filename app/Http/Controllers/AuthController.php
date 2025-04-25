<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
  public function login(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'email' => 'required|email',
      'password' => 'required'
    ]);

    if ($validator->fails()) {
      return response()->json(['errors' => $validator->errors()], 422);
    }

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
      return response()->json(['message' => 'Credenciales incorrectas'], 401);
    }

    return response()->json([
      'token' => $user->createToken('api')->plainTextToken,
      'user' => $user
    ]);
  }

  public function signup(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'name' => 'required|string|max:255',
      'email' => 'required|email|unique:users',
      'password' => 'required|min:6',
      'phone' => 'nullable|string'
    ]);

    if ($validator->fails()) {
      return response()->json(['errors' => $validator->errors()], 422);
    }

    $user = User::create([
      'name' => $request->name,
      'phone' => $request->phone,
      'email' => $request->email,
      'password' => Hash::make($request->password),
    ]);

    return response()->json([
      'token' => $user->createToken('api')->plainTextToken,
      'user' => $user
    ]);
  }

  public function forgotPassword(Request $request)
  {
    // Simulación
    return response()->json(['message' => 'Email de recuperación enviado']);
  }

  public function logout(Request $request)
  {
    $request->user()->tokens()->delete();
    return response()->json(['message' => 'Sesión cerrada']);
  }
}
