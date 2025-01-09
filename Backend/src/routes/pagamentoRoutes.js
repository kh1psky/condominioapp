// src/routes/pagamentoRoutes.js
const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');
const { auth } = require('../middleware/auth');

// Aplicar middleware de autenticação em todas as rotas
router.use(auth);

// Rotas básicas
router.post('/', pagamentoController.criarPagamento);
router.get('/', pagamentoController.listarPagamentos);

// Rotas específicas por unidade
router.get('/unidade/:unidadeId', pagamentoController.listarPagamentos);

// Buscar um pagamento específico
router.get('/:id', pagamentoController.getPagamento);

module.exports = router;