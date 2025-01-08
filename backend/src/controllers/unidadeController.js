const { Unidade, Usuario, Condominio, Pagamento } = require('../models');
const logger = require('../config/logger');

const unidadeController = {
  async listarUnidades(req, res) {
    try {
      const { condominioId } = req.params;
      const where = condominioId ? { condominioId } : {};
      
      const unidades = await Unidade.findAll({
        where,
        include: [
          {
            model: Condominio,
            as: 'condominio',
            attributes: ['id', 'nome']
          }
        ],
        order: [['numero', 'ASC']]
      });
      res.json(unidades);
    } catch (error) {
      logger.error('Erro ao listar unidades:', error);
      res.status(500).json({ error: 'Erro ao listar unidades' });
    }
  },

  async criarUnidade(req, res) {
    try {
      const unidade = await Unidade.create(req.body);
      
      const unidadeCompleta = await Unidade.findByPk(unidade.id, {
        include: [
          {
            model: Condominio,
            as: 'condominio',
            attributes: ['id', 'nome']
          }
        ]
      });
      
      res.status(201).json(unidadeCompleta);
    } catch (error) {
      logger.error('Erro ao criar unidade:', error);
      res.status(500).json({ error: 'Erro ao criar unidade' });
    }
  },

  async atualizarUnidade(req, res) {
    try {
      const { id } = req.params;
      const [updated] = await Unidade.update(req.body, {
        where: { id }
      });
      
      if (!updated) {
        return res.status(404).json({ error: 'Unidade não encontrada' });
      }
      
      const unidade = await Unidade.findByPk(id, {
        include: [
          {
            model: Condominio,
            as: 'condominio',
            attributes: ['id', 'nome']
          }
        ]
      });
      
      res.json(unidade);
    } catch (error) {
      logger.error('Erro ao atualizar unidade:', error);
      res.status(500).json({ error: 'Erro ao atualizar unidade' });
    }
  },

  async deletarUnidade(req, res) {
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
  },

  async getDetalhesUnidade(req, res) {
    try {
      const { id } = req.params;
      const unidade = await Unidade.findByPk(id, {
        include: [
          {
            model: Condominio,
            as: 'condominio',
            attributes: ['id', 'nome']
          },
          {
            model: Pagamento,
            as: 'pagamentos',
            attributes: ['id', 'valor', 'data_pagamento', 'status', 'data_vencimento'],
            limit: 12,
            order: [['data_pagamento', 'DESC']]
          }
        ]
      });

      if (!unidade) {
        return res.status(404).json({ error: 'Unidade não encontrada' });
      }

      // Calcular estatísticas de pagamento
      const pagamentos = unidade.pagamentos || [];
      const estatisticasPagamento = {
        totalPago: pagamentos
          .filter(p => p.status === 'pago')
          .reduce((sum, p) => sum + Number(p.valor), 0),
        pagamentosEmDia: pagamentos
          .filter(p => p.status === 'pago' && new Date(p.data_pagamento) <= new Date(p.data_vencimento))
          .length,
        pagamentosAtrasados: pagamentos
          .filter(p => p.status === 'atrasado' || 
            (p.status === 'pendente' && new Date(p.data_vencimento) < new Date()))
          .length
      };

      // Calcular dias para vencimento do contrato
      const diasParaVencimento = unidade.dataTermino ? 
        Math.ceil((new Date(unidade.dataTermino).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 
        null;

      const detalhes = {
        id: unidade.id,
        numero: unidade.numero,
        bloco: unidade.bloco,
        proprietario: unidade.proprietario,
        contato: unidade.contato,
        cpf: unidade.cpf,
        valorAluguel: unidade.valorAluguel,
        dataInicio: unidade.dataInicio,
        dataTermino: unidade.dataTermino,
        dataVencimento: unidade.dataVencimento,
        statusOcupacao: unidade.statusOcupacao,
        condominio: unidade.condominio,
        historicoPagamentos: pagamentos,
        observacao: unidade.observacao,
        estatisticasPagamento,
        diasParaVencimento
      };

      res.json(detalhes);
    } catch (error) {
      logger.error('Erro ao buscar detalhes da unidade:', error);
      res.status(500).json({ error: 'Erro ao buscar detalhes da unidade' });
    }
  }
};

module.exports = unidadeController;