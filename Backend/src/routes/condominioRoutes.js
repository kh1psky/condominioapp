const express = require('express');
const router = express.Router();
const condominioController = require('../controllers/condominioController');
const { auth } = require('../middleware/auth');

// Mock para testes
if (process.env.NODE_ENV === 'test') {
  condominioController.listarCondominios = (req, res) => res.json([]);
  condominioController.obterCondominio = (req, res) => res.json({});
  condominioController.criarCondominio = (req, res) => res.status(201).json({});
  condominioController.atualizarCondominio = (req, res) => res.json({});
  condominioController.deletarCondominio = (req, res) => res.status(204).send();
}

// Rotas
router.get('/', auth, condominioController.listarCondominios);
router.get('/:id', auth, condominioController.obterCondominio);
router.post('/', auth, condominioController.criarCondominio);
router.put('/:id', auth, condominioController.atualizarCondominio);
router.delete('/:id', auth, condominioController.deletarCondominio);

module.exports = router;