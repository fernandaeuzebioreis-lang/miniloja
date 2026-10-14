const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json()); // essencial pra ler req.body

const produtosRoutes = require('./routes/produtos');
app.use('/produtos', produtosRoutes);
const usuariosRoutes = require('./routes/usuarios');
app.use('/usuarios', usuariosRoutes);
const pedidosRoutes = require('./routes/pedidos');
app.use('/pedidos', pedidosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
app.use(express.static('public'));