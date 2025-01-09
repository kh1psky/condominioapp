// src/controllers/contratoController.js
const { Contrato, Fornecedor } = require('../models');
const { addDays } = require('date-fns');
const logger = require('../config/logger');

const contratoController = {
 async listar(req, res) {
   try {
     const contratos = await Contrato.findAll({
       include: [{
         model: Fornecedor,
         as: 'fornecedor'
       }]
     });
     res.json(contratos);
   } catch (error) {
     logger.error('Erro ao listar contratos:', error);
     res.status(500).json({ erro: error.message });
   }
 },

 async criar(req, res) {
   try {
     const contrato = await Contrato.create(req.body);
     res.status(201).json(contrato);
   } catch (error) {
     logger.error('Erro ao criar contrato:', error);
     res.status(400).json({ erro: error.message });
   }
 },

 async atualizar(req, res) {
   try {
     const { id } = req.params;
     const contrato = await Contrato.findByPk(id);
     
     if (!contrato) {
       return res.status(404).json({ erro: 'Contrato não encontrado' });
     }

     await contrato.update(req.body);
     res.json(contrato);
   } catch (error) {
     logger.error('Erro ao atualizar contrato:', error);
     res.status(400).json({ erro: error.message });
   }
 },

 async verificarVencimentos() {
   try {
     const dataLimite = addDays(new Date(), 30);
     
     const contratosVencendo = await Contrato.findAll({
       where: {
         data_fim: {
           [Op.lte]: dataLimite
         },
         status: 'ativo'
       },
       include: ['fornecedor']
     });

     // Lógica de notificação pode ser adicionada aqui
     
     return contratosVencendo;
   } catch (error) {
     logger.error('Erro ao verificar vencimentos:', error);
     throw error;
   }
 }
};

module.exports = contratoController;