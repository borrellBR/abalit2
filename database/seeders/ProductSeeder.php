<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;

class ProductSeeder extends Seeder
{
  public function run(): void
  {
    // Para cada categoría existente, creamos 3 productos de ejemplo
    Category::all()->each(function ($cat) {
      for ($i = 1; $i <= 3; $i++) {
        Product::updateOrCreate(
          [
            'category_id' => $cat->id,
            'name' => "{$cat->name} Producto {$i}",
          ],
          [
            'description' => "Descripción del producto {$i} en {$cat->name}.",
            'price' => rand(50, 500), // precio aleatorio
            'image' => "https://static.zarahome.net/assets/public/5b18/86fc/dc144fe79844/c814a0ff93ca/41302077052-p1/41302077052-p1.jpg?ts=1720701858847&f=auto&w=941",
          ]
        );
      }
    });
  }

  protected function slugify(string $text): string
  {
    return strtolower(preg_replace('/[^A-Za-z0-9]+/', '-', $text));
  }
}
