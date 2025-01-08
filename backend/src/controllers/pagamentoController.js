// src/controllers/pagamentoController.js
const { Pagamento, Unidade } = require('../models');
const logger = require('../config/logger');

const calcularProximoVencimento = (dataAtual) => {
  const data = new Date(dataAtual);
  const dia = data.getDate();
  let mes = data.getMonth() + 1;
  let ano = data.getFullYear();

  if (mes === 11) { // Dezembro
    mes = 0; // Janeiro
    ano += 1;
  } else {
    mes += 1;
  }

  return new Date(ano, mes, dia);
};

const pagamentoController = {
  async criarPagamento(req, res) {
    try {
      const {
        unidadeId,
        valor_total,
        valor_dinheiro,
        valor_pix,
        metodo_pagamento,
        observacao
      } = req.body;

      // Buscar a unidade
      const unidade = await Unidade.findByPk(unidadeId);
      if (!unidade) {
        return res.status(404).json({ error: 'Unidade não encontrada' });
      }

      // Verificar se a unidade está ocupada
      if (!unidade.statusOcupacao) {
        return res.status(400).json({ error: 'Não é possível registrar pagamento para uma unidade desocupada' });
      }

      // Calcular próximo vencimento mantendo o mesmo dia
      const proximoVencimento = calcularProximoVencimento(unidade.dataVencimento);

      // Criar o pagamento
      const pagamento = await Pagamento.create({
        unidadeId,
        valor: valor_total,
        valor_dinheiro: metodo_pagamento === 'pix' ? 0 : valor_dinheiro,
        valor_pix: metodo_pagamento === 'dinheiro' ? 0 : valor_pix,
        metodo_pagamento,
        status: 'pago',
        data_pagamento: new Date(),
        data_vencimento: unidade.dataVencimento,
        observacao
      });

      // Atualizar a data de vencimento da unidade
      await unidade.update({
        dataVencimento: proximoVencimento
      });

      const pagamentoCompleto = await Pagamento.findByPk(pagamento.id, {
        include: [{
          model: Unidade,
          as: 'unidade',
          attributes: ['id', 'numero', 'bloco', 'valorAluguel', 'dataVencimento']
        }]
      });

      res.status(201).json(pagamentoCompleto);
    } catch (error) {
      logger.error('Erro ao criar pagamento:', error);
      res.status(500).json({ error: error.message || 'Erro ao criar pagamento' });
    }
  },

  async listarPagamentos(req, res) {
    try {
      const { unidadeId } = req.params;
      const where = unidadeId ? { unidadeId } : {};

      const pagamentos = await Pagamento.findAll({
        where,
        include: [{
          model: Unidade,
          as: 'unidade',
          attributes: ['id', 'numero', 'bloco', 'valorAluguel', 'dataVencimento']
        }],
        order: [['data_pagamento', 'DESC']]
      });

      res.json(pagamentos);
    } catch (error) {
      logger.error('Erro ao listar pagamentos:', error);
      res.status(500).json({ error: 'Erro ao listar pagamentos' });
    }
  },

  async getPagamento(req, res) {
    try {
      const { id } = req.params;
      const pagamento = await Pagamento.findByPk(id, {
        include: [{
          model: Unidade,
          as: 'unidade',
          attributes: ['id', 'numero', 'bloco', 'valorAluguel', 'dataVencimento']
        }]
      });

      if (!pagamento) {
        return res.status(404).json({ error: 'Pagamento não encontrado' });
      }

      res.json(pagamento);
    } catch (error) {
      logger.error('Erro ao buscar pagamento:', error);
      res.status(500).json({ error: 'Erro ao buscar pagamento' });
    }
  }
};

module.exports = pagamentoController;