document.getElementById('btn-finalizar').addEventListener('click', async function() {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  if (!usuarioLogado) {
    document.getElementById('mensagem-erro').textContent = 'Você precisa fazer login para finalizar o pedido';
    return;
  }

  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

  if (carrinho.length === 0) {
    document.getElementById('mensagem-erro').textContent = 'Carrinho vazio';
    return;
  }

  const itens = carrinho.map(item => ({
    produto_id: item.produto_id,
    quantidade: item.quantidade
  }));

  const resposta = await fetch('http://localhost:3000/pedidos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario_id: usuarioLogado.id, itens })
  });

  const dados = await resposta.json();

  if (resposta.ok) {
    localStorage.removeItem('carrinho');
    alert(`Pedido criado! Total: R$ ${dados.total}`);
    window.location.href = 'index.html';
  } else {
    document.getElementById('mensagem-erro').textContent = dados.erro;
  }
});

exibirCarrinho();