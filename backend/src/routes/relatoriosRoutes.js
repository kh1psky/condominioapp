// src/routes/relatoriosRoutes.js
const express = require('express');
const router = express.Router();
const relatoriosController = require('../controllers/relatoriosController');
const { auth } = require('../middleware/auth');

router.get('/financeiro', auth, relatoriosController.relatorioFinanceiro);
router.get('/ocupacao', auth, relatoriosController.relatorioOcupacao);
router.get('/manutencoes', auth, relatoriosController.relatorioManutencoes);

module.exports = router;