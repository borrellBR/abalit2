<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('orders', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->constrained()->onDelete('cascade');
      $table->date('pickup_day');
      $table->time('pickup_time');
      $table->string('address');
      $table->enum('payment_type', ['efectivo', 'tarjeta']);
      $table->enum('status', ['pendiente', 'completado', 'cancelado'])->default('pendiente');
      $table->timestamps();
    });

  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('orders');
  }
};
