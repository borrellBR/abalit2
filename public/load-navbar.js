// public/load-navbar.js
document.addEventListener('DOMContentLoaded', async () => {
  const resp = await fetch('navbar.html');
  const html = await resp.text();
  const container = document.createElement('div');
  container.innerHTML = html;
  // insertarlo al principio del body
  document.body.prepend(container.firstElementChild);

  // ahora que el navbar existe, carga tu lógica de auth y otros listeners
  import('./auth.js').then(mod => {
    const { isLoggedIn, logout, login } = mod;
    const authSection = document.getElementById('authSection');
    function updateAuthUI() {
      authSection.innerHTML = isLoggedIn()
        ? '<button class="btn" onclick="logout()">Cerrar sesión</button>'
        : '<button class="btn" onclick="document.getElementById(\'loginModal\').style.display=\'flex\'">Iniciar sesión</button>';
    }
    window.logout = () => { logout(); updateAuthUI(); };
    updateAuthUI();
  });
  // load-navbar.js  (al final del todo)
  document.dispatchEvent(new Event('navbar-ready'));

});
