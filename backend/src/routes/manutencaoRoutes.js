// src/routes/manutencaoRoutes.js
const express = require('express');
const router = express.Router();
const manutencaoController = require('../controllers/manutencaoController');
const { auth } = require('../middleware/auth');

router.get('/', auth, manutencaoController.listar);
router.post('/', auth, manutencaoController.criar);
router.put('/:id', auth, manutencaoController.atualizar);
router.patch('/:id/concluir', auth, manutencaoController.concluir);

module.exports = router;