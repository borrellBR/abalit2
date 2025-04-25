<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
  public function editProfile(Request $request)
  {
    $user = auth()->user();
    $user->update($request->only(['name', 'email', 'phone']));
    return response()->json($user);
  }

  public function changePassword(Request $request)
  {
    $user = auth()->user();
    $user->password = Hash::make($request->password);
    $user->save();
    return response()->json(['message' => 'Contraseña actualizada']);
  }
}
