// src/models/Pagamento.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Pagamento extends Model {
  static associate(models) {
    Pagamento.belongsTo(models.Unidade, {
      foreignKey: 'unidadeId',
      as: 'unidade'
    });
  }
}

Pagamento.init({
  unidadeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: 'A unidade é obrigatória' }
    }
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notNull: { msg: 'O valor é obrigatório' },
      isPositive(value) {
        if (value <= 0) {
          throw new Error('O valor deve ser maior que zero');
        }
      },
      async isValidValue(value) {
        const unidade = await this.getUnidade();
        if (unidade && parseFloat(value) !== parseFloat(unidade.valorAluguel)) {
          throw new Error('O valor do pagamento deve ser igual ao valor do aluguel');
        }
      }
    }
  },
  metodo_pagamento: {
    type: DataTypes.ENUM('dinheiro', 'pix', 'cartao', 'transferencia'),
    allowNull: false,
    validate: {
      notNull: { msg: 'O método de pagamento é obrigatório' },
      isIn: {
        args: [['dinheiro', 'pix', 'cartao', 'transferencia']],
        msg: 'Método de pagamento inválido'
      }
    }
  },
  data_vencimento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: { msg: 'Data de vencimento inválida' }
    }
  },
  data_pagamento: {
    type: DataTypes.DATEONLY,
    validate: {
      isDate: { msg: 'Data de pagamento inválida' },
      isNotAfterToday(value) {
        if (value && new Date(value) > new Date()) {
          throw new Error('A data de pagamento não pode ser futura');
        }
      }
    }
  },
  status: {
    type: DataTypes.ENUM('pendente', 'pago', 'atrasado', 'cancelado'),
    defaultValue: 'pendente',
    validate: {
      isIn: {
        args: [['pendente', 'pago', 'atrasado', 'cancelado']],
        msg: 'Status inválido'
      }
    }
  },
  comprovante: DataTypes.STRING,
  observacao: DataTypes.TEXT
}, {
  sequelize,
  modelName: 'Pagamento',
  hooks: {
    beforeValidate: async (pagamento) => {
      // Atualiza o status baseado na data de vencimento
      if (pagamento.data_vencimento && !pagamento.data_pagamento) {
        const hoje = new Date();
        const vencimento = new Date(pagamento.data_vencimento);
        if (vencimento < hoje) {
          pagamento.status = 'atrasado';
        }
      }
    }
  }
});

module.exports = Pagamento;