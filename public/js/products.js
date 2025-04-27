const esc = s => String(s ?? '').replace(/[&<>'"]/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
}[c]));

const formBox = document.getElementById('formBox');
const categorySelect = document.getElementById('category');
const categoriesSection = document.getElementById('catGrid2');
const productsSection = document.getElementById('productsSection');
const productsTitle = document.getElementById('productsTitle');
const productDetailsModal = document.getElementById('productDetailsModal');
const productDetailsContent = document.getElementById('productDetailsContent');
const searchBox = document.getElementById('searchBox');

document.addEventListener('DOMContentLoaded', () => {
  loadCategoriesIntoSelect();
  getProducts();

  document.getElementById('btnSave').addEventListener('click', e => {
    e.preventDefault();
    saveProduct();
  });

  if (searchBox) {
    let t;
    searchBox.addEventListener('input', e => {
      clearTimeout(t);
      t = setTimeout(() => getProducts(e.target.value.trim()), 300);
    });
  }
});

async function loadCategoriesIntoSelect() {
  try {
    const res = await fetch('/api/categories', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json'
      }
    });
    const categories = await res.json();
    categorySelect.innerHTML = '<option value="" disabled selected>Categoria *</option>';
    categories.forEach(s =>
      categorySelect.insertAdjacentHTML('beforeend', `<option value="${s.id}">${esc(s.name)}</option>`)
    );
  } catch (err) {
    console.error('Error cargando categorías:', err);
  }
}

function openCreateForm() {
  ['product-id', 'name', 'description', 'price'].forEach(id =>
    document.getElementById(id).value = ''
  );
  categorySelect.value = '';
  document.getElementById('formTitle').textContent = 'Crear producto';
  document.getElementById('btnSave').textContent = 'Guardar';
  formBox.style.display = 'block';
}

function hideForm() {
  formBox.style.display = 'none';
}

function prepareEdit(id, categoryId, name, description, price) {
  document.getElementById('product-id').value = id;
  document.getElementById('category').value = categoryId;
  document.getElementById('name').value = name;
  document.getElementById('description').value = description;
  document.getElementById('price').value = parseFloat(price);
  document.getElementById('formTitle').textContent = 'Editar producto';
  document.getElementById('btnSave').textContent = 'Actualizar';
  formBox.style.display = 'block';
}

function handlePrepareEdit(id, categoryId, name, description, price) {
  prepareEdit(
    id,
    categoryId,
    decodeURIComponent(name),
    decodeURIComponent(description),
    decodeURIComponent(price)
  );
}

async function getProducts(q = '') {
  const token = localStorage.getItem('token');
  const headers = { 'Accept': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(
    `/api/products${q ? `?q=${encodeURIComponent(q)}` : ''}`,
    { headers }
  );

  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
    return;
  }

  if (!res.ok) {
    console.error('Error HTTP', res.status);
    alert('No se pudieron cargar los productos');
    return;
  }

  const list = await res.json();
  if (!Array.isArray(list)) {
    console.warn('Formato inesperado', list);
    return;
  }

  renderProducts(list);
}


async function saveProduct() {
  const id = document.getElementById('product-id').value;
  const fd = new FormData();
  fd.append('category_id', categorySelect.value);
  fd.append('name', document.getElementById('name').value.trim());
  fd.append('description', document.getElementById('description').value.trim());
  fd.append('price', document.getElementById('price').value.trim());
  if (document.getElementById('image').files[0])
    fd.append('image', document.getElementById('image').files[0]);
  if (id) fd.append('_method', 'PUT');

  await fetch(id ? `/api/products/${id}` : '/api/products', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: fd
  });

  hideForm();
  getProducts();
}


async function deleteProduct(id) {
  if (!confirm('¿Eliminar producto?')) return;

  try {
    await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json'
      }
    });
    getProducts();
  } catch (err) {
    console.error('Error eliminando producto:', err);
  }
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


function showProductDetails(name, description, price, category) {
  productDetailsContent.innerHTML = `
    <h2>${name}</h2>
    <p><strong>Descripción:</strong> ${description}</p>
    <p><strong>Precio:</strong> ${price}€</p>
    <p><strong>Categoría:</strong> ${category}</p>
    <button class="btn" onclick="document.getElementById('productDetailsModal').style.display='none'">Cerrar</button>
  `;
  productDetailsModal.style.display = 'flex';
}

const localSearch = document.getElementById('localSearch');
localSearch?.addEventListener('input', e => {
  clearTimeout(window.t);
  window.t = setTimeout(() => getProducts(e.target.value.trim()), 300);
});
