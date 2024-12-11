// src/controllers/dashboardController.js
const sequelize = require('../config/database');
const { Condominio, Unidade, Pagamento } = require('../models');
const { Op } = require('sequelize');

const dashboardController = {
  async getMetricas(req, res) {
    try {
      const metricas = {
        total: {
          condominios: await Condominio.count(),
          unidades: await Unidade.count(),
          unidadesOcupadas: await Unidade.count({ where: { statusOcupacao: true } })
        },
        financeiro: {
          receitaMes: await Pagamento.sum('valor', {
            where: {
              createdAt: {
                [Op.gte]: new Date(new Date().setDate(1))
              }
            }
          }) || 0,
          pagamentosPendentes: await Pagamento.count({
            where: { status: 'pendente' }
          })
        }
      };

      res.json(metricas);
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      res.status(500).json({ erro: 'Erro ao buscar métricas' });
    }
  },

  async getPendencias(req, res) {
    try {
      const pendencias = await Pagamento.findAll({
        where: { status: 'pendente' },
        include: [{
          model: Unidade,
          as: 'unidade',
          include: [{ model: Condominio, as: 'condominio' }]
        }],
        limit: 5,
        order: [['dataVencimento', 'ASC']]
      });

      res.json(pendencias);
    } catch (error) {
      console.error('Erro ao buscar pendências:', error);
      res.status(500).json({ erro: 'Erro ao buscar pendências' });
    }
  },

  async getGraficoFinanceiro(req, res) {
    try {
      const data = await Pagamento.findAll({
        attributes: [
          [sequelize.fn('MONTH', sequelize.col('createdAt')), 'mes'],
          [sequelize.fn('SUM', sequelize.col('valor')), 'valor']
        ],
        where: {
          createdAt: {
            [Op.gte]: new Date(new Date().getFullYear(), 0, 1)
          }
        },
        group: [sequelize.fn('MONTH', sequelize.col('createdAt'))],
        order: [[sequelize.fn('MONTH', sequelize.col('createdAt')), 'ASC']]
      });

      res.json(data);
    } catch (error) {
      console.error('Erro ao buscar dados do gráfico:', error);
      res.status(500).json({ erro: 'Erro ao buscar dados do gráfico' });
    }
  }
};

module.exports = dashboardController;