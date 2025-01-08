// src/controllers/notificacaoController.js
const { Notificacao, Usuario, Unidade } = require('../models');
const logger = require('../config/logger');

const notificacaoController = {
  listarNotificacoes: async (req, res) => {
    try {
      logger.info(`Buscando notificações para usuário ID: ${req.usuario.id}`);

      const notificacoes = await Notificacao.findAll({
        where: {
          usuarioId: req.usuario.id
        },
        include: [{
          model: Unidade,
          as: 'unidade',
          attributes: ['numero', 'proprietario']
        }],
        order: [['dataEnvio', 'DESC']]
      });

      logger.info(`Encontradas ${notificacoes.length} notificações`);
      res.json(notificacoes);
    } catch (error) {
      logger.error('Erro ao listar notificações:', {
        erro: error.message,
        stack: error.stack
      });
      res.status(500).json({ 
        erro: 'Erro ao buscar notificações',
        detalhes: error.message 
      });
    }
  },

  enviarNotificacao: async (req, res) => {
    try {
      const { titulo, mensagem, tipo, unidadeId, prioridade } = req.body;

      logger.info('Criando nova notificação:', {
        titulo,
        tipo,
        unidadeId,
        usuarioId: req.usuario.id
      });

      const notificacao = await Notificacao.create({
        titulo,
        mensagem,
        tipo,
        unidadeId,
        usuarioId: req.usuario.id,
        prioridade: prioridade || 'media'
      });

      logger.info(`Notificação criada com ID: ${notificacao.id}`);
      res.status(201).json(notificacao);
    } catch (error) {
      logger.error('Erro ao criar notificação:', {
        erro: error.message,
        stack: error.stack
      });
      res.status(400).json({ erro: error.message });
    }
  },

  marcarComoLida: async (req, res) => {
    try {
      const { id } = req.params;
      logger.info(`Marcando notificação ${id} como lida`);

      const notificacao = await Notificacao.findOne({
        where: { 
          id,
          usuarioId: req.usuario.id
        }
      });

      if (!notificacao) {
        logger.warn(`Notificação ${id} não encontrada`);
        return res.status(404).json({ erro: 'Notificação não encontrada' });
      }

      await notificacao.update({
        lida: true,
        dataLeitura: new Date()
      });

      logger.info(`Notificação ${id} marcada como lida`);
      res.json(notificacao);
    } catch (error) {
      logger.error('Erro ao marcar notificação como lida:', {
        erro: error.message,
        stack: error.stack
      });
      res.status(400).json({ erro: error.message });
    }
  }
};

module.exports = notificacaoController;