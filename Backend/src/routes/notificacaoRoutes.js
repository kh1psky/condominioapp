// src/routes/notificacaoRoutes.js
const express = require('express');
const router = express.Router();
const notificacaoController = require('../controllers/notificacaoController');
const { auth } = require('../middleware/auth');

router.get('/', auth, notificacaoController.listarNotificacoes);
router.post('/', auth, notificacaoController.enviarNotificacao);
router.patch('/:id/lida', auth, notificacaoController.marcarComoLida);

module.exports = router;