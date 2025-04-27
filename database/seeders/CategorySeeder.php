<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
  public function run(): void
  {
    $names = [
      'SILLAS' => 'https://cdn.sklum.com/es/wk/2642857/silla-de-comedor-en-madera-leivel.jpg?cf-resize=gallery',
      'SOFÁS' => 'https://cdn.sklum.com/es/wk/4040940/sofa-modular-de-4-piezas-y-puff-bastian.jpg',
      'MESAS' => 'https://cdn.sklum.com/es/wk/3094778/mesa-extensible-de-jardin-en-madera-160-210x90-cm-macoris.jpg',
      'LÁMPARAS' => 'https://cdn.sklum.com/es/wk/1309341/lampara-de-techo-en-poliester-y-ratan-satu.jpg',
      'MUEBLES DE JARDÍN' => 'https://cdn.sklum.com/es/wk/4153387/conjunto-de-jardin-con-sofa-de-2-plazas-2-sillones-y-mesa-de-centro-en-madera-de-acacia-125x80-cm-ioanis.jpg',
    ];

    foreach ($names as $name => $url) {
      Category::updateOrCreate(
        ['name' => $name],
        [
          'description' => "La mejor selección de artículos para tu {$name}.",
          'image' => $url,
        ]
      );
    }
  }
}
