
export function isLoggedIn() {
  return Boolean(localStorage.getItem('token'));
}

export async function login(email, password) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Login fallido');
  const { token } = await res.json();
  localStorage.setItem('token', token);
}


export async function register(name, email, password, phone = '') {
  const res = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, phone })
  });
  if (!res.ok) {

    let err;
    try { err = await res.json(); } catch { err = { message: 'Registro fallido' }; }
    throw new Error(err.message || 'Registro fallido');
  }
  const { token } = await res.json();
  localStorage.setItem('token', token);
}

export function logout() {
  localStorage.removeItem('token');
}


window.auth = { isLoggedIn, login, register, logout };
