<?php
namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{

  public function index(Request $request)
  {
    if ($request->filled('latest')) {
      $qty = (int) $request->query('latest', 3);
      return Product::with('category')
        ->orderByDesc('created_at')
        ->take($qty)
        ->get();
    }

    $q = $request->query('q');
    return Product::when($q, fn($q1) =>
      $q1->where('name', 'like', "%$q%"))
      ->with('category')
      ->orderByDesc('created_at')
      ->get();
  }



  public function store(Request $r)
  {

    $data = $r->validate([
      'category_id' => 'required|exists:categories,id',
      'name' => 'required|max:100',
      'description' => 'required',
      'price' => 'required|integer',
      'image' => 'nullable|image|max:2048'

    ]);
    if ($r->hasFile('image')) {
      $data['image'] = $r->file('image')->store('products', 'public');
    }

    return Product::create($data);
  }



  public function show($id)
  {
    return Product::with('category')->findOrFail($id);
  }



  public function update(Request $r, $id)
  {
    $product = Product::findOrFail($id);



    $data = $r->validate([
      'category_id' => 'required|exists:categories,id',
      'name' => 'required|max:100',
      'description' => 'required',
      'price' => 'required|numeric',
      'image' => 'nullable|image|max:2048'
    ]);

    if ($r->hasFile('image')) {
      $data['image'] = $r->file('image')->store('products', 'public');
    }

    $product->update($data);
    return $product;

  }

  public function destroy($id)
  {
    Product::findOrFail($id)->delete();
    return response()->noContent();
  }
}
