// public/js/load-navbar.js
(function () {
  document.addEventListener('DOMContentLoaded', async () => {
    /* 1. Inyecta la barra ------------------------------------------------- */
    try {
      const resp = await fetch('navbar.html');       // busca el fragmento
      const html = await resp.text();
      const container = document.createElement('div');
      container.innerHTML = html;

      // header + (cualquier otro elemento) se insertan al principio <body>
      Array.from(container.children).forEach(el => {
        document.body.prepend(el);
      });
    } catch (e) {
      console.error('load-navbar:', e);
      return;                                        // cancela si falla
    }

    /* 2. Dispara evento para que otros scripts (search-modal, etc.) escuchen */
    document.dispatchEvent(new Event('navbar-injected'));

    /* 3. Carga auth.js como módulo --------------------------------------- */
    const s = document.createElement('script');
    s.type = 'module';
    s.src = 'js/auth.js';
    document.body.appendChild(s);

    /* 4. Una vez auth.js está listo… ------------------------------------- */
    s.onload = () => {
      const { isLoggedIn, logout } = window.auth;
      const authSection = document.getElementById('authSection');

      /* Pinta el botón adecuado en función del estado ------------------- */
      function renderAuth() {
        authSection.replaceChildren();               // limpia contenedor
        if (isLoggedIn()) {
          const btn = document.createElement('button');
          btn.className = 'btn';
          btn.textContent = 'Cerrar sesión';
          btn.addEventListener('click', () => {
            logout();                                // elimina token
            renderAuth();                            // repinta
          });
          authSection.appendChild(btn);
        } else {
          const btn = document.createElement('button');
          btn.className = 'btn';
          btn.textContent = 'Iniciar sesión';
          btn.addEventListener('click', () => {
            location.href = 'login.html';            // vista independiente
          });
          authSection.appendChild(btn);
        }
      }

      /* Exponer logout global y dibujar la primera vez */
      window.logout = () => { logout(); renderAuth(); };
      renderAuth();
    };
  });
})();
