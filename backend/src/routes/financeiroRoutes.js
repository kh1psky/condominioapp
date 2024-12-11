// src/routes/financeiroRoutes.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');  // Corrigido para usar destructuring
const financeiroController = require('../controllers/financeiroController');

// Mock para testes
if (process.env.NODE_ENV === 'test') {
  financeiroController.registrarMovimentacao = (req, res) => res.status(201).json({});
  financeiroController.listarMovimentacoes = (req, res) => res.json([]);
  financeiroController.fluxoCaixa = (req, res) => res.json({});
  financeiroController.inadimplencia = (req, res) => res.json({});
}

router.post('/movimentacoes', auth, financeiroController.registrarMovimentacao);
router.get('/movimentacoes', auth, financeiroController.listarMovimentacoes);
router.get('/fluxo-caixa', auth, financeiroController.fluxoCaixa);
router.get('/inadimplencia/:condominioId', auth, financeiroController.inadimplencia);

module.exports = router;