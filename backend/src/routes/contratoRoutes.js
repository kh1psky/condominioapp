// src/routes/contratoRoutes.js
const express = require('express');
const router = express.Router();
const contratoController = require('../controllers/contratoController');
const { auth } = require('../middleware/auth');

router.get('/', auth, contratoController.listar);
router.post('/', auth, contratoController.criar);
router.put('/:id', auth, contratoController.atualizar);

module.exports = router;