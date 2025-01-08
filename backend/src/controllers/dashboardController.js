const sequelize = require('../config/database');
const { Condominio, Unidade, Pagamento } = require('../models');
const { Op } = require('sequelize');

const dashboardController = {
  async obterMetricas(req, res) {
    try {
      const metricas = {
        total: {
          condominios: await Condominio.count(),
          unidades: await Unidade.count(),
          unidadesOcupadas: await Unidade.count({ 
            where: { statusOcupacao: true } 
          })
        },
        financeiro: {
          receitaMes: await Pagamento.sum('valor', {
            where: {
              createdAt: {
                [Op.gte]: new Date(new Date().setDate(1))
              },
              status: 'pago'
            }
          }) || 0,
          pagamentosPendentes: await Pagamento.count({
            where: { 
              [Op.or]: [
                { status: 'pendente' },
                { status: 'atrasado' }
              ]
            }
          })
        }
      };

      res.json(metricas);
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      res.status(500).json({ erro: error.message });
    }
  },

  async obterPendencias(req, res) {
    try {
      const pendencias = await Pagamento.findAll({
        where: {
          [Op.or]: [
            { status: 'pendente' },
            { status: 'atrasado' }
          ]
        },
        include: [{
          model: Unidade,
          as: 'unidade',
          required: true
        }],
        attributes: [
          'id',
          'valor',
          'data_vencimento',
          'status',
          'observacao'
        ],
        limit: 5,
        order: [['data_vencimento', 'ASC']]
      });

      res.json({
        pendencias: pendencias.map(p => ({
          id: p.id,
          valor: p.valor,
          dataVencimento: p.data_vencimento,
          status: p.status,
          unidade: p.unidade ? `${p.unidade.bloco}-${p.unidade.numero}` : 'N/A',
          observacao: p.observacao
        }))
      });

    } catch (error) {
      console.error('Erro ao buscar pendências:', error);
      res.status(500).json({ erro: error.message });
    }
  },

  async obterGraficoFinanceiro(req, res) {
    try {
      const mesesAnteriores = 6;
      const dataInicio = new Date();
      dataInicio.setMonth(dataInicio.getMonth() - mesesAnteriores);
      dataInicio.setDate(1);

      const dados = await Pagamento.findAll({
        attributes: [
          [sequelize.fn('YEAR', sequelize.col('data_pagamento')), 'ano'],
          [sequelize.fn('MONTH', sequelize.col('data_pagamento')), 'mes'],
          [sequelize.fn('SUM', sequelize.col('valor')), 'total']
        ],
        where: {
          status: 'pago',
          data_pagamento: {
            [Op.gte]: dataInicio
          }
        },
        group: [
          sequelize.fn('YEAR', sequelize.col('data_pagamento')),
          sequelize.fn('MONTH', sequelize.col('data_pagamento'))
        ],
        order: [
          [sequelize.fn('YEAR', sequelize.col('data_pagamento')), 'ASC'],
          [sequelize.fn('MONTH', sequelize.col('data_pagamento')), 'ASC']
        ],
        raw: true
      });

      const dadosFormatados = dados.map(item => ({
        mes: new Date(item.ano, item.mes - 1).toLocaleDateString('pt-BR', { 
          month: 'long', 
          year: 'numeric' 
        }),
        total: Number(item.total)
      }));

      res.json(dadosFormatados);
    } catch (error) {
      console.error('Erro ao buscar dados do gráfico:', error);
      res.status(500).json({ erro: error.message });
    }
  }
};

module.exports = dashboardController;