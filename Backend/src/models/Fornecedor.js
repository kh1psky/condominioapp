// src/models/Fornecedor.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Fornecedor extends Model {
  static associate(models) {
    Fornecedor.hasMany(models.Contrato, {
      foreignKey: 'fornecedorId',
      as: 'contratos'
    });
    Fornecedor.hasMany(models.Servico, {
      foreignKey: 'fornecedorId',
      as: 'servicos'
    });
  }
}

Fornecedor.init({
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cnpj: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      len: [14, 14]
    }
  },
  telefone: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  endereco: DataTypes.STRING,
  tipo_servico: {
    type: DataTypes.ENUM('manutencao', 'limpeza', 'seguranca', 'outros'),
    allowNull: false
  },
  avaliacao_media: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  observacoes: DataTypes.TEXT,
  contato_nome: DataTypes.STRING,
  contato_telefone: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Fornecedor'
});

module.exports = Fornecedor;