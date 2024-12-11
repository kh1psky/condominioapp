// src/models/ManutencaoInventario.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class ManutencaoInventario extends Model {
  static associate(models) {
    ManutencaoInventario.belongsTo(models.Inventario, {
      foreignKey: 'inventarioId',
      as: 'item'
    });
  }
}

ManutencaoInventario.init({
  inventarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('preventiva', 'corretiva'),
    allowNull: false
  },
  descricao: DataTypes.TEXT,
  data_manutencao: DataTypes.DATE,
  custo: DataTypes.DECIMAL(10, 2),
  responsavel: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM('agendada', 'em_andamento', 'concluida', 'cancelada'),
    defaultValue: 'agendada'
  }
}, {
  sequelize,
  modelName: 'ManutencaoInventario'
});

module.exports = ManutencaoInventario;