
function buildUrl(base, params = {}) {
  const url = new URL(base, location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== '') url.searchParams.set(k, v);
  });
  return url;
}

const NO_IMG =
  'data:image/svg+xml;base64,' +
  btoa(`<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'>
          <rect width='100%' height='100%' fill='#eee'/>
          <text x='50%' y='50%' font-size='26' fill='#999'
                text-anchor='middle' dominant-baseline='central'>
            Sin&nbsp;imagen
          </text>
        </svg>`);

document.addEventListener('DOMContentLoaded', () => {
  loadNewProducts();
  loadPopularCats();


  window.initSearch?.();
  window.updateAuthUI?.();
});


async function loadNewProducts() {
  try {
    const res = await fetch(buildUrl('/api/products', { latest: 3 }));
    const list = await res.json();
    if (Array.isArray(list)) renderNewIn(list);
  } catch (err) { console.error('loadNewProducts', err); }
}

function renderNewIn(list) {
  const grid = document.getElementById('productsGrid2');
  if (!grid) return;
  grid.innerHTML = '';


  list.forEach(p => {
    const priceFmt = Number(p.price).toLocaleString('es-ES', {
      style: 'currency',
      currency: 'EUR'
    });
    grid.insertAdjacentHTML('beforeend', `
    <a href="product.html?id=${p.id}" class="card-new-link">
      <article class="card-new">
        <img src="${p.image ? `/storage/${p.image}` : NO_IMG}" alt="${p.name}">
        <div class="info">
          <h3 class="title-price">
            ${p.name}
            <span class="price">${priceFmt}</span>
          </h3>
        </div>
      </article>
    </a>
  `);
  });

}


async function loadPopularCats() {
  try {
    const url = buildUrl('/api/categories', { latest: 5 });
    console.log('Fetching URL:', url.toString());
    const res = await fetch(url);
    console.log('Response status:', res.status, 'OK:', res.ok);
    const text = await res.text();
    console.log('Raw response:', text);
    const list = JSON.parse(text);
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
      <article class="card-cat" data-id="${c.id}" style="cursor:pointer">
        <img src="${c.image ? `/storage/${c.image}` : NO_IMG}" alt="${c.name}">
        <h3>${c.name}</h3>
      </article>
    `);
  });
}


document.addEventListener('DOMContentLoaded', () => {

  const catGrid = document.getElementById('catGrid');
  catGrid.addEventListener('click', e => {
    const card = e.target.closest('.card-cat');
    if (!card) return;
    const id = card.dataset.id;
    localStorage.setItem('selectedCat', id);
    location.href = 'categories.html';
  });
});
