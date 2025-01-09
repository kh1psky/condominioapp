// src/routes/manutencaoRoutes.js
const express = require('express');
const router = express.Router();
const manutencaoController = require('../controllers/manutencaoController');
const { auth } = require('../middleware/auth');

// Rotas básicas
router.get('/', auth, manutencaoController.listar);
router.post('/', auth, manutencaoController.criar);
router.put('/:id', auth, manutencaoController.atualizar);
router.get('/:id', auth, manutencaoController.buscarPorId);
router.delete('/:id', auth, manutencaoController.deletar);

// Rota para concluir manutenção
router.put('/:id/concluir', auth, manutencaoController.concluir);

module.exports = router;