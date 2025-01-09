// src/controllers/pagamentoController.js
const { Pagamento, Unidade } = require('../models');
const logger = require('../config/logger');

const calcularProximoVencimento = (dataAtual) => {
  // Garantir que estamos trabalhando com uma string de data no formato YYYY-MM-DD
  const [anoAtual, mesAtual, diaAtual] = dataAtual.split('-').map(Number);
  
  // Calcular próximo mês e ano
  let proximoMes = mesAtual;
  let proximoAno = anoAtual;

  // Ajustar para o próximo mês
  if (proximoMes === 12) {
    proximoMes = 1;
    proximoAno += 1;
  } else {
    proximoMes += 1;
  }

  // Formatar com zero à esquerda quando necessário
  const mesFormatado = proximoMes.toString().padStart(2, '0');
  const diaFormatado = diaAtual.toString().padStart(2, '0');

  // Montar a data no formato YYYY-MM-DD
  const proximaData = `${proximoAno}-${mesFormatado}-${diaFormatado}`;

  // Log para debug
  logger.info(`Calculando próximo vencimento:
    Data atual: ${dataAtual}
    Dia: ${diaAtual}
    Mês atual: ${mesAtual}
    Próximo mês: ${proximoMes}
    Próximo ano: ${proximoAno}
    Nova data: ${proximaData}
  `);

  return proximaData;
};

const pagamentoController = {
  async criarPagamento(req, res) {
    try {
      const {
        unidadeId,
        valor_total,
        valor_dinheiro,
        valor_pix,
        metodo_pagamento,
        observacao
      } = req.body;

      // Buscar a unidade
      const unidade = await Unidade.findByPk(unidadeId);
      if (!unidade) {
        return res.status(404).json({ error: 'Unidade não encontrada' });
      }

      // Verificar se a unidade está ocupada
      if (!unidade.statusOcupacao) {
        return res.status(400).json({ error: 'Não é possível registrar pagamento para uma unidade desocupada' });
      }

      // Calcular próximo vencimento
      const proximoVencimento = calcularProximoVencimento(unidade.dataVencimento);

      // Criar o pagamento
      const pagamento = await Pagamento.create({
        unidadeId,
        valor: valor_total,
        valor_dinheiro: metodo_pagamento === 'pix' ? 0 : valor_dinheiro,
        valor_pix: metodo_pagamento === 'dinheiro' ? 0 : valor_pix,
        metodo_pagamento,
        status: 'pago',
        data_pagamento: new Date().toISOString().split('T')[0], // Formata a data atual
        data_vencimento: unidade.dataVencimento,
        observacao
      });

      // Atualizar a data de vencimento da unidade
      await unidade.update({
        dataVencimento: proximoVencimento
      });

      const pagamentoCompleto = await Pagamento.findByPk(pagamento.id, {
        include: [{
          model: Unidade,
          as: 'unidade',
          attributes: ['id', 'numero', 'bloco', 'valorAluguel', 'dataVencimento']
        }]
      });

      res.status(201).json(pagamentoCompleto);
    } catch (error) {
      logger.error('Erro ao criar pagamento:', error);
      res.status(500).json({ error: error.message || 'Erro ao criar pagamento' });
    }
  },

  async listarPagamentos(req, res) {
    try {
      const { unidadeId } = req.params;
      const where = unidadeId ? { unidadeId } : {};

      const pagamentos = await Pagamento.findAll({
        where,
        include: [{
          model: Unidade,
          as: 'unidade',
          attributes: ['id', 'numero', 'bloco', 'valorAluguel', 'dataVencimento']
        }],
        order: [['data_pagamento', 'DESC']]
      });

      res.json(pagamentos);
    } catch (error) {
      logger.error('Erro ao listar pagamentos:', error);
      res.status(500).json({ error: 'Erro ao listar pagamentos' });
    }
  },

  async getPagamento(req, res) {
    try {
      const { id } = req.params;
      const pagamento = await Pagamento.findByPk(id, {
        include: [{
          model: Unidade,
          as: 'unidade',
          attributes: ['id', 'numero', 'bloco', 'valorAluguel', 'dataVencimento']
        }]
      });

      if (!pagamento) {
        return res.status(404).json({ error: 'Pagamento não encontrado' });
      }

      res.json(pagamento);
    } catch (error) {
      logger.error('Erro ao buscar pagamento:', error);
      res.status(500).json({ error: 'Erro ao buscar pagamento' });
    }
  }
};

module.exports = pagamentoController;