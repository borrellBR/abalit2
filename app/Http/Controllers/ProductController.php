<?php
namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{


  // metodo index que equivale a get/api/products
// … arriba mantienen lo que ya tenías
  public function index(Request $request)
  {
    // ↓ NUEVO: productos más recientes
    if ($request->filled('latest')) {
      $qty = (int) $request->query('latest', 3);
      return Product::with('category')
        ->orderByDesc('created_at')
        ->take($qty)
        ->get();
    }

    // ↓ lo que ya tenías …
    $q = $request->query('q');
    return Product::when($q, fn($q1) =>
      $q1->where('name', 'like', "%$q%"))
      ->with('category')
      ->orderByDesc('created_at')
      ->get();
  }



  // metodo store para crear productos (post /api/products)
  public function store(Request $r)
  {

    // valida los datos
    $data = $r->validate([
      'category_id' => 'required|exists:categories,id', // debe existir la tienda
      'name' => 'required|max:100', //debe tener nombre
      'description' => 'required|max:100', //debe tener nombre
      'price' => 'required|integer', //debe tener un numero de stock
      'image' => 'nullable|image|max:2048'   // 👈

    ]);
    if ($r->hasFile('image')) {
      $data['image'] = $r->file('image')->store('products', 'public');
    }

    // creamos y devolvemos el producto con los datos nuevos
    return Product::create($data);
  }



  // metodo show(id), equivale a get / api/products/(id)
  public function show($id)
  {
    // muestra un porducto concreto con su tienda
    return Product::with('category')->findOrFail($id); // lanza 404 si no lo encuentra
  }



  // actualizar datos de un producto (put /api/products/{id})
  public function update(Request $r, $id)
  {
    $product = Product::findOrFail($id); // obtiene el producto por su id, sino lanza 404

    // valida los datos del producto
    // update (añade image y usa store PUT=POST+_method)

    $data = $r->validate([
      'category_id' => 'required|exists:categories,id',
      'name' => 'required|max:100',
      'description' => 'required|max:255',
      'price' => 'required|numeric',
      'image' => 'nullable|image|max:2048'
    ]);

    if ($r->hasFile('image')) {
      $data['image'] = $r->file('image')->store('products', 'public');
    }

    $product->update($data);
    return $product;

  }

  // metodo para eliminar un producto existente (delete /api/products/{id})
  public function destroy($id)
  {
    Product::findOrFail($id)->delete(); // busca un producto por su id, sino lanza 404
    return response()->noContent(); //no devuelve nada (204 sin contenido)
  }
}
