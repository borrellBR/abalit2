<?php
namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{

  // metodo index (get api/stores/q=texto)
  //muestra la lista de tiendas, con busqueda opcional
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



  // metodo para crear una tienda (ruta post /api/stores)
  public function store(Request $r)
  {
    // validacion de campos de producto (los 3 obligatorios)
    $data = $r->validate([
      'name' => 'required',
      'description' => 'required|max:255',
      'image' => 'nullable|image|max:2048'   // 👈

    ]);
    // CategoryController@store
    if ($r->hasFile('image')) {
      $data['image'] = $r->file('image')->store('categories', 'public');  // no 'products'
    }

    return Category::create($data);
  }




  // metodo para devolver una tienda con sus productos get api/stores/{id}
  public function show($id)
  {
    return Category::with('products')->findOrFail($id); //si no hay delvulve 404
  }

  /**
   * Actualizar tienda.
   * PUT /api/stores/{id}
   */

  // metodo para actualizar datos de tienda (put /api/stores/{id})
  // store ya está bien. Falta update:

  public function update(Request $r, $id)
  {
    $category = Category::findOrFail($id);

    $data = $r->validate([
      'name' => 'required',
      'description' => 'required|max:255',
      'image' => 'nullable|image|max:2048'
    ]);

    // CategoryController@store
    if ($r->hasFile('image')) {
      $data['image'] = $r->file('image')->store('categories', 'public');  // no 'products'
    }


    $category->update($data);
    return $category;
  }


  /**
   * Eliminar tienda (cascade elimina productos).
   * DELETE /api/stores/{id}
   */

  // metodo para eliminar una tienda (delete /api/stores/{id})
  public function destroy($id)
  {
    Category::findOrFail($id)->delete(); // accede a la tienda por su id, si lo consigue devuelve meteodo delete
    return response()->noContent(); //no devuelve nada (204 sin contenido)
  }
}
