
// src/controllers/financeiroAvancadoController.js
const { FinanceiroAvancado, Condominio } = require('../models');
const { Op } = require('sequelize');
const logger = require('../config/logger');

const financeiroAvancadoController = {
 async registrarMovimentacao(req, res) {
   try {
     const movimentacao = await FinanceiroAvancado.create(req.body);
     res.status(201).json(movimentacao);
   } catch (error) {
     logger.error('Erro ao registrar movimentação:', error);
     res.status(400).json({ erro: error.message });
   }
 },

 async fluxoCaixa(req, res) {
   try {
     const { dataInicio, dataFim, condominioId } = req.query;
     
     const movimentacoes = await FinanceiroAvancado.findAll({
       where: {
         condominioId,
         data_efetiva: {
           [Op.between]: [dataInicio, dataFim]
         }
       }
     });

     const fluxo = {
       receitas: movimentacoes.filter(m => m.tipo === 'receita')
         .reduce((sum, m) => sum + Number(m.valor), 0),
       despesas: movimentacoes.filter(m => m.tipo === 'despesa')
         .reduce((sum, m) => sum + Number(m.valor), 0),
       saldo: 0
     };

     fluxo.saldo = fluxo.receitas - fluxo.despesas;

     res.json(fluxo);
   } catch (error) {
     logger.error('Erro ao gerar fluxo de caixa:', error);
     res.status(500).json({ erro: error.message });
   }
 },

 async previsao(req, res) {
   try {
     const { condominioId } = req.params;
     const dataAtual = new Date();
     const dataLimite = new Date();
     dataLimite.setMonth(dataLimite.getMonth() + 3);

     const previsoes = await FinanceiroAvancado.findAll({
       where: {
         condominioId,
         data_prevista: {
           [Op.between]: [dataAtual, dataLimite]
         }
       }
     });

     res.json(previsoes);
   } catch (error) {
     logger.error('Erro ao gerar previsão:', error);
     res.status(500).json({ erro: error.message });
   }
 }
};

module.exports = financeiroAvancadoController;