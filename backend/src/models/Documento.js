// src/models/Documento.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Documento extends Model {
  static associate(models) {
    Documento.belongsTo(models.Unidade, {
      foreignKey: 'unidadeId',
      as: 'unidade'
    });
  }
}

Documento.init({
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  caminho: {
    type: DataTypes.STRING,
    allowNull: false
  },
  unidadeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  observacao: DataTypes.TEXT
}, {
  sequelize,
  modelName: 'Documento'
});

module.exports = Documento;