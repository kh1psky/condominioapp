// src/models/Condominio.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Condominio extends Model {
  static associate(models) {
    Condominio.belongsTo(models.Usuario, {
      foreignKey: 'administradorId',
      as: 'administrador'
    });
    Condominio.hasMany(models.Unidade, {
      foreignKey: 'condominioId',
      as: 'unidades'
    });
  }
}

Condominio.init({
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'O nome do condomínio é obrigatório' },
      len: {
        args: [3, 100],
        msg: 'O nome deve ter entre 3 e 100 caracteres'
      }
    }
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'O endereço é obrigatório' }
    }
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'A cidade é obrigatória' }
    }
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'O estado é obrigatório' },
      len: {
        args: [2, 2],
        msg: 'O estado deve ter 2 caracteres'
      }
    }
  },
  cep: {
    type: DataTypes.STRING,
    validate: {
      isCEP(value) {
        if (value && !value.match(/^\d{8}$/)) {
          throw new Error('CEP inválido');
        }
      }
    }
  },
  administradorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: 'O administrador é obrigatório' }
    }
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'Condominio',
  hooks: {
    beforeValidate: async (condominio) => {
      if (condominio.cep) {
        condominio.cep = condominio.cep.replace(/\D/g, '');
      }
    }
  }
});

module.exports = Condominio;