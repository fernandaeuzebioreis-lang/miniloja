const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);
    const [resultado] = await db.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      [nome, email, senhaHash]
    );
    res.status(201).json({ id: resultado.insertId, nome, email });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ erro: 'Email já cadastrado' });
    }
    res.status(500).json({ erro: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [usuario] = await db.query(
      'SELECT id, nome, email, tipo, criado_em FROM usuarios WHERE id = ?',
      [req.params.id]
    );
    if (usuario.length === 0) return res.status(404).json({ erro: 'Usuario não encontrado' });
    res.json(usuario[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const [resultado] = await db.query(
      'SELECT id, nome, email, senha FROM usuarios WHERE email = ?',
      [email]
    );

    if (resultado.length === 0) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const usuario = resultado[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    res.json({ id: usuario.id, nome: usuario.nome, email: usuario.email });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});
router.put('/senha', async (req, res) => {
  try {
    const { email, novaSenha } = req.body;

    const [usuario] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);

    if (usuario.length === 0) {
      return res.status(404).json({ erro: 'Email não encontrado' });
    }

    const senhaHash = await bcrypt.hash(novaSenha, 10);

    await db.query('UPDATE usuarios SET senha = ? WHERE email = ?', [senhaHash, email]);

    res.json({ mensagem: 'Senha atualizada com sucesso' });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;