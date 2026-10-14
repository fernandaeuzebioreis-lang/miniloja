const botoes = document.querySelectorAll('.btn-olho');

botoes.forEach(botao => {
  botao.addEventListener('click', function() {

    const input = document.getElementById(botao.dataset.alvo);

    if (input.type === 'password') {
      input.type = 'text';
    } else {
      input.type = 'password';
    }

  });
});