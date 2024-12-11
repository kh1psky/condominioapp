// src/models/Usuario.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

class Usuario extends Model {
  async verificarSenha(senha) {
    return bcrypt.compare(senha, this.senha);
  }
}

Usuario.init({
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'O nome é obrigatório' },
      len: {
        args: [3, 100],
        msg: 'O nome deve ter entre 3 e 100 caracteres'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Este email já está em uso'
    },
    validate: {
      isEmail: {
        msg: 'Email inválido'
      },
      notEmpty: {
        msg: 'O email é obrigatório'
      }
    }
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'A senha é obrigatória'
      },
      len: {
        args: [6, 100],
        msg: 'A senha deve ter no mínimo 6 caracteres'
      }
    }
  },
  tipo: {
    type: DataTypes.ENUM('admin', 'usuario'),
    defaultValue: 'usuario',
    validate: {
      isIn: {
        args: [['admin', 'usuario']],
        msg: 'Tipo de usuário inválido'
      }
    }
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  ultimo_login: {
    type: DataTypes.DATE
  }
}, {
  sequelize,
  modelName: 'Usuario',
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.senha) {
        usuario.senha = await bcrypt.hash(usuario.senha, 10);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('senha')) {
        usuario.senha = await bcrypt.hash(usuario.senha, 10);
      }
    }
  }
});

module.exports = Usuario;