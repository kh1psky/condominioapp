// src/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { auth } = require('../middleware/auth');

// Rotas públicas
router.post('/registrar', usuarioController.registrar);
router.post('/login', usuarioController.login);

// Rotas protegidas
router.get('/perfil', auth, usuarioController.obterPerfil);
router.put('/perfil', auth, usuarioController.atualizarPerfil);
router.post('/logout', auth, usuarioController.logout);

module.exports = router;