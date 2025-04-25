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
    $q = $request->query('q');

    return Category::when($q, function ($query) use ($q) {
      $query->where(function ($q2) use ($q) {
        $q2->where('name', 'LIKE', "%$q%")
          ->orWhere('description', 'LIKE', "%$q%");
      });
    })
      ->orderBy('created_at', 'desc')
      ->get();
  }


  // metodo para crear una tienda (ruta post /api/stores)
  public function store(Request $r)
  {
    // validacion de campos de producto (los 3 obligatorios)
    $data = $r->validate([
      'name' => 'required',
      'description' => 'required'
    ]);
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
  public function update(Request $r, $id)
  {
    $category = Category::findOrFail($id); // accede a la tienda por su id
    $data = $r->validate([ // valida que se cumplan las normas
      'name' => 'required',
      'description' => 'required'
    ]);

    $category->update($data); // actualiza la tienda con los datos nuevos
    return $category; // devuelve la tienda actualizada
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
