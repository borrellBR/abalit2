
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
  const res = await fetch(`/api/categories${q ? `?q=${encodeURIComponent(q)}` : ''}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Accept': 'application/json'
    }
  });
  const data = await res.json();
  renderCategories(data);
}

async function saveCategory() {
  const id = document.getElementById('category-id').value;
  const payload = {
    name: document.getElementById('name').value.trim(),
    description: document.getElementById('description').value.trim(),
  };

  if (!payload.name || !payload.description) {
    alert('Faltan campos obligatorios');
    return;
  }

  await fetch(id ? `/api/categories/${id}` : '/api/categories', {
    method: id ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(payload)
  });

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

  list.forEach(s => {
    grid.insertAdjacentHTML('beforeend', `
      <article class="card"
        data-id="${s.id}"
        data-name="${esc(s.name)}"
        data-description="${esc(s.description)}"
      >
        <h3>${esc(s.name)}</h3>
        <small>${esc(s.description)}</small>
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
    grid.insertAdjacentHTML('beforeend', `
      <article class="card">
        <h3>${esc(p.name)}</h3>
        <small>Descripcion:${esc(p.description)}</small>
        <small>Precio: ${esc(p.price)}€</small>
      </article>
    `);
  });
}
