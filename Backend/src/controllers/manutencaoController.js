// src/controllers/manutencaoController.js
const { Manutencao, Unidade, Usuario } = require('../models');
const logger = require('../config/logger');

const manutencaoController = {
  async listar(req, res) {
    try {
      const manutencoes = await Manutencao.findAll({
        include: [
          {
            model: Unidade,
            as: 'unidade',
            attributes: ['id', 'numero', 'bloco'],
          },
          {
            model: Usuario,
            as: 'responsavel',
            attributes: ['id', 'nome'],
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      res.json(manutencoes);
    } catch (error) {
      logger.error('Erro ao listar manutenções:', error);
      res.status(500).json({ message: 'Erro ao listar manutenções' });
    }
  },

  async criar(req, res) {
    try {
      const {
        titulo,
        tipo,
        descricao,
        prioridade,
        unidadeId,
        dataPrevista,
        observacoes
      } = req.body;

      const manutencao = await Manutencao.create({
        titulo,
        tipo,
        descricao,
        prioridade,
        unidadeId,
        dataPrevista,
        responsavelId: req.usuario.id, // ID do usuário logado
        status: 'aberta',
        dataAbertura: new Date(),
        observacoes
      });

      const manutencaoCompleta = await Manutencao.findByPk(manutencao.id, {
        include: [
          {
            model: Unidade,
            as: 'unidade',
            attributes: ['id', 'numero', 'bloco'],
          },
          {
            model: Usuario,
            as: 'responsavel',
            attributes: ['id', 'nome'],
          }
        ]
      });

      res.status(201).json(manutencaoCompleta);
    } catch (error) {
      logger.error('Erro ao criar manutenção:', error);
      res.status(400).json({ message: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const manutencao = await Manutencao.findByPk(id);

      if (!manutencao) {
        return res.status(404).json({ message: 'Manutenção não encontrada' });
      }

      await manutencao.update(req.body);

      const manutencaoAtualizada = await Manutencao.findByPk(id, {
        include: [
          {
            model: Unidade,
            as: 'unidade',
            attributes: ['id', 'numero', 'bloco'],
          },
          {
            model: Usuario,
            as: 'responsavel',
            attributes: ['id', 'nome'],
          }
        ]
      });

      res.json(manutencaoAtualizada);
    } catch (error) {
      logger.error('Erro ao atualizar manutenção:', error);
      res.status(400).json({ message: error.message });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const manutencao = await Manutencao.findByPk(id, {
        include: [
          {
            model: Unidade,
            as: 'unidade',
            attributes: ['id', 'numero', 'bloco'],
          },
          {
            model: Usuario,
            as: 'responsavel',
            attributes: ['id', 'nome'],
          }
        ]
      });

      if (!manutencao) {
        return res.status(404).json({ message: 'Manutenção não encontrada' });
      }

      res.json(manutencao);
    } catch (error) {
      logger.error('Erro ao buscar manutenção:', error);
      res.status(500).json({ message: 'Erro ao buscar manutenção' });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const manutencao = await Manutencao.findByPk(id);

      if (!manutencao) {
        return res.status(404).json({ message: 'Manutenção não encontrada' });
      }

      await manutencao.destroy();
      res.status(204).send();
    } catch (error) {
      logger.error('Erro ao deletar manutenção:', error);
      res.status(500).json({ message: 'Erro ao deletar manutenção' });
    }
  },

  async concluir(req, res) {
    try {
      const { id } = req.params;
      const { custo, observacoes } = req.body;
      
      const manutencao = await Manutencao.findByPk(id);
      if (!manutencao) {
        return res.status(404).json({ message: 'Manutenção não encontrada' });
      }

      await manutencao.update({
        status: 'concluida',
        dataConclusao: new Date(),
        custo,
        observacoes: observacoes || manutencao.observacoes
      });

      const manutencaoAtualizada = await Manutencao.findByPk(id, {
        include: [
          {
            model: Unidade,
            as: 'unidade',
            attributes: ['id', 'numero', 'bloco'],
          },
          {
            model: Usuario,
            as: 'responsavel',
            attributes: ['id', 'nome'],
          }
        ]
      });

      res.json(manutencaoAtualizada);
    } catch (error) {
      logger.error('Erro ao concluir manutenção:', error);
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = manutencaoController;