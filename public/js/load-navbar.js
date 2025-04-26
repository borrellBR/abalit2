// public/js/load-navbar.js
(function () {
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const resp = await fetch('navbar.html');
      const html = await resp.text();
      const container = document.createElement('div');
      container.innerHTML = html;

      // INYECTA header + modal juntos:
      Array.from(container.children).forEach(el => {
        document.body.prepend(el);
      });
    } catch (e) {
      console.error('load-navbar:', e);
      return;
    }

    // Dispara tu evento para que el search-modal.js se enganche
    document.dispatchEvent(new Event('navbar-injected'));

    // Inyecta auth.js
    const s = document.createElement('script');
    s.src = 'js/auth.js';
    s.defer = true;
    document.body.appendChild(s);
    s.onload = () => {
      const { isLoggedIn, logout } = window.auth;
      const authSection = document.getElementById('authSection');
      function update() {
        authSection.innerHTML = isLoggedIn()
          ? '<button class="btn" onclick="logout()">Cerrar sesión</button>'
          : '<button class="btn" onclick="document.getElementById(\'loginModal\').style.display=\'flex\'">Iniciar sesión</button>';
      }
      window.logout = () => { logout(); update(); };
      update();
    };
  });
})();
