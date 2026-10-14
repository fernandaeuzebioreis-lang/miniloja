# MiniLoja

Loja virtual full stack feita para praticar desenvolvimento web de ponta a ponta: banco de dados relacional, API REST, autenticação e interface em HTML, CSS e JavaScript puro.

## Funcionalidades

- Listagem de produtos vinda do banco de dados
- Cadastro de usuário com senha criptografada (bcrypt)
- Login com validação da senha
- Recuperação de senha ("Esqueci minha senha")
- Botão de mostrar/ocultar senha nos formulários
- Carrinho de compras salvo no navegador (`localStorage`)
- Finalização de pedido, com cálculo do total feito no servidor
- CRUD completo de produtos na API

## Tecnologias

| Camada | Tecnologias |
|---|---|
| Front-end | HTML5, CSS3, JavaScript (fetch API, localStorage) |
| Back-end | Node.js, Express |
| Banco de dados | MySQL |
| Bibliotecas | mysql2, bcrypt, dotenv |
| Ferramentas | VS Code, MySQL Workbench, Thunder Client |

## Estrutura de pastas

```
miniloja/
├── config/
│   └── db.js              # conexão com o MySQL
├── routes/
│   ├── produtos.js        # CRUD de produtos
│   ├── usuarios.js        # cadastro, login, perfil e troca de senha
│   └── pedidos.js         # criação de pedidos
├── public/                # front-end servido pelo Express
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── produtos.js
│   │   ├── auth.js
│   │   ├── cadastro.js
│   │   ├── esqueci-senha.js
│   │   ├── carrinho.js
│   │   └── olho-senha.js
│   ├── index.html
│   ├── login.html
│   ├── cadastro.html
│   ├── esqueci-senha.html
│   └── carrinho.html
├── .env                   # variáveis de ambiente (não vai pro GitHub)
├── .gitignore
├── package.json
└── server.js
```

## Banco de dados

Banco: `miniloja_db`, com quatro tabelas. A tabela `itens_pedido` resolve a relação N:N entre pedidos e produtos.

```sql
CREATE DATABASE miniloja_db;
USE miniloja_db;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  tipo ENUM('cliente', 'admin') NOT NULL DEFAULT 'cliente',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao VARCHAR(255) NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  estoque INT NOT NULL DEFAULT 0,
  categoria VARCHAR(50),
  imagem_url VARCHAR(255),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  status ENUM('pendente','pago','enviado','entregue','cancelado') NOT NULL DEFAULT 'pendente',
  total DECIMAL(10,2) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE itens_pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  produto_id INT NOT NULL,
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);
```

O `preco_unitario` fica salvo em cada item do pedido, porque o preço do produto pode mudar depois e o histórico do pedido não deve mudar junto.

## Como rodar o projeto

### Pré-requisitos

- Node.js instalado
- MySQL instalado e rodando

### Passo a passo

1. Clone o repositório e entre na pasta:
   ```bash
   git clone <url-do-repositorio>
   cd miniloja
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie o banco e as tabelas rodando o SQL da seção acima no MySQL Workbench.

4. Crie um arquivo `.env` na raiz do projeto:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=sua_senha_do_mysql
   DB_NAME=miniloja_db
   PORT=3000
   ```

5. Inicie o servidor:
   ```bash
   node server.js
   ```

6. Abra no navegador: `http://localhost:3000`

> Abra o site sempre pela URL do servidor, não clicando direto no arquivo `index.html`.

## Rotas da API

### Produtos

| Método | Rota | Descrição |
|---|---|---|
| GET | `/produtos` | Lista todos os produtos |
| GET | `/produtos/:id` | Busca um produto |
| POST | `/produtos` | Cria um produto |
| PUT | `/produtos/:id` | Atualiza um produto |
| DELETE | `/produtos/:id` | Remove um produto |

### Usuários

| Método | Rota | Descrição |
|---|---|---|
| POST | `/usuarios` | Cadastra usuário (senha criptografada) |
| POST | `/usuarios/login` | Valida email e senha |
| GET | `/usuarios/:id` | Retorna dados do usuário, sem a senha |
| PUT | `/usuarios/senha` | Troca a senha pelo email |

### Pedidos

| Método | Rota | Descrição |
|---|---|---|
| POST | `/pedidos` | Cria um pedido com seus itens |

Exemplo de corpo para `POST /pedidos`:

```json
{
  "usuario_id": 1,
  "itens": [
    { "produto_id": 1, "quantidade": 2 },
    { "produto_id": 3, "quantidade": 1 }
  ]
}
```

O servidor busca o preço de cada produto no banco e calcula o total, sem confiar em valores enviados pelo navegador.

## Decisões de segurança

- Senhas salvas apenas como hash (`bcrypt`), nunca em texto puro
- Rotas que devolvem usuário selecionam só as colunas necessárias, então o hash da senha não sai na resposta
- Login devolve a mesma mensagem para email inexistente e senha errada, para não revelar quais emails existem
- Preço e total do pedido são calculados no servidor
- Consultas com `?` (queries parametrizadas), que protegem contra SQL injection
- `.env` listado no `.gitignore`

## Desafios enfrentados e aprendizados

Durante o desenvolvimento, resolvi problemas que ajudaram a fixar conceitos importantes:

- **Estrutura de pastas e módulos Node:** erros como `Cannot find module` e `router is not defined` vieram de pastas fora do lugar e de arquivos sem os `require` e o `module.exports`.
- **Variáveis de ambiente:** um erro `Access denied` do MySQL foi investigado com `console.log` temporário e com um teste de conexão isolado no Node, até confirmar que o `.env` estava sendo lido corretamente. Aprendi que o servidor precisa ser reiniciado após mudar o `.env`.
- **SQL:** uso correto de `ENUM`, `DECIMAL` para dinheiro, chaves estrangeiras e a tabela de junção para relação N:N.
- **Tratamento de erros:** o erro `ER_DUP_ENTRY` do MySQL é tratado no cadastro para devolver "Email já cadastrado" (status 409) em vez de um erro genérico.
- **Fluxo assíncrono:** loops com `for...of` e `await` para buscar preços e gravar os itens do pedido, na ordem certa.
- **Front-end e CSS:** conflito de especificidade ao posicionar o botão de mostrar senha dentro do campo (`.form-card button` sobrescrevendo `.btn-olho`).
- **Depuração:** uso do Console e da aba Network do navegador para achar um arquivo com nome errado (`carrinho..js`), que gerava erro 404.

## Limitações conhecidas e próximos passos

- [ ] Autenticação com sessão ou token (JWT). Hoje o usuário logado fica no `localStorage`
- [ ] Recuperação de senha com envio de email e link temporário, em vez de troca direta
- [ ] Transação (`BEGIN`/`COMMIT`/`ROLLBACK`) na criação de pedidos, para não deixar pedidos pela metade
- [ ] Controle de estoque ao finalizar o pedido
- [ ] Rotas de consulta de pedidos (`GET /pedidos/:id` e histórico por usuário)
- [ ] Painel administrativo para gerenciar produtos e status dos pedidos
- [ ] Proteção das rotas de produtos (apenas admin)
- [ ] Deploy (Render, Railway ou similar)

## Autora

Fernanda Euzebio dos Reis, estudante de Análise e Desenvolvimento de Sistemas.
