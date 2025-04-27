const esc = s => String(s ?? '').replace(/[&<>'"]/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
}[c]));

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (!id) {
    return document.getElementById('productPage')
      .innerHTML = '<p>Producto no especificado.</p>';
  }

  try {
    const res = await fetch(`/api/products/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('No encontrado');
    const p = await res.json();

    document.getElementById('productPage').innerHTML = `
      <section class="product-frame">
        <article class="product-detail">
          <div class="pd-image">
            <img src="${p.image_url}" alt="${esc(p.name)}">
          </div>
          <div class="pd-info">
            <header>
              <h1>${esc(p.name)}</h1>
              <span class="pd-subtitle">${esc(p.category?.name || '')}</span>
              ${p.is_new ? '<span class="badge-new">New!</span>' : ''}
            </header>
            <div class="pd-price">
              ${Number(p.price).toLocaleString('es-ES', {
      style: 'currency', currency: 'EUR'
    })}
            </div>
            <p class="pd-desc">${esc(p.description)}</p>
            <div>
              <div class="qty-box">
                <button id="minus">−</button>
                <input id="qty" type="number" min="1" value="1">
                <button id="plus">+</button>
              </div>
              <button class="btn-cart" id="addCart">Añadir al carrito</button>
            </div>
          </div>
        </article>
      </section>
    `;

    document.getElementById('minus').onclick = () => {
      let q = document.getElementById('qty');
      if (+q.value > 1) q.value = +q.value - 1;
    };
    document.getElementById('plus').onclick = () => {
      let q = document.getElementById('qty');
      q.value = +q.value + 1;
    };

    document.getElementById('addCart').addEventListener('click', () => {
      const qty = parseInt(document.getElementById('qty').value, 10) || 1;
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.push({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image_url,
        qty
      });
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`Añadido ${qty}× ${p.name} al carrito.`);
      document.getElementById('cartCount').textContent =
        cart.reduce((sum, it) => sum + it.qty, 0);
    });

  } catch (err) {
    console.error(err);
    document.getElementById('productPage')
      .innerHTML = '<p>Error al cargar el producto.</p>';
  }
});
