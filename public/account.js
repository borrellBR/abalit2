// account.js
document.addEventListener('navbar-ready', init);   // cuando la navbar avise
if (document.querySelector('header.topbar')) init(); // …o si ya estaba

function init() {
  loadProfile();

  document.getElementById('accountForm')
    .addEventListener('submit', handleSave);

  document.getElementById('btnLogout')
    .addEventListener('click', () => {
      localStorage.removeItem('token');
      location.href = 'home.html';
    });

  // si la navbar expone estas utilidades…
  if (window.initSearch) initSearch();
  if (window.updateAuthUI) updateAuthUI();
}

async function loadProfile() {
  const token = localStorage.getItem('token');
  if (!token) return redirectLogin();

  try {
    const res = await fetch('/api/user', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.status === 401) return redirectLogin();

    const u = await res.json();
    ['name', 'email', 'phone'].forEach(key =>
      (document.getElementById(key).value = u[key] ?? '')
    );
  } catch (err) {
    console.error(err);
    showMessage('Error al cargar perfil', 'error');
  }
}

async function handleSave(e) {
  e.preventDefault();
  const token = localStorage.getItem('token');
  if (!token) return redirectLogin();

  const payload = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim() || null
  };

  try {
    const res = await fetch('/api/user', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (res.status === 401) return redirectLogin();
    if (!res.ok) return showMessage('No se pudo guardar', 'error');

    showMessage('Datos actualizados', 'success');
  } catch (err) {
    console.error(err);
    showMessage('Error de red', 'error');
  }
}

function redirectLogin() {
  localStorage.removeItem('token');
  location.href = 'login.html';
}

function showMessage(text, variant) {
  const box = document.getElementById('msg');
  box.className = `alert alert-${variant}`;
  box.textContent = text;
  box.style.display = 'block';
  setTimeout(() => (box.style.display = 'none'), 3500);
}
