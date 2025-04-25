<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

  public function show(Request $r)
  {
    return $r->user();
  }

  public function update(Request $r)
  {
    $data = $r->validate([
      'name' => 'required|string|max:255',
      'email' => 'required|email|max:255|unique:users,email,' . $r->user()->id,
      'phone' => 'nullable|string|max:20'
    ]);
    $r->user()->update($data);
    return $r->user();
  }

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
