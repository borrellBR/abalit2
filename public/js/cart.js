document.addEventListener('DOMContentLoaded', () => {
  renderCart();

  document.getElementById('cartItems')
    .addEventListener('click', e => {
      if (e.target.matches('.btn-remove')) {
        removeFromCart(e.target.dataset.id);
      }
    });

  document.getElementById('cartSummary')
    .addEventListener('click', e => {
      if (e.target.matches('.btn-place-order')) {
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

function renderCart() {
  const cart = getCart();
  const itemsCt = document.getElementById('cartItems');
  const sumCt = document.getElementById('cartSummary');

  if (!cart.length) {
    itemsCt.innerHTML = `
      <p class="empty-msg">
        Tu carrito está vacío. <a href="home.html">Seguir comprando.</a>
      </p>`;
    sumCt.innerHTML = '';
    return;
  }

  let total = 0;
  itemsCt.innerHTML = cart.map(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    const imgSrc = item.image
      ? `/storage/${item.image}`
      : 'img/placeholder.jpg';

    return `
      <div class="cart-item">
        <img src="${imgSrc}" alt="${item.name}" class="thumb">
        <div class="info">
          <h4>${item.name}</h4>
          <p class="price">${item.price.toLocaleString('es-ES', {
      style: 'currency', currency: 'EUR'
    })}</p>
          <p>Cantidad: ${item.qty}</p>
          <p>Subtotal: ${subtotal.toLocaleString('es-ES', {
      style: 'currency', currency: 'EUR'
    })}</p>
        </div>
        <button class="btn btn-remove" data-id="${item.id}">
          Eliminar
        </button>
      </div>`;
  }).join('');

  sumCt.innerHTML = `
    <h2>Resumen del pedido</h2>
    <div class="line"></div>
    <div class="total-row">
      <span>Total productos</span>
      <span>${total.toLocaleString('es-ES', {
    style: 'currency', currency: 'EUR'
  })}</span>
    </div>
    <div class="total-row">
      <span>Total envío</span>
      <span>29,99 €</span>
    </div>
    <div class="line"></div>
    <div class="total-row grand-total">
      <strong>Importe total</strong>
      <strong>${(total + 29.99).toLocaleString('es-ES', {
    style: 'currency', currency: 'EUR'
  })}</strong>
    </div>
    <button class="btn btn-place-order">
      Proceso de compra
    </button>`;
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id != id);
  setCart(cart);
  renderCart();
}

function placeOrder() {
  const cart = getCart();
  if (!cart.length) return;

  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const newOrder = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    items: cart
  };
  orders.push(newOrder);
  localStorage.setItem('orders', JSON.stringify(orders));

  localStorage.removeItem('cart');
  alert('Pedido realizado con éxito. Puedes verlo en Pedidos.');
  renderCart();
}
