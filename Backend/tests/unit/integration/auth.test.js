const request = require('supertest');
const path = require('path');
const app = require(path.resolve(__dirname, '../../../src/app'));
const { Usuario } = require('../../../src/models');
const bcrypt = require('bcrypt');

describe('Rotas de Autenticação', () => {
  jest.setTimeout(30000);
  beforeEach(async () => {
    await Usuario.destroy({ where: {} });
  });

  it('deve registrar um novo usuário', async () => {
    const response = await request(app)
      .post('/api/usuarios/registrar')
      .send({
        nome: 'Teste',
        email: 'teste@teste.com',
        senha: '123456',
        tipo: 'usuario'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('deve fazer login com sucesso', async () => {
    // Primeiro cria o usuário com senha hasheada
    const senha = '123456';
    const hash = await bcrypt.hash(senha, 10);
    
    await Usuario.create({
      nome: 'Teste',
      email: 'teste@teste.com',
      senha: hash,
      tipo: 'usuario'
    });

    const response = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: 'teste@teste.com',
        senha: senha
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});