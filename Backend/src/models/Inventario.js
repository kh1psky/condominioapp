// src/models/Inventario.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Inventario extends Model {
 static associate(models) {
   Inventario.belongsTo(models.Condominio, {
     foreignKey: 'condominioId',
     as: 'condominio'
   });
 }
}

Inventario.init({
 condominioId: {
   type: DataTypes.INTEGER,
   allowNull: false
 },
 nome: {
   type: DataTypes.STRING,
   allowNull: false
 },
 descricao: DataTypes.TEXT,
 categoria: DataTypes.STRING,
 numero_serie: DataTypes.STRING,
 data_aquisicao: DataTypes.DATE,
 valor_aquisicao: DataTypes.DECIMAL(10, 2),
 localizacao: DataTypes.STRING,
 status: {
   type: DataTypes.ENUM('ativo', 'manutencao', 'inativo', 'descartado'),
   defaultValue: 'ativo'
 },
 qr_code: DataTypes.STRING,
 ultima_manutencao: DataTypes.DATE,
 proxima_manutencao: DataTypes.DATE,
 fornecedor: DataTypes.STRING,
 garantia_termino: DataTypes.DATE
}, {
 sequelize,
 modelName: 'Inventario'
});

module.exports = Inventario;