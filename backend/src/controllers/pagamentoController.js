const { Pagamento, Unidade } = require('../models');
const logger = require('../config/logger');

const listarPagamentos = async (req, res) => {
  try {
    const { unidadeId } = req.params;
    const pagamentos = await Pagamento.findAll({
      where: { unidadeId },
      include: [{
        model: Unidade,
        attributes: ['numero', 'bloco']
      }]
    });
    res.json(pagamentos);
  } catch (error) {
    logger.error('Erro ao listar pagamentos:', error);
    res.status(500).json({ error: 'Erro ao listar pagamentos' });
  }
};

const criarPagamento = async (req, res) => {
  try {
    const { unidadeId } = req.params;
    const pagamento = await Pagamento.create({
      ...req.body,
      unidadeId
    });
    res.status(201).json(pagamento);
  } catch (error) {
    logger.error('Erro ao criar pagamento:', error);
    res.status(500).json({ error: 'Erro ao criar pagamento' });
  }
};

const atualizarPagamento = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Pagamento.update(req.body, {
      where: { id }
    });
    if (!updated) {
      return res.status(404).json({ error: 'Pagamento não encontrado' });
    }
    const pagamento = await Pagamento.findByPk(id);
    res.json(pagamento);
  } catch (error) {
    logger.error('Erro ao atualizar pagamento:', error);
    res.status(500).json({ error: 'Erro ao atualizar pagamento' });
  }
};

const deletarPagamento = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Pagamento.destroy({
      where: { id }
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Pagamento não encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    logger.error('Erro ao deletar pagamento:', error);
    res.status(500).json({ error: 'Erro ao deletar pagamento' });
  }
};

module.exports = {
  listarPagamentos,
  criarPagamento,
  atualizarPagamento,
  deletarPagamento
};