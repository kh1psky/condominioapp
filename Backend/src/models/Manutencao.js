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
  status: {
    type: DataTypes.ENUM('aberta', 'em_andamento', 'concluida', 'cancelada'),
    allowNull: false,
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
    defaultValue: 'media',
    validate: {
      isIn: {
        args: [['baixa', 'media', 'alta', 'urgente']],
        msg: 'Prioridade inválida'
      }
    }
  },
  unidadeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: 'A unidade é obrigatória' }
    },
    references: {
      model: 'unidades',
      key: 'id'
    }
  },
  responsavelId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: 'O responsável é obrigatório' }
    },
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  dataAbertura: {
    type: DataTypes.DATE,
    allowNull: false,
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
      isAfterNow(value) {
        if (new Date(value) < new Date()) {
          throw new Error('A data prevista deve ser futura');
        }
      }
    }
  },
  dataConclusao: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isDate: { msg: 'Data de conclusão inválida' },
      isAfterAbertura(value) {
        if (value && new Date(value) < new Date(this.dataAbertura)) {
          throw new Error('A data de conclusão não pode ser anterior à data de abertura');
        }
      }
    }
  },
  custo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      isNonNegative(value) {
        if (value && value < 0) {
          throw new Error('O custo não pode ser negativo');
        }
      }
    }
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Manutencao',
  tableName: 'manutencoes',
  hooks: {
    beforeUpdate: async (manutencao) => {
      if (manutencao.changed('status') && manutencao.status === 'concluida' && !manutencao.dataConclusao) {
        manutencao.dataConclusao = new Date();
      }
    }
  }
});

module.exports = Manutencao;