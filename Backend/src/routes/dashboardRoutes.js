const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/metricas', (req, res, next) => {
  console.log('Acessando rota /metricas');
  dashboardController.obterMetricas(req, res).catch(next);
});

router.get('/pendencias', (req, res, next) => {
  console.log('Acessando rota /pendencias');
  dashboardController.obterPendencias(req, res).catch(next);
});

router.get('/grafico-financeiro', (req, res, next) => {
  console.log('Acessando rota /grafico-financeiro');
  dashboardController.obterGraficoFinanceiro(req, res).catch(next);
});

module.exports = router;