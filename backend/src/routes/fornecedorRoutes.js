// src/routes/fornecedorRoutes.js
const express = require('express');
const router = express.Router();
const financeiroController = require('../controllers/financeiroController');
const { auth } = require('../middleware/auth');

// Rotas básicas
router.post('/movimentacoes', auth, financeiroController.registrarMovimentacao);
router.get('/movimentacoes', auth, financeiroController.listarMovimentacoes);

// Relatórios
router.get('/fluxo-caixa', auth, financeiroController.fluxoCaixa);
router.get('/inadimplencia/:condominioId', auth, financeiroController.inadimplencia);

module.exports = router;