// src/models/Manutencao.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Manutencao extends Model {
  static associate(models) {
    Manutencao.belongsTo(models.Unidade, {
      foreignKey: 'unidadeId',
      as: 'unidade'
    });
    Manutencao.belongsTo(models.Usuario, {
      foreignKey: 'responsavelId',
      as: 'responsavel'
    });
  }
}

Manutencao.init({
  unidadeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: 'A unidade é obrigatória' }
    }
  },
  tipo: {
    type: DataTypes.ENUM('preventiva', 'corretiva', 'emergencial'),
    allowNull: false,
    validate: {
      notNull: { msg: 'O tipo é obrigatório' },
      isIn: {
        args: [['preventiva', 'corretiva', 'emergencial']],
        msg: 'Tipo de manutenção inválido'
      }
    }
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'O título é obrigatório' },
      len: {
        args: [3, 100],
        msg: 'O título deve ter entre 3 e 100 caracteres'
      }
    }
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'A descrição é obrigatória' },
      len: {
        args: [10, 1000],
        msg: 'A descrição deve ter entre 10 e 1000 caracteres'
      }
    }
  },
  dataAbertura: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    validate: {
      isDate: { msg: 'Data de abertura inválida' }
    }
  },
  dataPrevista: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: { msg: 'Data prevista inválida' },
      isAfterAbertura(value) {
        if (value && new Date(value) < new Date(this.dataAbertura)) {
          throw new Error('A data prevista não pode ser anterior à data de abertura');
        }
      }
    }
  },
  dataConclusao: {
    type: DataTypes.DATE,
    validate: {
      isDate: { msg: 'Data de conclusão inválida' },
      isAfterAbertura(value) {
        if (value && new Date(value) < new Date(this.dataAbertura)) {
          throw new Error('A data de conclusão não pode ser anterior à data de abertura');
        }
      }
    }
  },
  status: {
    type: DataTypes.ENUM('aberta', 'em_andamento', 'concluida', 'cancelada'),
    defaultValue: 'aberta',
    validate: {
      isIn: {
        args: [['aberta', 'em_andamento', 'concluida', 'cancelada']],
        msg: 'Status inválido'
      }
    }
  },
  prioridade: {
    type: DataTypes.ENUM('baixa', 'media', 'alta', 'urgente'),
    allowNull: false,
    validate: {
      notNull: { msg: 'A prioridade é obrigatória' },
      isIn: {
        args: [['baixa', 'media', 'alta', 'urgente']],
        msg: 'Prioridade inválida'
      }
    }
  },
  responsavelId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: 'O responsável é obrigatório' }
    }
  },
  custo: {
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      isPositive(value) {
        if (value && value <= 0) {
          throw new Error('O custo deve ser maior que zero');
        }
      }
    }
  },
  observacoes: {
    type: DataTypes.TEXT
  }
}, {
  sequelize,
  modelName: 'Manutencao',
  hooks: {
    beforeUpdate: async (manutencao) => {
      if (manutencao.changed('status')) {
        if (manutencao.status === 'concluida' && !manutencao.dataConclusao) {
          manutencao.dataConclusao = new Date();
        }
      }
    }
  }
});

module.exports = Manutencao;