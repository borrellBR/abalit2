
const esc = s => String(s ?? '').replace(/[&<>'"]/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
}[c]));


const formBox = document.getElementById('formBox');
const categoriesSection = document.getElementById('catGrid2');
const productsSection = document.getElementById('productsSection');
const productsTitle = document.getElementById('productsTitle');
const searchBox = document.getElementById('searchBox');


document.addEventListener('DOMContentLoaded', () => {
  getCategories();
  document.getElementById('btnSave').addEventListener('click', saveCategory);
  document.getElementById('catGrid2').addEventListener('click', handleGridClick);

  if (searchBox) {
    let t;
    searchBox.addEventListener('input', e => {
      clearTimeout(t);
      t = setTimeout(() => getCategories(e.target.value.trim()), 300);
    });
  }
});

function handleGridClick(e) {
  const article = e.target.closest('article');
  if (!article) return;

  const id = article.dataset.id;
  const name = article.dataset.name;
  const description = article.dataset.description;


  if (e.target.closest('.btn-edit')) {
    prepareEdit(id, name, description);
  } else if (e.target.closest('.btn-delete')) {
    deleteCategory(id);
  } else if (e.target.closest('.btn-view')) {
    showProducts(id, name);
  } else {
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


  if (res.status === 401) {
    localStorage.removeItem('token');
    document.getElementById('loginModal').style.display = 'flex';
    return;
  }


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
    localStorage.removeItem('token');
    return location.href = 'login.html';
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('Error guardando categoría:', err);
    return alert('No se pudo guardar la categoría.');
  }


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

function renderCategories(list = []) {
  const grid = document.getElementById('catGrid2');
  grid.innerHTML = '';

  list.forEach(c => {
    const imgSrc = c.image_url || 'data:image/svg+xml;base64,PHN2ZyB3...'; // placeholder opcional

    grid.insertAdjacentHTML('beforeend', `
      <article class="card-new"
               data-id="${c.id}"
               data-name="${esc(c.name)}"
               data-description="${esc(c.description)}"
               style="cursor:pointer"
               >
        <img src="${imgSrc}" alt="${esc(c.name)}">
        <h3>${esc(c.name)}</h3>
      </article>
    `);
  });
}



function hideProducts() {
  productsSection.style.display = 'none';
  categoriesSection.style.display = 'block';
}

async function showProducts(categoryId, categoryName) {




  productsSection.style.display = 'block';
  productsTitle.textContent = `Productos de: ${categoryName}`;


  productsSection.style.display = 'block';
  productsTitle.textContent = `Productos de: ${categoryName}`;





  setTimeout(() => {

    productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    setTimeout(() => {
      window.scrollBy({ top: 300, behavior: 'smooth' });
    }, 300);
  }, 100);


  const token = localStorage.getItem('token');
  const res = await fetch(
    `/api/categories/${categoryId}`,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    }
  );

  if (res.status === 401) {

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

function renderProducts(list = []) {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';

  list.forEach(p => {
    // usa la URL que Laravel ya formatea bien
    const imgSrc = p.image_url;

    // escapa con tu función esc() el nombre y descripción
    grid.insertAdjacentHTML('beforeend', `
      <article class="card-new card-new-link"
               onclick="location.href='product.html?id=${p.id}'">
        <img src="${imgSrc}" alt="${esc(p.name)}">
        <div class="info">
          <h3 class="title-price">${esc(p.name)}</h3>
          <span class="price">
            ${Number(p.price).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          </span>
        </div>
      </article>
    `);
  });
}
