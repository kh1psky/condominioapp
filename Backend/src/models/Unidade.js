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

// Função para validar CPF
const validarCPF = (cpf) => {
  if (!cpf) return true; // CPF é opcional

  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]/g, '');

  // Valida o tamanho
  if (cpf.length !== 11) return false;

  // Remove CPFs inválidos conhecidos
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Valida primeiro dígito
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  // Valida segundo dígito
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
};

// Função para validar telefone
const validarTelefone = (telefone) => {
  if (!telefone) return true; // Telefone é opcional

  // Remove caracteres não numéricos
  telefone = telefone.replace(/[^\d]/g, '');

  // Valida tamanho
  if (telefone.length !== 10 && telefone.length !== 11) return false;

  // Valida DDD
  const ddd = parseInt(telefone.substring(0, 2));
  if (ddd < 11 || ddd > 99) return false;

  // Se for celular (11 dígitos), valida o 9
  if (telefone.length === 11 && telefone.charAt(2) !== '9') return false;

  return true;
};

// Função para comparar datas ignorando horas
const compararDatas = (data1, data2) => {
  const d1 = new Date(data1);
  const d2 = new Date(data2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  return d1.getTime() - d2.getTime();
};

Unidade.init({
  numero: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'O número da unidade é obrigatório' }
    }
  },
  bloco: {
    type: DataTypes.STRING,
    allowNull: true
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
    allowNull: true,
    validate: {
      isValidTelefone(value) {
        if (value && !validarTelefone(value)) {
          throw new Error('Telefone inválido. Use apenas números com DDD (ex: 11999999999 ou 1155555555)');
        }
      }
    }
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isValidCPF(value) {
        if (value && !validarCPF(value)) {
          throw new Error('CPF inválido. Digite um CPF válido');
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
    },
    get() {
      const rawValue = this.getDataValue('dataInicio');
      if (rawValue) {
        const date = new Date(rawValue);
        return date.toISOString().split('T')[0];
      }
      return null;
    }
  },
  dataTermino: {
    type: DataTypes.DATEONLY,
    validate: {
      isDate: { msg: 'Data de término inválida' },
      isAfterOrEqualDataInicio(value) {
        if (value && this.dataInicio) {
          const diff = compararDatas(value, this.dataInicio);
          if (diff < 0) {
            throw new Error('A data de término não pode ser anterior à data de início');
          }
        }
      }
    },
    get() {
      const rawValue = this.getDataValue('dataTermino');
      if (rawValue) {
        const date = new Date(rawValue);
        return date.toISOString().split('T')[0];
      }
      return null;
    }
  },
  dataVencimento: {
    type: DataTypes.DATEONLY,
    validate: {
      isDate: { msg: 'Data de vencimento inválida' }
    },
    get() {
      const rawValue = this.getDataValue('dataVencimento');
      if (rawValue) {
        const date = new Date(rawValue);
        return date.toISOString().split('T')[0];
      }
      return null;
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
      // Remove caracteres não numéricos do CPF e telefone
      if (unidade.cpf) {
        unidade.cpf = unidade.cpf.replace(/[^\d]/g, '');
      }
      if (unidade.contato) {
        unidade.contato = unidade.contato.replace(/[^\d]/g, '');
      }
    }
  }
});

module.exports = Unidade;