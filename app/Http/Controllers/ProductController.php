<?php
namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{


  // metodo index que equivale a get/api/products
  public function index(Request $request)
  {
    $q = $request->query('q');

    return Product::when($q, function ($query) use ($q) {
      $query->where(function ($q2) use ($q) {
        $q2->where('name', 'LIKE', "%$q%");
      });
    })
      ->orderBy('created_at', 'desc')
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
    ]);

    // creamos y devolvemos el producto con los datos nuevos
    return Product::create($data);
  }



  // metodo show(id), equivale a get / api/products/(id)
  public function show($id)
  {
    // muestra un porducto concreto con su tienda
    return Product::with('store')->findOrFail($id); // lanza 404 si no lo encuentra
  }



  // actualizar datos de un producto (put /api/products/{id})
  public function update(Request $r, $id)
  {
    $product = Product::findOrFail($id); // obtiene el producto por su id, sino lanza 404

    // valida los datos del producto
    $data = $r->validate([
      'category_id' => 'required|exists:categories,id', // debe existir la tienda
      'name' => 'required|max:100', //debe tener nombre
      'description' => 'required|max:100', //debe tener nombre
      'price' => 'required|integer', //debe tener un numero de stock
    ]);

    // aplicamos metodo update y pasamos los datos nuevos
    $product->update($data);
    return $product; // devolvemos el producto actualizado
  }

  // metodo para eliminar un producto existente (delete /api/products/{id})
  public function destroy($id)
  {
    Product::findOrFail($id)->delete(); // busca un producto por su id, sino lanza 404
    return response()->noContent(); //no devuelve nada (204 sin contenido)
  }
}
