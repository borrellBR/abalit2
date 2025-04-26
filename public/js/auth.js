// public/js/auth.js
window.auth = (function () {
  function isLoggedIn() {
    return !!localStorage.getItem('token');
  }
  async function login(email, password) {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Login fallido');
    const { token } = await res.json();
    localStorage.setItem('token', token);
  }
  function logout() {
    localStorage.removeItem('token');
  }
  return { isLoggedIn, login, logout };
})();
