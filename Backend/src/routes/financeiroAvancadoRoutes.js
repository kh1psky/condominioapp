// src/routes/financeiroAvancadoRoutes.js
const express = require('express');
const router = express.Router();
const financeiroAvancadoController = require('../controllers/financeiroAvancadoController');
const { auth } = require('../middleware/auth');

router.post('/movimentacao', auth, financeiroAvancadoController.registrarMovimentacao);
router.get('/fluxo-caixa', auth, financeiroAvancadoController.fluxoCaixa);
router.get('/previsao/:condominioId', auth, financeiroAvancadoController.previsao);

module.exports = router;