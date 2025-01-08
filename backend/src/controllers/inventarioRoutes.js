// src/routes/inventarioRoutes.js
const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');
const { auth } = require('../middleware/auth');

router.get('/', auth, inventarioController.listar);
router.post('/', auth, inventarioController.registrarItem);
router.post('/manutencao', auth, inventarioController.registrarManutencao);

module.exports = router;