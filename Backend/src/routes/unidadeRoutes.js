// src/routes/unidadeRoutes.js
const express = require('express');
const router = express.Router();
const unidadeController = require('../controllers/unidadeController');
const { auth } = require('../middleware/auth');

// Rotas gerais
router.get('/', auth, unidadeController.listarUnidades);
router.post('/', auth, unidadeController.criarUnidade);
router.get('/:id/detalhes', auth, unidadeController.getDetalhesUnidade);
router.put('/:id', auth, unidadeController.atualizarUnidade);
router.delete('/:id', auth, unidadeController.deletarUnidade);

// Rotas específicas por condomínio
router.get('/condominio/:condominioId', auth, unidadeController.listarUnidades);
router.post('/condominio/:condominioId', auth, unidadeController.criarUnidade);

module.exports = router;