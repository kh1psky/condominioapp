// __tests__/unit/models/Usuario.test.js
const { Usuario } = require('../../../src/models');
const bcrypt = require('bcrypt');

describe('Usuario Model', () => {
  beforeEach(async () => {
    await Usuario.destroy({ where: {} });
  });

  it('deve criar um usuário com senha hash', async () => {
    const usuario = await Usuario.create({
      nome: 'Teste',
      email: 'teste@teste.com',
      senha: '123456',
      tipo: 'usuario'
    });

    expect(usuario.email).toBe('teste@teste.com');
    expect(usuario.senha).not.toBe('123456');
    expect(await bcrypt.compare('123456', usuario.senha)).toBe(true);
  });

  it('não deve criar usuário com email duplicado', async () => {
    await Usuario.create({
      nome: 'Teste 1',
      email: 'teste@teste.com',
      senha: '123456'
    });

    await expect(
      Usuario.create({
        nome: 'Teste 2',
        email: 'teste@teste.com',
        senha: '123456'
      })
    ).rejects.toThrow();
  });

  it('deve validar senha corretamente', async () => {
    const usuario = await Usuario.create({
      nome: 'Teste',
      email: 'teste@teste.com',
      senha: '123456'
    });

    expect(await usuario.verificarSenha('123456')).toBe(true);
    expect(await usuario.verificarSenha('senha-errada')).toBe(false);
  });
});