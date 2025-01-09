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
     }
   }
 },
 valor_dinheiro: {
   type: DataTypes.DECIMAL(10, 2),
   defaultValue: 0,
   validate: {
     isNonNegative(value) {
       if (value < 0) {
         throw new Error('O valor em dinheiro não pode ser negativo');
       }
     }
   }
 },
 valor_pix: {
   type: DataTypes.DECIMAL(10, 2),
   defaultValue: 0,
   validate: {
     isNonNegative(value) {
       if (value < 0) {
         throw new Error('O valor em PIX não pode ser negativo');
       }
     }
   }
 },
 metodo_pagamento: {
   type: DataTypes.ENUM('dinheiro', 'pix', 'misto'),
   allowNull: false,
   validate: {
     notNull: { msg: 'O método de pagamento é obrigatório' },
     isIn: {
       args: [['dinheiro', 'pix', 'misto']],
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
   allowNull: false,
   validate: {
     isDate: { msg: 'Data de pagamento inválida' }
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
 observacao: {
   type: DataTypes.TEXT,
   allowNull: true
 }
}, {
 sequelize,
 modelName: 'Pagamento',
 tableName: 'pagamentos',
 hooks: {
   beforeValidate: async (pagamento) => {
     // Converter valores para números com precisão de 2 casas decimais
     if (pagamento.valor) {
       pagamento.valor = Number(Number(pagamento.valor).toFixed(2));
     }
     if (pagamento.valor_dinheiro) {
       pagamento.valor_dinheiro = Number(Number(pagamento.valor_dinheiro).toFixed(2));
     }
     if (pagamento.valor_pix) {
       pagamento.valor_pix = Number(Number(pagamento.valor_pix).toFixed(2));
     }

     // Validar valores de acordo com o método de pagamento
     if (pagamento.metodo_pagamento === 'misto') {
       const total = Number(pagamento.valor_dinheiro) + Number(pagamento.valor_pix);
       if (Math.abs(total - Number(pagamento.valor)) > 0.01) {
         throw new Error('A soma dos valores deve ser igual ao valor total');
       }
     } else if (pagamento.metodo_pagamento === 'dinheiro') {
       if (Math.abs(Number(pagamento.valor_dinheiro) - Number(pagamento.valor)) > 0.01 || Number(pagamento.valor_pix) !== 0) {
         throw new Error('Para pagamento em dinheiro, o valor em dinheiro deve ser igual ao total e o valor em PIX deve ser zero');
       }
     } else if (pagamento.metodo_pagamento === 'pix') {
       if (Math.abs(Number(pagamento.valor_pix) - Number(pagamento.valor)) > 0.01 || Number(pagamento.valor_dinheiro) !== 0) {
         throw new Error('Para pagamento em PIX, o valor em PIX deve ser igual ao total e o valor em dinheiro deve ser zero');
       }
     }

     // Se não houver data de pagamento, define como a data atual
     if (!pagamento.data_pagamento) {
       pagamento.data_pagamento = new Date();
     }
   }
 }
});

module.exports = Pagamento;