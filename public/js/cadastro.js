document.getElementById('form-cadastro').addEventListener('submit', async function(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  const resposta = await fetch('http://localhost:3000/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha })
  });

  const dados = await resposta.json();

  if (resposta.ok) {
    window.location.href = 'login.html';
  } else {
    document.getElementById('mensagem-erro').textContent = dados.erro;
  }
});

