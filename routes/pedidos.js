const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/', async (req, res) => {
  try {
    const { usuario_id, itens } = req.body;

    let total = 0;

    for (const item of itens) {
      const [produto] = await db.query('SELECT preco FROM produtos WHERE id = ?', [item.produto_id]);
      const preco = produto[0].preco;
      total += preco * item.quantidade;
    }

    const [resultado] = await db.query(
      'INSERT INTO pedidos (usuario_id, total) VALUES (?, ?)',
      [usuario_id, total]
    );

    const pedido_id = resultado.insertId;

    for (const item of itens) {
      const [produto] = await db.query('SELECT preco FROM produtos WHERE id = ?', [item.produto_id]);
      const preco = produto[0].preco;
      await db.query(
        'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)',
        [pedido_id, item.produto_id, item.quantidade, preco]
      );
    }

    res.status(201).json({ id: pedido_id, total });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;