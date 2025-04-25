// Escapa caracteres peligrosos para evitar inyecciones HTML
const esc = s => String(s ?? '').replace(/[&<>'"]/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
}[c]));

// Referencias al DOM
const formBox = document.getElementById('formBox');
const categorySelect = document.getElementById('category');
const categoriesSection = document.getElementById('categoriesSection');
const productsSection = document.getElementById('productsSection');
const productsTitle = document.getElementById('productsTitle');
const productDetailsModal = document.getElementById('productDetailsModal');
const productDetailsContent = document.getElementById('productDetailsContent');

// Al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  loadCategoriesIntoSelect();
  getProducts();

  document.getElementById('btnSave').addEventListener('click', e => {
    e.preventDefault();
    saveProduct();
  });

  let t;
  document.getElementById('searchBox').addEventListener('input', e => {
    clearTimeout(t);
    t = setTimeout(() => getProducts(e.target.value.trim()), 300);
  });
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
  try {
    const res = await fetch(`/api/products${q ? `?q=${encodeURIComponent(q)}` : ''}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json'
      }
    });
    const data = await res.json();
    renderProducts(data);
  } catch (err) {
    console.error('Error obteniendo productos:', err);
  }
}

async function saveProduct() {
  const id = document.getElementById('product-id').value;
  const payload = {
    category_id: parseInt(categorySelect.value),
    name: document.getElementById('name').value.trim(),
    description: document.getElementById('description').value.trim(),
    price: parseFloat(document.getElementById('price').value.trim()),
  };

  if (!payload.category_id || !payload.name || !payload.description || isNaN(payload.price)) {
    alert('Faltan campos o precio no válido'); return;
  }

  try {
    const res = await fetch(id ? `/api/products/${id}` : '/api/products', {
      method: id ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error('Error 422 (Unprocessable Content):', errData);
      alert('Error al guardar el producto. Revisa los datos.');
      return;
    }

    hideForm();
    getProducts();
  } catch (err) {
    console.error('Error guardando producto:', err);
  }
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

function renderProducts(list) {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';

  list.forEach(p => {
    const name = encodeURIComponent(p.name);
    const description = encodeURIComponent(p.description);
    const price = encodeURIComponent(p.price);

    grid.insertAdjacentHTML('beforeend', `
      <article class="card" onclick="showProductDetails('${esc(p.name)}', '${esc(p.description)}', '${esc(p.price)}', '${p.category?.name || 'Sin categoría'}')">
        <h3>${esc(p.name)}</h3>
        <small>Tienda: ${p.category?.name ? esc(p.category.name) : 'Sin categoría'}</small>
        <small>Descripcion: ${esc(p.description)}</small>
        <small>Precio: ${esc(p.price)}€</small>
        <div class="actions">
          <button class="btn btn-edit"
            onclick="event.stopPropagation(); handlePrepareEdit(${p.id}, ${p.category?.id || 'null'}, '${name}', '${description}', '${price}')">
            Editar
          </button>
          <button class="btn btn-delete" onclick="event.stopPropagation(); deleteProduct(${p.id})">Eliminar</button>
        </div>
      </article>
    `);
  });
}

// Mostrar detalles del producto en un modal
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

let t;
document.getElementById('searchBox').addEventListener('input', e => {
  clearTimeout(t);
  t = setTimeout(() => getProducts(e.target.value.trim()), 300);
});
