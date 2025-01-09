const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const condominioRoutes = require('./condominioRoutes');
const usuarioRoutes = require('./usuarioRoutes');

router.use('/auth', authRoutes);
router.use('/condominios', condominioRoutes);
router.use('/usuarios', usuarioRoutes);

module.exports = router;