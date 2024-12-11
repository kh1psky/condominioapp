const { Condominio } = require('../models');
const logger = require('../config/logger');

const listarCondominios = async (req, res) => {
  try {
    const condominios = await Condominio.findAll();
    res.json(condominios);
  } catch (error) {
    logger.error('Erro ao listar condominios:', error);
    res.status(500).json({ error: 'Erro ao listar condominios' });
  }
};

const criarCondominio = async (req, res) => {
  try {
    const condominio = await Condominio.create({
      ...req.body,
      administradorId: req.usuario.id // Usando o ID do usuário autenticado
    });
    res.status(201).json(condominio);
  } catch (error) {
    logger.error('Erro ao criar condominio:', error);
    res.status(500).json({ error: 'Erro ao criar condominio' });
  }
};

const obterCondominio = async (req, res) => {
  try {
    const condominio = await Condominio.findByPk(req.params.id);
    if (!condominio) {
      return res.status(404).json({ error: 'Condominio não encontrado' });
    }
    res.json(condominio);
  } catch (error) {
    logger.error('Erro ao obter condominio:', error);
    res.status(500).json({ error: 'Erro ao obter condominio' });
  }
};

const atualizarCondominio = async (req, res) => {
  try {
    const [updated] = await Condominio.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ error: 'Condominio não encontrado' });
    }
    const condominio = await Condominio.findByPk(req.params.id);
    res.json(condominio);
  } catch (error) {
    logger.error('Erro ao atualizar condominio:', error);
    res.status(500).json({ error: 'Erro ao atualizar condominio' });
  }
};

const deletarCondominio = async (req, res) => {
  try {
    const deleted = await Condominio.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Condominio não encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    logger.error('Erro ao deletar condominio:', error);
    res.status(500).json({ error: 'Erro ao deletar condominio' });
  }
};

module.exports = {
  listarCondominios,
  obterCondominio,
  criarCondominio,
  atualizarCondominio,
  deletarCondominio
};