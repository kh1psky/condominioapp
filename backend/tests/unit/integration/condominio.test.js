const request = require('supertest');
const path = require('path');
const app = require(path.resolve(__dirname, '../../../src/app'));
const { Usuario, Condominio } = require('../../../src/models');
const bcrypt = require('bcrypt');

describe('Rotas de Condomínio', () => {
  jest.setTimeout(30000);
  let token;
  let adminUser;

  beforeEach(async () => {
    await Usuario.destroy({ where: {} });
    await Condominio.destroy({ where: {} });

    // Criar usuário admin
    adminUser = await Usuario.create({
      nome: 'Admin',
      email: 'admin@test.com',
      senha: await bcrypt.hash('123456', 10),
      tipo: 'admin'
    });

    const response = await request(app)
      .post('/api/usuarios/login')
      .send({
        email: 'admin@test.com',
        senha: '123456'
      });

    token = response.body.token;
  });

  it('deve criar um novo condomínio', async () => {
    const response = await request(app)
      .post('/api/condominios')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Condomínio Teste',
        endereco: 'Rua Teste, 123',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '12345678',
        administradorId: adminUser.id  // Adicionando o ID do administrador
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.nome).toBe('Condomínio Teste');
  });

  it('deve listar condomínios', async () => {
    await Condominio.create({
      nome: 'Condomínio Teste',
      endereco: 'Rua Teste, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '12345678',
      administradorId: adminUser.id  // Adicionando o ID do administrador
    });

    const response = await request(app)
      .get('/api/condominios')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });
});