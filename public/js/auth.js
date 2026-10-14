document.getElementById('form-login').addEventListener('submit', async function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  const resposta = await fetch('http://localhost:3000/usuarios/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });

  const dados = await resposta.json();

  if (resposta.ok) {
    localStorage.setItem('usuarioLogado', JSON.stringify(dados));
    window.location.href = 'index.html';
  } else {
    document.getElementById('mensagem-erro').textContent = dados.erro;
  }
});