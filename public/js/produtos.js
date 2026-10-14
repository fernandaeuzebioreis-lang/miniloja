async function carregarProdutos() {
  const resposta = await fetch('http://localhost:3000/produtos');
  const produtos = await resposta.json();

  const container = document.getElementById('lista-produtos');

  produtos.forEach(produto => {
    const card = document.createElement('div');
    card.classList.add('produto-card');
    card.innerHTML = `
      <h3>${produto.nome}</h3>
      <p>${produto.descricao}</p>
      <p><strong>R$ ${produto.preco}</strong></p>
      <p>Estoque: ${produto.estoque}</p>
      <button class="btn-primario" onclick="adicionarAoCarrinho(${produto.id}, '${produto.nome}', ${produto.preco})">
        Adicionar ao carrinho
      </button>
    `;
    container.appendChild(card);
  });
}

function adicionarAoCarrinho(id, nome, preco) {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

  const itemExistente = carrinho.find(item => item.produto_id === id);

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ produto_id: id, nome, preco, quantidade: 1 });
  }

  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  alert(`${nome} adicionado ao carrinho!`);
}

carregarProdutos();