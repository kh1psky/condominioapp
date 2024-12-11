// src/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { auth } = require('../middleware/auth');

router.get('/metricas', auth, dashboardController.getMetricas);
router.get('/pendencias', auth, dashboardController.getPendencias);
router.get('/grafico-financeiro', auth, dashboardController.getGraficoFinanceiro);

module.exports = router;