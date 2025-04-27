(function () {
  document.addEventListener('DOMContentLoaded', async () => {

    try {
      const resp = await fetch('navbar.html');
      const html = await resp.text();
      const container = document.createElement('div');
      container.innerHTML = html;

      Array.from(container.children).forEach(el => {
        document.body.prepend(el);
      });
    } catch (e) {
      console.error('load-navbar:', e);
      return;
    }


    document.dispatchEvent(new Event('navbar-injected'));


    const s = document.createElement('script');
    s.type = 'module';
    s.src = 'js/auth.js';
    document.body.appendChild(s);


    s.onload = () => {
      const { isLoggedIn, logout } = window.auth;
      const authSection = document.getElementById('authSection');


      function renderAuth() {
        authSection.replaceChildren();
        if (isLoggedIn()) {
          const btn = document.createElement('button');
          btn.className = 'btn';
          btn.textContent = 'Cerrar sesión';
          btn.addEventListener('click', () => {
            logout();
            renderAuth();
          });
          authSection.appendChild(btn);
        } else {
          const btn = document.createElement('button');
          btn.className = 'btn';
          btn.textContent = 'Iniciar sesión';
          btn.addEventListener('click', () => {
            location.href = 'login.html';
          });
          authSection.appendChild(btn);
        }
      }

      window.logout = () => { logout(); renderAuth(); };
      renderAuth();
    };

  });


})();
