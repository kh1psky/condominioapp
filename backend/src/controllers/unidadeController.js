const { Unidade, Usuario } = require('../models');
const logger = require('../config/logger');

const listarUnidades = async (req, res) => {
  try {
    const { condominioId } = req.params;
    const unidades = await Unidade.findAll({
      where: { condominioId },
      include: [{
        model: Usuario,
        as: 'morador',
        attributes: ['id', 'nome', 'email']
      }]
    });
    res.json(unidades);
  } catch (error) {
    logger.error('Erro ao listar unidades:', error);
    res.status(500).json({ error: 'Erro ao listar unidades' });
  }
};

const criarUnidade = async (req, res) => {
  try {
    const { condominioId } = req.params;
    const unidade = await Unidade.create({
      ...req.body,
      condominioId
    });
    res.status(201).json(unidade);
  } catch (error) {
    logger.error('Erro ao criar unidade:', error);
    res.status(500).json({ error: 'Erro ao criar unidade' });
  }
};

const atualizarUnidade = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Unidade.update(req.body, {
      where: { id }
    });
    if (!updated) {
      return res.status(404).json({ error: 'Unidade não encontrada' });
    }
    const unidade = await Unidade.findByPk(id);
    res.json(unidade);
  } catch (error) {
    logger.error('Erro ao atualizar unidade:', error);
    res.status(500).json({ error: 'Erro ao atualizar unidade' });
  }
};

const deletarUnidade = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Unidade.destroy({
      where: { id }
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Unidade não encontrada' });
    }
    res.status(204).send();
  } catch (error) {
    logger.error('Erro ao deletar unidade:', error);
    res.status(500).json({ error: 'Erro ao deletar unidade' });
  }
};

module.exports = {
  listarUnidades,
  criarUnidade,
  atualizarUnidade,
  deletarUnidade
};