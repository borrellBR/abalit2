(function () {
  document.addEventListener('navbar-injected', () => {
    const openInput = document.getElementById('globalSearch');
    const modal = document.getElementById('searchModal');
    if (!openInput || !modal) return console.warn('Search modal: faltan nodos');

    const closeBtn = document.getElementById('closeSearch');
    const catBox = document.getElementById('catTags');
    const grid = document.getElementById('suggestGrid');
    const searchInp = document.getElementById('searchInput');

    const NO_IMG = 'data:image/svg+xml;base64,' +
      btoa(`<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'>
              <rect width='100%' height='100%' fill='#eee'/>
              <text x='50%' y='50%' font-size='14' fill='#999'
                    text-anchor='middle' dominant-baseline='central'>
                Sin imagen
              </text></svg>`);
    const money = n => Number(n).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });

    const open = () => { modal.classList.add('open'); searchInp.focus(); };
    const close = () => modal.classList.remove('open');

    openInput.addEventListener('focus', open);
    openInput.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });

    (async () => {
      const r = await fetch('/api/categories?latest=5');
      const cats = await r.json();
      catBox.innerHTML = cats.map(c => `<span class="tag">${c.name}</span>`).join('');
    })();

    loadSuggestions();

    async function loadSuggestions() {
      const r = await fetch('/api/products?latest=3');
      render(await r.json());
    }

    let t;
    searchInp.addEventListener('input', e => {
      clearTimeout(t);
      t = setTimeout(() => doSearch(e.target.value.trim()), 300);
    });
    searchInp.addEventListener('keydown', e => {
      if (e.key === 'Enter') doSearch(e.target.value.trim());
    });

    async function doSearch(q) {
      if (!q) return loadSuggestions();
      const r = await fetch('/api/products?q=' + encodeURIComponent(q));
      render(await r.json());
    }

    function render(list = []) {
      grid.innerHTML = list.map(p => {

        let img;
        if (p.image_url) {
          img = p.image_url;
        } else if (p.image && /^https?:\/\//.test(p.image)) {
          img = p.image;
        } else if (p.image) {
          img = `/storage/${p.image}`;
        } else {
          img = NO_IMG;
        }

        return `
          <a href="product.html?id=${p.id}">
            <article class="sugg-card">
              <img src="${img}" alt="${p.name}">
              <h5>${p.name}</h5>
              <span>${money(p.price)}</span>
            </article>
          </a>
        `;
      }).join('');
    }
  });
})();
