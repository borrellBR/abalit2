
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) return location.href = 'login.html';


  fetch('/api/user', {
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
  })
    .then(r => {
      if (r.status === 401) throw new Error('unauth');
      if (!r.ok) throw new Error('http');
      return r.json();
    })
    .then(u => {

      document.getElementById('name').value = u.name ?? '';
      document.getElementById('email').value = u.email ?? '';
      document.getElementById('phone').value = u.phone ?? '';
    })
    .catch(err => {
      if (err.message === 'unauth') {
        localStorage.removeItem('token');
        location.href = 'login.html';
      } else {
        showMsg('No se pudieron cargar tus datos.', true);
      }
    });


  document.getElementById('accountForm').addEventListener('submit', async e => {
    e.preventDefault();

    const body = JSON.stringify({
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim()
    });

    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body
      });

      if (res.status === 401) throw new Error('unauth');
      if (!res.ok) throw new Error('http');

      showMsg('Datos actualizados correctamente.', false);
    } catch (err) {
      if (err.message === 'unauth') {
        localStorage.removeItem('token');
        location.href = 'login.html';
      } else {
        showMsg('No se pudieron guardar los cambios.', true);
      }
    }
  });
});


function showMsg(text, isError = false) {
  const box = document.getElementById('msg');
  box.textContent = text;
  box.className = 'alert ' + (isError ? 'alert-error' : 'alert-success');
  box.style.display = 'block';
  setTimeout(() => box.style.display = 'none', 4000);
}
