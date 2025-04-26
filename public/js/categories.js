// Escapa caracteres peligrosos para evitar inyecciones HTML
const esc = s => String(s ?? '').replace(/[&<>'"]/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
}[c]));

// Referencias al DOM
const formBox = document.getElementById('formBox');
const categoriesSection = document.getElementById('categoriesGrid');  // es el que sí existe
const productsSection = document.getElementById('productsSection');
const productsTitle = document.getElementById('productsTitle');
const searchBox = document.getElementById('searchBox');

// Al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  getCategories();
  document.getElementById('btnSave').addEventListener('click', saveCategory);
  document.getElementById('categoriesGrid').addEventListener('click', handleGridClick);

  if (searchBox) {
    let t;
    searchBox.addEventListener('input', e => {
      clearTimeout(t);
      t = setTimeout(() => getCategories(e.target.value.trim()), 300);
    });
  }
});

function handleGridClick(e) {
  const article = e.target.closest('article');      // lo que sea que pulses
  if (!article) return;

  const id = article.dataset.id;
  const name = article.dataset.name;
  const description = article.dataset.description;


  if (e.target.closest('.btn-edit')) {              // clic en “Editar”
    prepareEdit(id, name, description);
  } else if (e.target.closest('.btn-delete')) {
    deleteCategory(id);
  } else if (e.target.closest('.btn-view')) {
    showProducts(id, name);
  } else {
    showProducts(id, name);                         // clic en cualquier otra zona
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
  const id = document.getElementById('category-id').value;
  const fd = new FormData();
  fd.append('name', document.getElementById('name').value.trim());
  fd.append('description', document.getElementById('description').value.trim());
  if (document.getElementById('image').files[0]) {
    fd.append('image', document.getElementById('image').files[0]);
  }
  if (id) {
    fd.append('_method', 'PUT');
  }

  const token = localStorage.getItem('token');
  if (!token) {
    // si no hay token, fuerza login
    return location.href = 'login.html';
  }

  const res = await fetch(id ? `/api/categories/${id}` : '/api/categories', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: fd
  });

  if (res.status === 401) {
    // token caducado o inválido
    localStorage.removeItem('token');
    return location.href = 'login.html';
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('Error guardando categoría:', err);
    return alert('No se pudo guardar la categoría.');
  }

  // todo OK
  hideForm();
  getCategories();
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
    const imgSrc = c.image ? `/storage/${c.image}` : '';

    grid.insertAdjacentHTML('beforeend', `
      <article class="card"
       data-id="${c.id}"
     data-name="${esc(c.name)}"
     data-description="${esc(c.description)}"
     style="cursor:pointer"
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

function hideProducts() {
  productsSection.style.display = 'none';
  categoriesSection.style.display = 'block';
}

async function showProducts(categoryId, categoryName) {
  categoriesSection.style.display = 'none';
  productsSection.style.display = 'block';
  productsTitle.textContent = `Productos de: ${categoryName}`;

  const token = localStorage.getItem('token');
  const res = await fetch(
    `/api/categories/${categoryId}`,
    {
      method: 'GET',  // 👉 forzar GET
      headers: {
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    }
  );

  if (res.status === 401) {
    // no autenticado
    localStorage.removeItem('token');
    alert('Por favor inicia sesión para ver los productos.');
    return;
  }

  if (!res.ok) {
    console.error('Error al cargar productos de la categoría', res.status, await res.text());
    alert('No se pudo cargar la lista de productos');
    return;
  }

  const category = await res.json();

  if (!Array.isArray(category.products)) {
    console.warn('category.products no es un array:', category.products);
    return;
  }

  renderProducts(category.products);
}


function renderProducts(list) {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';

  list.forEach(p => {
    const imgSrc = p.image ? `/storage/${p.image}` : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBpbWFnZTwvdGV4dD48L3N2Zz4=';

    grid.insertAdjacentHTML('beforeend', `
      <article class="card">
        <img src="${imgSrc}" class="thumb" alt="${esc(p.name)}">
        <h3>${esc(p.name)}</h3>
        <small>Tienda: ${p.category?.name ? esc(p.category.name) : 'Sin categoría'}</small>
        <small>Descripción: ${esc(p.description)}</small>
        <small>Precio: ${esc(p.price)} €</small>
        <div class="actions">
          <button class="btn btn-edit"
            onclick="handlePrepareEdit(${p.id}, ${p.category?.id || 'null'},
                                      '${encodeURIComponent(p.name)}',
                                      '${encodeURIComponent(p.description)}',
                                      '${encodeURIComponent(p.price)}')">
            Editar
          </button>
          <button class="btn btn-delete"
            onclick="deleteProduct(${p.id})">
            Eliminar
          </button>
        </div>
      </article>
    `);
  });
}
