// public/js/product.js

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (!id) {
    document.getElementById('productPage').innerHTML = '<p>Producto no especificado.</p>';
    return;
  }

  try {
    const res = await fetch(`/api/products/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('No encontrado');
    const p = await res.json();

    document.getElementById('productPage').innerHTML = `
      <section class="product-detail">
        <div class="pd-image">
          <img src="${p.image ? '/storage/' + p.image : 'img/placeholder.jpg'}" alt="${p.name}">
        </div>
        <div class="pd-info">
          <h1>${p.name}</h1>
          <p class="pd-price">${Number(p.price).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
          <p class="pd-desc">${p.description}</p>
          <div class="pd-actions">
            <label for="qty">Cantidad:</label>
            <input id="qty" type="number" min="1" value="1" style="width:4rem;"/>
            <button id="addCart" class="btn btn-add">Añadir al carrito</button>
          </div>
        </div>
      </section>
    `;

    document.getElementById('addCart').addEventListener('click', () => {
      const qty = parseInt(document.getElementById('qty').value, 10) || 1;
      // Aquí tu lógica de carrito:
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.push({ id: p.id, name: p.name, price: p.price, qty });
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`Añadido ${qty} × ${p.name} al carrito.`);
      // Actualiza el contador:
      const count = cart.reduce((sum, it) => sum + it.qty, 0);
      document.getElementById('cartCount').textContent = count;
    });

  } catch (err) {
    console.error(err);
    document.getElementById('productPage').innerHTML = '<p>Error al cargar el producto.</p>';
  }
});
