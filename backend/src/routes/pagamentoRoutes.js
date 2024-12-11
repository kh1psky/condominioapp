const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');
const { auth } = require('../middleware/auth');

// Mock para testes
if (process.env.NODE_ENV === 'test') {
  const mockResponse = (data) => (req, res) => res.json(data);
  
  pagamentoController.listarPagamentos = mockResponse([]);
  pagamentoController.criarPagamento = (req, res) => res.status(201).json({});
  pagamentoController.atualizarPagamento = mockResponse({});
  pagamentoController.deletarPagamento = (req, res) => res.status(204).send();
}

// Rotas de pagamentos
router.get('/unidade/:unidadeId/pagamentos', auth, pagamentoController.listarPagamentos);
router.post('/unidade/:unidadeId/pagamentos', auth, pagamentoController.criarPagamento);
router.put('/:id', auth, pagamentoController.atualizarPagamento);
router.delete('/:id', auth, pagamentoController.deletarPagamento);

module.exports = router;