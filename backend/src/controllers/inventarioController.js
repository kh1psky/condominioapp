// src/controllers/inventarioController.js
const { Inventario, ManutencaoInventario } = require('../models');
const logger = require('../config/logger');

const inventarioController = {
  listar: async (req, res) => {
    try {
      const itens = await Inventario.findAll({
        include: ['condominio']
      });
      res.json(itens);
    } catch (error) {
      logger.error('Erro ao listar inventário:', error);
      res.status(500).json({ erro: error.message });
    }
  },

  registrarItem: async (req, res) => {
    try {
      const item = await Inventario.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      logger.error('Erro ao registrar item:', error);
      res.status(400).json({ erro: error.message });
    }
  },

  registrarManutencao: async (req, res) => {
    try {
      const manutencao = await ManutencaoInventario.create(req.body);
      res.status(201).json(manutencao);
    } catch (error) {
      logger.error('Erro ao registrar manutenção:', error);
      res.status(400).json({ erro: error.message });
    }
  }
};

module.exports = inventarioController;