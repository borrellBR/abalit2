<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
  public function setOrder(Request $request)
  {
    $order = Order::create([
      'user_id' => auth()->id(),
      'pickup_day' => $request->pickup_day,
      'pickup_time' => $request->pickup_time,
      'address' => $request->address,
      'payment_type' => $request->payment_type,
    ]);

    return response()->json($order);
  }

  public function getOrderHistory(Request $request)
  {
    return Order::where('user_id', auth()->id())->get();
  }
}
