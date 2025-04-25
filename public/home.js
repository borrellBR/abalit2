// home.js
const esc = s => String(s ?? '')
  .replace(/[&<>'"]/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[c]));

async function loadHome() {
  const [newProd, cats] = await Promise.all([
    fetch('/api/products?limit=3&sort=new').then(r => r.json()),
    fetch('/api/categories?popular=1').then(r => r.json())
  ]);

  render('newGrid', newProd, 'product');
  render('catGrid', cats, 'category');
}

function render(elId, list, mode) {
  const box = document.getElementById(elId);
  list.forEach(o => {
    const img = o.image ? `/storage/${o.image}` : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBpbWFnZTwvdGV4dD48L3N2Zz4=';
    box.insertAdjacentHTML('beforeend', `
      <article class="card card-${mode}" onclick="location.href='${mode === 'product' ? 'detalle' : 'products'}.html?id=${o.id}'">
        <img src="${img}" class="thumb">
        <h3>${esc(o.name)}</h3>
        ${mode === 'product' ? `<small>${esc(o.price)} €</small>` : ''}
      </article>
    `);
  });
}
loadHome();
