// src/controllers/manutencaoController.js
const { Manutencao, Unidade, Usuario } = require('../models');
const logger = require('../config/logger');

const manutencaoController = {
  async listar(req, res) {
    try {
      const manutencoes = await Manutencao.findAll({
        include: [
          { model: Unidade, as: 'unidade' },
          { model: Usuario, as: 'responsavel', attributes: ['nome'] }
        ],
        order: [['createdAt', 'DESC']]
      });
      res.json(manutencoes);
    } catch (error) {
      logger.error('Erro ao listar manutenções:', error);
      res.status(500).json({ erro: 'Erro ao listar manutenções' });
    }
  },

  async criar(req, res) {
    try {
      const manutencao = await Manutencao.create({
        ...req.body,
        responsavelId: req.usuario.id
      });
      res.status(201).json(manutencao);
    } catch (error) {
      logger.error('Erro ao criar manutenção:', error);
      res.status(400).json({ erro: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const manutencao = await Manutencao.findByPk(id);
      
      if (!manutencao) {
        return res.status(404).json({ erro: 'Manutenção não encontrada' });
      }

      await manutencao.update(req.body);
      res.json(manutencao);
    } catch (error) {
      logger.error('Erro ao atualizar manutenção:', error);
      res.status(400).json({ erro: error.message });
    }
  },

  async concluir(req, res) {
    try {
      const { id } = req.params;
      const { custo, observacoes } = req.body;
      
      const manutencao = await Manutencao.findByPk(id);
      if (!manutencao) {
        return res.status(404).json({ erro: 'Manutenção não encontrada' });
      }

      await manutencao.update({
        status: 'concluido',
        dataConclusao: new Date(),
        custo,
        observacoes
      });

      res.json(manutencao);
    } catch (error) {
      logger.error('Erro ao concluir manutenção:', error);
      res.status(400).json({ erro: error.message });
    }
  }
};

module.exports = manutencaoController;