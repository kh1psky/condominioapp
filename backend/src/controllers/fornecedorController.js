// src/controllers/fornecedorController.js
const { Fornecedor, Contrato } = require('../models');
const logger = require('../config/logger');

const fornecedorController = {
 async listar(req, res) {
   try {
     const fornecedores = await Fornecedor.findAll({
       where: { ativo: true },
       include: ['contratos']
     });
     res.json(fornecedores);
   } catch (error) {
     logger.error('Erro ao listar fornecedores:', error);
     res.status(500).json({ erro: error.message });
   }
 },

 async criar(req, res) {
   try {
     const fornecedor = await Fornecedor.create(req.body);
     res.status(201).json(fornecedor);
   } catch (error) {
     logger.error('Erro ao criar fornecedor:', error);
     res.status(400).json({ erro: error.message });
   }
 },

 async atualizar(req, res) {
   try {
     const { id } = req.params;
     const fornecedor = await Fornecedor.findByPk(id);
     
     if (!fornecedor) {
       return res.status(404).json({ erro: 'Fornecedor não encontrado' });
     }

     await fornecedor.update(req.body);
     res.json(fornecedor);
   } catch (error) {
     logger.error('Erro ao atualizar fornecedor:', error);
     res.status(400).json({ erro: error.message });
   }
 },

 async excluir(req, res) {
   try {
     const { id } = req.params;
     const fornecedor = await Fornecedor.findByPk(id);
     
     if (!fornecedor) {
       return res.status(404).json({ erro: 'Fornecedor não encontrado' });
     }

     await fornecedor.update({ ativo: false });
     res.json({ mensagem: 'Fornecedor excluído com sucesso' });
   } catch (error) {
     logger.error('Erro ao excluir fornecedor:', error);
     res.status(500).json({ erro: error.message });
   }
 }
};

module.exports = fornecedorController;