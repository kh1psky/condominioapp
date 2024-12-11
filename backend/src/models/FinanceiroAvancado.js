// src/models/FinanceiroAvancado.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class FinanceiroAvancado extends Model {
 static associate(models) {
   FinanceiroAvancado.belongsTo(models.Condominio, {
     foreignKey: 'condominioId',
     as: 'condominio'
   });
   FinanceiroAvancado.belongsTo(models.Unidade, {
     foreignKey: 'unidadeId',
     as: 'unidade'
   });
 }
}

FinanceiroAvancado.init({
 condominioId: {
   type: DataTypes.INTEGER,
   allowNull: false,
   validate: {
     notNull: {
       msg: 'Condomínio é obrigatório'
     }
   }
 },
 unidadeId: {
   type: DataTypes.INTEGER,
   allowNull: true
 },
 tipo: {
   type: DataTypes.ENUM('receita', 'despesa'),
   allowNull: false,
   validate: {
     notNull: {
       msg: 'Tipo é obrigatório'
     },
     isIn: {
       args: [['receita', 'despesa']],
       msg: 'Tipo inválido'
     }
   }
 },
 categoria: {
   type: DataTypes.STRING,
   allowNull: false,
   validate: {
     notEmpty: {
       msg: 'Categoria é obrigatória'
     }
   }
 },
 valor: {
   type: DataTypes.DECIMAL(10, 2),
   allowNull: false,
   validate: {
     notNull: {
       msg: 'Valor é obrigatório'
     },
     isPositive(value) {
       if (value <= 0) {
         throw new Error('Valor deve ser positivo');
       }
     }
   }
 },
 data_vencimento: {
   type: DataTypes.DATEONLY,
   allowNull: false,
   validate: {
     isDate: true,
     notNull: {
       msg: 'Data de vencimento é obrigatória'
     }
   }
 },
 data_pagamento: {
   type: DataTypes.DATEONLY,
   allowNull: true
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
 descricao: DataTypes.TEXT,
 comprovante: DataTypes.STRING,
 recorrente: {
   type: DataTypes.BOOLEAN,
   defaultValue: false
 },
 periodicidade: {
   type: DataTypes.ENUM('mensal', 'trimestral', 'semestral', 'anual'),
   allowNull: true,
   validate: {
     isIn: {
       args: [['mensal', 'trimestral', 'semestral', 'anual']],
       msg: 'Periodicidade inválida'
     }
   }
 }
}, {
 sequelize,
 modelName: 'FinanceiroAvancado',
 tableName: 'financeiro'
});

module.exports = FinanceiroAvancado;