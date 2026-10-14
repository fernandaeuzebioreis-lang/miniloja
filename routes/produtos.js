const express = require('express');
const router = express.Router();
const db = require('../config/db');

// LISTAR todos os produtos
router.get('/', async (req, res) => {
  try {
    const [produtos] = await db.query('SELECT * FROM produtos');
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// BUSCAR um produto por id
router.get('/:id', async (req, res) => {
  try {
    const [produto] = await db.query('SELECT * FROM produtos WHERE id = ?', [req.params.id]);
    if (produto.length === 0) return res.status(404).json({ erro: 'Produto não encontrado' });
    res.json(produto[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// CRIAR produto
router.post('/', async (req, res) => {
  try {
    const { nome, descricao, preco, estoque, categoria, imagem_url } = req.body;
    const [resultado] = await db.query(
      'INSERT INTO produtos (nome, descricao, preco, estoque, categoria, imagem_url) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, descricao, preco, estoque, categoria, imagem_url]
    );
    res.status(201).json({ id: resultado.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ATUALIZAR produto
router.put('/:id', async (req, res) => {
  try {
    const { nome, descricao, preco, estoque, categoria, imagem_url } = req.body;
    await db.query(
      'UPDATE produtos SET nome=?, descricao=?, preco=?, estoque=?, categoria=?, imagem_url=? WHERE id=?',
      [nome, descricao, preco, estoque, categoria, imagem_url, req.params.id]
    );
    res.json({ mensagem: 'Produto atualizado' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// DELETAR produto
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM produtos WHERE id = ?', [req.params.id]);
    res.json({ mensagem: 'Produto removido' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;