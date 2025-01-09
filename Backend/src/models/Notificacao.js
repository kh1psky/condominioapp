// src/models/Notificacao.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Notificacao extends Model {
  static associate(models) {
    Notificacao.belongsTo(models.Usuario, {
      foreignKey: 'usuarioId',
      as: 'usuario'
    });
    Notificacao.belongsTo(models.Unidade, {
      foreignKey: 'unidadeId',
      as: 'unidade'
    });
  }
}

Notificacao.init({
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
  mensagem: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'A mensagem é obrigatória' },
      len: {
        args: [5, 1000],
        msg: 'A mensagem deve ter entre 5 e 1000 caracteres'
      }
    }
  },
  tipo: {
    type: DataTypes.ENUM('vencimento', 'pagamento', 'geral', 'alerta'),
    allowNull: false,
    validate: {
      notNull: { msg: 'O tipo é obrigatório' },
      isIn: {
        args: [['vencimento', 'pagamento', 'geral', 'alerta']],
        msg: 'Tipo de notificação inválido'
      }
    }
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: 'O usuário é obrigatório' }
    }
  },
  unidadeId: {
    type: DataTypes.INTEGER,
    // Pode ser null para notificações gerais
  },
  lida: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  dataEnvio: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    validate: {
      isDate: { msg: 'Data de envio inválida' }
    }
  },
  dataLeitura: {
    type: DataTypes.DATE,
    validate: {
      isDate: { msg: 'Data de leitura inválida' },
      isAfterEnvio(value) {
        if (value && new Date(value) < new Date(this.dataEnvio)) {
          throw new Error('A data de leitura não pode ser anterior à data de envio');
        }
      }
    }
  },
  prioridade: {
    type: DataTypes.ENUM('baixa', 'media', 'alta'),
    defaultValue: 'media',
    validate: {
      isIn: {
        args: [['baixa', 'media', 'alta']],
        msg: 'Prioridade inválida'
      }
    }
  }
}, {
  sequelize,
  modelName: 'Notificacao',
  hooks: {
    beforeUpdate: async (notificacao) => {
      if (notificacao.changed('lida') && notificacao.lida) {
        notificacao.dataLeitura = new Date();
      }
    }
  }
});

module.exports = Notificacao;