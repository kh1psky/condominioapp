// src/models/Contrato.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Contrato extends Model {
  static associate(models) {
    Contrato.belongsTo(models.Fornecedor, {
      foreignKey: 'fornecedorId',
      as: 'fornecedor'
    });
    Contrato.belongsTo(models.Condominio, {
      foreignKey: 'condominioId',
      as: 'condominio'
    });
  }
}

Contrato.init({
  fornecedorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  condominioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  numero_contrato: {
    type: DataTypes.STRING,
    unique: true
  },
  data_inicio: {
    type: DataTypes.DATE,
    allowNull: false
  },
  data_fim: {
    type: DataTypes.DATE,
    allowNull: false
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  descricao_servico: DataTypes.TEXT,
  status: {
    type: DataTypes.ENUM('ativo', 'pendente', 'encerrado', 'cancelado'),
    defaultValue: 'pendente'
  },
  forma_pagamento: DataTypes.STRING,
  periodicidade_pagamento: {
    type: DataTypes.ENUM('mensal', 'trimestral', 'semestral', 'anual'),
    defaultValue: 'mensal'
  },
  documentos: DataTypes.JSON,
  renovacao_automatica: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  alertas_vencimento: {
    type: DataTypes.INTEGER, // dias antes
    defaultValue: 30
  }
}, {
  sequelize,
  modelName: 'Contrato'
});

module.exports = Contrato;