/* ---------------------------------- home.js --------------------------------- */
/* 1.  Genera URLs sin parámetros vacíos  ------------------------------------- */
function buildUrl(base, params = {}) {
  const url = new URL(base, location.origin);          //  http://localhost/.../api/*
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== '') url.searchParams.set(k, v);
  });
  return url;                                          //  …/api/products?latest=3
}

/* 2.  SVG por defecto (“Sin imagen”)  ---------------------------------------- */
const NO_IMG =
  'data:image/svg+xml;base64,' +
  btoa(`<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'>
          <rect width='100%' height='100%' fill='#eee'/>
          <text x='50%' y='50%' font-size='26' fill='#999'
                text-anchor='middle' dominant-baseline='central'>
            Sin&nbsp;imagen
          </text>
        </svg>`);

/* 3.  Al cargar la página ----------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  loadNewProducts();
  loadPopularCats();

  // Si tu navbar define estas funciones, se re-ejecutan:
  window.initSearch?.();
  window.updateAuthUI?.();
});

/* ---------- NEW IN (3 últimos productos) ------------------------------------ */
async function loadNewProducts() {
  try {
    const res = await fetch(buildUrl('/api/products', { latest: 3 }));
    const list = await res.json();
    if (Array.isArray(list)) renderNewIn(list);
  } catch (err) { console.error('loadNewProducts', err); }
}

function renderNewIn(list) {
  const grid = document.getElementById('newGrid');
  if (!grid) return;
  grid.innerHTML = '';

  list.forEach(p => {
    grid.insertAdjacentHTML('beforeend', `
        <a href="product.html?id=${p.id}" class="card-new-link">
      <article class="card-new">
        <img src="${p.image ? `/storage/${p.image}` : NO_IMG}" alt="${p.name}">
        <div class="info">
          <h3>${p.name}</h3>
          <span class="price">
            ${Number(p.price).toLocaleString('es-ES',
      { style: 'currency', currency: 'EUR' })}
          </span>
        </div>
      </article>
    `);
  });
}

/* ---------- CATEGORÍAS POPULARES (5 últimas) -------------------------------- */
async function loadPopularCats() {
  try {
    const url = buildUrl('/api/categories', { latest: 5 });
    console.log('Fetching URL:', url.toString());
    const res = await fetch(url);
    console.log('Response status:', res.status, 'OK:', res.ok);
    const text = await res.text(); // Get raw response
    console.log('Raw response:', text); // Log the raw response
    const list = JSON.parse(text); // Attempt to parse
    if (Array.isArray(list)) renderCatGrid(list);
  } catch (err) {
    console.error('loadPopularCats', err);
  }
}

function renderCatGrid(list) {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  grid.innerHTML = '';

  list.forEach(c => {
    grid.insertAdjacentHTML('beforeend', `
      <article class="card-cat">
        <img src="${c.image ? `/storage/${c.image}` : NO_IMG}" alt="${c.name}">
        <h3>${c.name}</h3>
      </article>
    `);
  });
}
/* --------------------------------------------------------------------------- */
