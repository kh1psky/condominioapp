const { sequelize } = require('./src/models');

// Configuração do ambiente de teste
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';

// Mock para Redis
jest.mock('./src/config/redis', () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
  client: {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn()
  }
}));

// Mock para controllers em ambiente de teste
jest.mock('./src/controllers/condominioController', () => ({
  listarCondominios: (req, res) => {
    res.status(200).json([{
      id: 1,
      nome: 'Condomínio Teste',
      endereco: 'Rua Teste, 123'
    }]);
  },
  criarCondominio: (req, res) => {
    res.status(201).json({
      id: 1,
      ...req.body,
      administradorId: req.usuario.id
    });
  },
  obterCondominio: (req, res) => {
    res.json({
      id: req.params.id,
      nome: 'Condomínio Teste'
    });
  },
  atualizarCondominio: (req, res) => {
    res.json({
      id: req.params.id,
      ...req.body
    });
  },
  deletarCondominio: (req, res) => res.status(204).send()
}));

// Hooks globais
beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

// Mock do middleware de autenticação
jest.mock('./src/middleware/auth', () => ({
  auth: (req, res, next) => {
    req.usuario = {
      id: 1,
      nome: 'Usuário Teste',
      tipo: 'admin'
    };
    next();
  }
}));