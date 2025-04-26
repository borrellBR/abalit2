// public/js/orders.js
document.addEventListener('DOMContentLoaded', () => {
  renderOrders();
});

function renderOrders() {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const sec = document.getElementById('ordersSection');

  if (orders.length === 0) {
    sec.innerHTML = `<p>No tienes pedidos aún. <a href="home.html">Ir a comprar.</a></p>`;
    return;
  }

  sec.innerHTML = orders.reverse().map(o => {
    const itemsHtml = o.items.map(i => `
      <li>${i.name} ×${i.qty} = ${(i.price * i.qty).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</li>
    `).join('');
    const total = o.items.reduce((s, i) => s + i.price * i.qty, 0);
    return `
      <div class="order-card">
        <h3>Pedido #${o.id}</h3>
        <p>Fecha: ${o.date}</p>
        <ul>${itemsHtml}</ul>
        <p><strong>Total:</strong> ${total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
      </div>
    `;
  }).join('');
}
