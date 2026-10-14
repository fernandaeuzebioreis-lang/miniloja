document.getElementById('form-esqueci-senha').addEventListener('submit', async function(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const novaSenha = document.getElementById('novaSenha').value;

  const resposta = await fetch('http://localhost:3000/usuarios/senha', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, novaSenha })
  });

  const dados = await resposta.json();

  if (resposta.ok) {
    document.getElementById('mensagem-sucesso').textContent = dados.mensagem;
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
  } else {
    document.getElementById('mensagem-erro').textContent = dados.erro;
  }
});