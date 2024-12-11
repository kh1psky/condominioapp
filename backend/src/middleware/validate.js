// src/middleware/validate.js
const { validationResult } = require('express-validator');
const yup = require('yup');

// Middleware para validações do express-validator
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      erro: 'Erro de validação',
      detalhes: errors.array() 
    });
  }
  next();
};

// Schemas de validação com Yup
const schemas = {
  usuario: {
    nome: yup.string().required('Nome é obrigatório'),
    email: yup.string().email('Email inválido').required('Email é obrigatório'),
    senha: yup.string().required('Senha é obrigatória').min(6, 'Senha deve ter no mínimo 6 caracteres'),
    tipo: yup.string().oneOf(['admin', 'usuario'])
  },
  login: {
    email: yup.string().email('Email inválido').required('Email é obrigatório'),
    senha: yup.string().required('Senha é obrigatória')
  },

  // Condomínio
  condominio: yup.object().shape({
    nome: yup.string().required('Nome é obrigatório'),
    endereco: yup.string().required('Endereço é obrigatório'),
    cidade: yup.string().required('Cidade é obrigatória'),
    estado: yup.string().required('Estado é obrigatório').length(2, 'Estado deve ter 2 caracteres'),
    cep: yup.string().required('CEP é obrigatório').matches(/^\d{8}$/, 'CEP inválido')
  }),

  // Unidade
  unidade: yup.object().shape({
    numero: yup.string().required('Número é obrigatório'),
    condominioId: yup.number().required('Condomínio é obrigatório'),
    valorAluguel: yup.number().positive('Valor deve ser positivo'),
    statusOcupacao: yup.boolean(),
    dataVencimento: yup.date().nullable()
  }),

  // Pagamento
  pagamento: yup.object().shape({
    unidadeId: yup.number().required('Unidade é obrigatória'),
    valor: yup.number().required('Valor é obrigatório').positive('Valor deve ser positivo'),
    metodo_pagamento: yup.string().required('Método de pagamento é obrigatório')
      .oneOf(['dinheiro', 'pix', 'cartao'], 'Método de pagamento inválido'),
    data_pagamento: yup.date().default(() => new Date())
  }),

  // Financeiro
  movimentacao: yup.object().shape({
    condominioId: yup.number().required('Condomínio é obrigatório'),
    tipo: yup.string().required('Tipo é obrigatório').oneOf(['receita', 'despesa'], 'Tipo inválido'),
    valor: yup.number().required('Valor é obrigatório').positive('Valor deve ser positivo'),
    categoria: yup.string().required('Categoria é obrigatória'),
    data_vencimento: yup.date().required('Data de vencimento é obrigatória')
  })
};

// Middleware de validação Yup
const validateSchema = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return res.status(400).json({
      erro: 'Erro de validação',
      detalhes: error.errors
    });
  }
};

module.exports = {
  validate,
  validateSchema,
  schemas
};