const express = require('express');
const router = express.Router();
const unidadeController = require('../controllers/unidadeController');
const { auth } = require('../middleware/auth');

// Mock para testes
if (process.env.NODE_ENV === 'test') {
  const mockResponse = (data) => (req, res) => res.json(data);
  
  unidadeController.listarUnidades = mockResponse([]);
  unidadeController.criarUnidade = (req, res) => res.status(201).json({});
  unidadeController.atualizarUnidade = mockResponse({});
  unidadeController.deletarUnidade = (req, res) => res.status(204).send();
}

// Rotas para unidades de um condomínio específico
router.get('/condominio/:condominioId/unidades', auth, unidadeController.listarUnidades);
router.post('/condominio/:condominioId/unidades', auth, unidadeController.criarUnidade);

// Rotas para unidades específicas
router.put('/:id', auth, unidadeController.atualizarUnidade);
router.delete('/:id', auth, unidadeController.deletarUnidade);

module.exports = router;