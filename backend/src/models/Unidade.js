// src/models/Unidade.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Unidade extends Model {
  static associate(models) {
    Unidade.belongsTo(models.Condominio, {
      foreignKey: 'condominioId',
      as: 'condominio'
    });
    Unidade.hasMany(models.Pagamento, {
      foreignKey: 'unidadeId',
      as: 'pagamentos'
    });
  }
}

Unidade.init({
  numero: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'O número da unidade é obrigatório' }
    }
  },
  condominioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: 'O condomínio é obrigatório' }
    }
  },
  proprietario: {
    type: DataTypes.STRING,
    validate: {
      len: {
        args: [3, 100],
        msg: 'O nome do proprietário deve ter entre 3 e 100 caracteres'
      }
    }
  },
  contato: {
    type: DataTypes.STRING,
    validate: {
      isTelefone(value) {
        if (value && !value.match(/^\d{10,11}$/)) {
          throw new Error('Telefone inválido');
        }
      }
    }
  },
  cpf: {
    type: DataTypes.STRING,
    validate: {
      isCPF(value) {
        if (value && !value.match(/^\d{11}$/)) {
          throw new Error('CPF inválido');
        }
      }
    }
  },
  valorAluguel: {
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      isPositive(value) {
        if (value <= 0) {
          throw new Error('O valor do aluguel deve ser maior que zero');
        }
      }
    }
  },
  dataInicio: {
    type: DataTypes.DATEONLY,
    validate: {
      isDate: { msg: 'Data de início inválida' }
    }
  },
  dataTermino: {
    type: DataTypes.DATEONLY,
    validate: {
      isDate: { msg: 'Data de término inválida' },
      isAfterDataInicio(value) {
        if (value && this.dataInicio && new Date(value) <= new Date(this.dataInicio)) {
          throw new Error('A data de término deve ser posterior à data de início');
        }
      }
    }
  },
  dataVencimento: {
    type: DataTypes.DATEONLY,
    validate: {
      isDate: { msg: 'Data de vencimento inválida' }
    }
  },
  numeroMedidor: DataTypes.STRING,
  observacao: DataTypes.TEXT,
  statusOcupacao: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'Unidade',
  hooks: {
    beforeValidate: async (unidade) => {
      // Remove caracteres não numéricos do CPF
      if (unidade.cpf) {
        unidade.cpf = unidade.cpf.replace(/\D/g, '');
      }
      // Remove caracteres não numéricos do telefone
      if (unidade.contato) {
        unidade.contato = unidade.contato.replace(/\D/g, '');
      }
    }
  }
});

module.exports = Unidade;