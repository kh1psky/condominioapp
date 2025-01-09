// src/controllers/documentoController.js
const { Documento, Unidade } = require('../models');
const logger = require('../config/logger');
const path = require('path');
const fs = require('fs').promises;

const documentoController = {
  async listar(req, res) {
    try {
      const documentos = await Documento.findAll({
        include: [{ model: Unidade, as: 'unidade' }]
      });
      res.json(documentos);
    } catch (error) {
      logger.error('Erro ao listar documentos:', error);
      res.status(500).json({ erro: error.message });
    }
  },

  async upload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ erro: 'Nenhum arquivo enviado' });
      }

      const documento = await Documento.create({
        nome: req.file.originalname,
        tipo: path.extname(req.file.originalname),
        caminho: req.file.path,
        unidadeId: req.body.unidadeId,
        observacao: req.body.observacao
      });

      res.status(201).json(documento);
    } catch (error) {
      logger.error('Erro no upload:', error);
      res.status(400).json({ erro: error.message });
    }
  },

  async excluir(req, res) {
    try {
      const documento = await Documento.findByPk(req.params.id);
      
      if (!documento) {
        return res.status(404).json({ erro: 'Documento não encontrado' });
      }

      await fs.unlink(documento.caminho);
      await documento.destroy();
      
      res.json({ mensagem: 'Documento excluído com sucesso' });
    } catch (error) {
      logger.error('Erro ao excluir documento:', error);
      res.status(500).json({ erro: error.message });
    }
  }
};

module.exports = documentoController;