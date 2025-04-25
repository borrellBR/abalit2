// auth.js

export function isLoggedIn() {
  return !!localStorage.getItem('token');
}

export function setToken(token) {
  localStorage.setItem('token', token);
}

export function logout() {
  const token = localStorage.getItem('token');
  if (token) {
    fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    }).finally(() => {
      localStorage.removeItem('token');
      window.location.href = '/login.html';
    });
  }
}

export async function login(email, password) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) throw data;

  setToken(data.token);
  return data;
}

export async function register(name, email, password, phone = '') {
  const res = await fetch('/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ name, email, password, phone })
  });

  const data = await res.json();

  if (!res.ok) throw data;

  setToken(data.token);
  return data;
}
