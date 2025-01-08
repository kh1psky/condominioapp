// src/controllers/relatoriosController.js
const { Pagamento, Unidade, Condominio, Manutencao } = require('../models');
const { Op } = require('sequelize');
const { startOfMonth, endOfMonth, format } = require('date-fns');

const relatoriosController = {
  async relatorioFinanceiro(req, res) {
    try {
      const { dataInicio, dataFim, condominioId } = req.query;
      const where = {
        data_pagamento: {
          [Op.between]: [dataInicio, dataFim]
        }
      };

      if (condominioId) {
        where['$unidade.condominioId$'] = condominioId;
      }

      const pagamentos = await Pagamento.findAll({
        where,
        include: [{
          model: Unidade,
          as: 'unidade',
          include: [{ model: Condominio, as: 'condominio' }]
        }]
      });

      const relatorio = {
        totalRecebido: pagamentos.reduce((sum, p) => sum + Number(p.valor), 0),
        quantidadePagamentos: pagamentos.length,
        porCondominio: {},
        porStatus: {
          pago: pagamentos.filter(p => p.status === 'pago').length,
          pendente: pagamentos.filter(p => p.status === 'pendente').length,
          atrasado: pagamentos.filter(p => p.status === 'atrasado').length
        }
      };

      res.json(relatorio);
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  },

  async relatorioOcupacao(req, res) {
    try {
      const { condominioId } = req.query;
      const where = condominioId ? { condominioId } : {};

      const unidades = await Unidade.findAll({ where });
      const relatorio = {
        total: unidades.length,
        ocupadas: unidades.filter(u => u.statusOcupacao).length,
        disponiveis: unidades.filter(u => !u.statusOcupacao).length,
        percentualOcupacao: 0
      };

      relatorio.percentualOcupacao = (relatorio.ocupadas / relatorio.total) * 100;

      res.json(relatorio);
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  },

  async relatorioManutencoes(req, res) {
    try {
      const { dataInicio, dataFim, status } = req.query;
      const where = {};

      if (dataInicio && dataFim) {
        where.createdAt = { [Op.between]: [dataInicio, dataFim] };
      }
      if (status) {
        where.status = status;
      }

      const manutencoes = await Manutencao.findAll({
        where,
        include: [{
          model: Unidade,
          as: 'unidade'
        }]
      });

      const relatorio = {
        total: manutencoes.length,
        porStatus: {
          pendente: manutencoes.filter(m => m.status === 'pendente').length,
          em_andamento: manutencoes.filter(m => m.status === 'em_andamento').length,
          concluido: manutencoes.filter(m => m.status === 'concluido').length
        },
        custoTotal: manutencoes.reduce((sum, m) => sum + (m.custo || 0), 0)
      };

      res.json(relatorio);
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }
};

module.exports = relatoriosController;