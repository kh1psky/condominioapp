const { FinanceiroAvancado, Condominio, Unidade } = require('../models');
const { Op } = require('sequelize');
const { startOfMonth, endOfMonth, format } = require('date-fns');
const logger = require('../config/logger');

// Alterando a forma de exportação para match com as rotas
const registrarMovimentacao = async (req, res) => {
  try {
    const movimentacao = await FinanceiroAvancado.create(req.body);
    res.status(201).json(movimentacao);
  } catch (error) {
    logger.error('Erro ao registrar movimentação:', error);
    res.status(400).json({ erro: error.message });
  }
};

const listarMovimentacoes = async (req, res) => {
  try {
    const { condominioId, inicio, fim } = req.query;
    
    const where = {
      condominioId,
      data_vencimento: {
        [Op.between]: [inicio || startOfMonth(new Date()), fim || endOfMonth(new Date())]
      }
    };

    const movimentacoes = await FinanceiroAvancado.findAll({
      where,
      include: [
        {
          model: Unidade,
          as: 'unidade',
          attributes: ['numero']
        }
      ],
      order: [['data_vencimento', 'DESC']]
    });

    res.json(movimentacoes);
  } catch (error) {
    logger.error('Erro ao listar movimentações:', error);
    res.status(500).json({ erro: error.message });
  }
};

const fluxoCaixa = async (req, res) => {
  try {
    const { condominioId, mes, ano } = req.query;
    const dataInicio = new Date(ano, mes - 1, 1);
    const dataFim = endOfMonth(dataInicio);

    const movimentacoes = await FinanceiroAvancado.findAll({
      where: {
        condominioId,
        data_pagamento: {
          [Op.between]: [dataInicio, dataFim]
        }
      }
    });

    const fluxo = {
      receitas: movimentacoes
        .filter(m => m.tipo === 'receita')
        .reduce((sum, m) => sum + Number(m.valor), 0),
      despesas: movimentacoes
        .filter(m => m.tipo === 'despesa')
        .reduce((sum, m) => sum + Number(m.valor), 0),
      saldo: 0
    };

    fluxo.saldo = fluxo.receitas - fluxo.despesas;

    res.json(fluxo);
  } catch (error) {
    logger.error('Erro ao gerar fluxo de caixa:', error);
    res.status(500).json({ erro: error.message });
  }
};

const inadimplencia = async (req, res) => {
  try {
    const { condominioId } = req.params;
    const hoje = new Date();

    const pendentes = await FinanceiroAvancado.findAll({
      where: {
        condominioId,
        status: 'pendente',
        data_vencimento: {
          [Op.lt]: hoje
        }
      },
      include: [{
        model: Unidade,
        as: 'unidade',
        attributes: ['numero', 'proprietario']
      }]
    });

    const relatorio = {
      total: pendentes.length,
      valorTotal: pendentes.reduce((sum, p) => sum + Number(p.valor), 0),
      unidades: pendentes.map(p => ({
        unidade: p.unidade.numero,
        proprietario: p.unidade.proprietario,
        valor: p.valor,
        vencimento: p.data_vencimento
      }))
    };

    res.json(relatorio);
  } catch (error) {
    logger.error('Erro ao gerar relatório de inadimplência:', error);
    res.status(500).json({ erro: error.message });
  }
};

// Exportando as funções individualmente
module.exports = {
  registrarMovimentacao,
  listarMovimentacoes,
  fluxoCaixa,
  inadimplencia
};