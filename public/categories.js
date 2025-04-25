// Escapa caracteres peligrosos para evitar inyecciones HTML
const esc = s => String(s ?? '').replace(/[&<>'"]/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
}[c]));

// Referencias al DOM
const formBox = document.getElementById('formBox');
const categoriesSection = document.getElementById('categoriesSection');
const productsSection = document.getElementById('productsSection');
const productsTitle = document.getElementById('productsTitle');

// Al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  getCategories();
  document.getElementById('btnSave').addEventListener('click', saveCategory);
  document.getElementById('categoriesGrid').addEventListener('click', handleGridClick);

  let t;
  document.getElementById('searchBox').addEventListener('input', e => {
    clearTimeout(t);
    t = setTimeout(() => getCategories(e.target.value.trim()), 300);
  });
});

function handleGridClick(e) {
  const btn = e.target;
  const article = btn.closest('article');
  if (!article) return;

  const id = article.dataset.id;
  const name = article.dataset.name;
  const description = article.dataset.description;

  if (btn.matches('.btn-edit')) {
    prepareEdit(id, name, description);
  } else if (btn.matches('.btn-delete')) {
    deleteCategory(id);
  } else if (btn.matches('.btn-view')) {
    showProducts(id, name);
  }
}

function openCreateForm() {
  ['category-id', 'name', 'description'].forEach(id =>
    document.getElementById(id).value = ''
  );
  document.getElementById('formTitle').textContent = 'Crear categoria';
  formBox.style.display = 'block';
}

function prepareEdit(id, name, description) {
  document.getElementById('category-id').value = id;
  document.getElementById('name').value = name;
  document.getElementById('description').value = description;
  document.getElementById('formTitle').textContent = 'Editar categoria';
  formBox.style.display = 'block';
}

function hideForm() {
  formBox.style.display = 'none';
}

async function getCategories(q = '') {
  const token = localStorage.getItem('token');
  const headers = { 'Accept': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`/api/categories${q ? `?q=${encodeURIComponent(q)}` : ''}`, { headers });

  // 401 → mandar al login y salir
  if (res.status === 401) {
    localStorage.removeItem('token');              // token inválido
    document.getElementById('loginModal').style.display = 'flex';
    return;
  }

  // cualquier otro error
  if (!res.ok) {
    console.error('Error al cargar categorías', await res.text());
    alert('No se pudieron cargar las categorías');
    return;
  }

  const data = await res.json();
  if (!Array.isArray(data)) {
    console.warn('Formato inesperado:', data);
    return;
  }

  renderCategories(data);
}

async function saveCategory() {
  const token = localStorage.getItem('token');
  if (!token) {
    document.getElementById('loginModal').style.display = 'flex';
    return;
  }

  const id = document.getElementById('category-id').value;
  const fd = new FormData();
  fd.append('name', document.getElementById('name').value.trim());
  fd.append('description', document.getElementById('description').value.trim());
  if (document.getElementById('image').files[0])
    fd.append('image', document.getElementById('image').files[0]);
  if (id) fd.append('_method', 'PUT');          // spoof para editar

  try {
    const res = await fetch(id ? `/api/categories/${id}` : '/api/categories', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: fd
    });

    if (res.status === 401) {
      localStorage.removeItem('token');
      document.getElementById('loginModal').style.display = 'flex';
      return;
    }

    if (!res.ok) {
      throw new Error('Error al guardar la categoría');
    }

    hideForm();
    getCategories();
  } catch (error) {
    console.error('Error:', error);
    alert('Error al guardar la categoría. Por favor, intente nuevamente.');
  }
}

async function deleteCategory(id) {
  if (!confirm('¿Eliminar tienda?')) return;

  await fetch(`/api/categories/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Accept': 'application/json'
    }
  });
  getCategories();
}

function renderCategories(list) {
  const grid = document.getElementById('categoriesGrid');
  grid.innerHTML = '';

  list.forEach(c => {
    const imgSrc = c.image ? `/storage/${c.image}` : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBpbWFnZTwvdGV4dD48L3N2Zz4=';

    grid.insertAdjacentHTML('beforeend', `
      <article class="card"
        data-id="${c.id}"
        data-name="${esc(c.name)}"
        data-description="${esc(c.description)}"
      >
        <img src="${imgSrc}" class="thumb" alt="${esc(c.name)}">
        <h3>${esc(c.name)}</h3>
        <small>${esc(c.description)}</small>

        <div class="actions">
          <button class="btn btn-edit">Editar</button>
          <button class="btn btn-delete">Eliminar</button>
          <button class="btn btn-add btn-view">Ver productos</button>
        </div>
      </article>
    `);
  });
}

async function showProducts(categoryId, categoryName) {
  categoriesSection.style.display = 'none';
  productsSection.style.display = 'block';
  productsTitle.textContent = `Productos de: ${categoryName}`;

  const res = await fetch(`/api/categories/${categoryId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Accept': 'application/json'
    }
  });
  const category = await res.json();
  renderProducts(category.products);
}

function hideProducts() {
  productsSection.style.display = 'none';
  categoriesSection.style.display = 'block';
}

function renderProducts(list) {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';

  list.forEach(p => {
    const imgSrc = p.image ? `/storage/${p.image}` : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBpbWFnZTwvdGV4dD48L3N2Zz4=';

    // codificamos parámetros para el modal y la edición
    const name = encodeURIComponent(p.name);
    const description = encodeURIComponent(p.description);
    const price = encodeURIComponent(p.price);

    grid.insertAdjacentHTML('beforeend', `
      <article class="card"
        onclick="showProductDetails('${esc(p.name)}', '${esc(p.description)}',
                                   '${esc(p.price)}', '${p.category?.name || 'Sin categoría'}')">

        <img src="${imgSrc}" class="thumb" alt="${esc(p.name)}">
        <h3>${esc(p.name)}</h3>
        <small>Tienda: ${p.category?.name ? esc(p.category.name) : 'Sin categoría'}</small>
        <small>Descripción: ${esc(p.description)}</small>
        <small>Precio: ${esc(p.price)} €</small>

        <div class="actions">
          <button class="btn btn-edit"
            onclick="event.stopPropagation();
                     handlePrepareEdit(${p.id}, ${p.category?.id || 'null'},
                     '${name}', '${description}', '${price}')">
            Editar
          </button>
          <button class="btn btn-delete"
            onclick="event.stopPropagation(); deleteProduct(${p.id})">
            Eliminar
          </button>
        </div>
      </article>
    `);
  });
}
