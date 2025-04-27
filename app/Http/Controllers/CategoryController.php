<?php
namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{

  public function index(Request $request)
  {
    if ($request->filled('latest')) {
      $qty = (int) $request->query('latest', 5);
      return Category::orderByDesc('created_at')
        ->take($qty)
        ->get();
    }

    $q = $request->query('q');
    return Category::when($q, fn($q1) =>
      $q1->where('name', 'like', "%$q%")
        ->orWhere('description', 'like', "%$q%"))
      ->orderByDesc('created_at')
      ->get();
  }



  public function store(Request $r)
  {
    $data = $r->validate([
      'name' => 'required',
      'description' => 'required|max:255',
      'image' => 'nullable|image|max:2048'

    ]);
    if ($r->hasFile('image')) {
      $data['image'] = $r->file('image')->store('categories', 'public');
    }

    return Category::create($data);
  }




  public function show($id)
  {
    return Category::with('products')->findOrFail($id);
  }



  public function update(Request $r, $id)
  {
    $category = Category::findOrFail($id);

    $data = $r->validate([
      'name' => 'required',
      'description' => 'required|max:255',
      'image' => 'nullable|image|max:2048'
    ]);

    if ($r->hasFile('image')) {
      $data['image'] = $r->file('image')->store('categories', 'public');
    }


    $category->update($data);
    return $category;
  }

  public function destroy($id)
  {
    Category::findOrFail($id)->delete();
    return response()->noContent();
  }
}
