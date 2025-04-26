// public/js/cart.js
document.addEventListener('DOMContentLoaded', () => {
  renderCart();

  // delegación de eventos en la sección
  document.getElementById('cartSection').addEventListener('click', e => {
    if (e.target.matches('.remove-item')) {
      const id = e.target.dataset.id;
      removeFromCart(id);
    }
    if (e.target.matches('#checkoutBtn')) {
      placeOrder();
    }
  });
});

function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function setCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// renderiza toda la tabla de carrito
function renderCart() {
  const cart = getCart();
  const section = document.getElementById('cartSection');

  if (cart.length === 0) {
    section.innerHTML = `<p>Tu carrito está vacío. <a href="home.html">Seguir comprando.</a></p>`;
    return;
  }

  // tabla de ítems
  let total = 0;
  const rows = cart.map(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    return `
      <div class="cart-item">
        <img src="${item.image || 'img/placeholder.jpg'}" alt="${item.name}" class="thumb" style="width:80px;height:80px;object-fit:cover;">
        <div class="cart-info">
          <h4>${item.name}</h4>
          <p>Precio: ${item.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
          <p>Cantidad: ${item.qty}</p>
          <p>Subtotal: ${subtotal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
        </div>
        <button class="btn btn-delete remove-item" data-id="${item.id}">Eliminar</button>
      </div>
    `;
  }).join('');

  section.innerHTML = `
    ${rows}
    <div class="cart-summary">
      <h3>Total: ${total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</h3>
      <button id="checkoutBtn" class="btn btn-add">Realizar Pedido</button>
    </div>
  `;
}

// elimina un artículo y vuelve a renderizar
function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id != id);
  setCart(cart);
  renderCart();
}

// simula un pedido: lo guarda en localStorage.orders y vacía carrito
function placeOrder() {
  const cart = getCart();
  if (!cart.length) return;
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');

  // creamos un pedido con fecha y detalle
  const newOrder = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    items: cart
  };
  orders.push(newOrder);
  localStorage.setItem('orders', JSON.stringify(orders));

  // vaciamos carrito
  localStorage.removeItem('cart');
  alert('Pedido realizado con éxito. Podrás verlo en la pestaña Pedidos.');
  renderCart();
}
