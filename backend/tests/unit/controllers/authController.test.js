const usuarioController = require('../../../src/controllers/usuarioController');
const { Usuario } = require('../../../src/models');
const bcrypt = require('bcrypt');

describe('Auth Controller', () => {
  jest.setTimeout(30000);
  describe('Login', () => {
    it('deve autenticar com credenciais válidas', async () => {
      const senha = '123456';
      const hash = await bcrypt.hash(senha, 10);

      const mockUsuario = {
        id: 1,
        email: 'teste@teste.com',
        senha: hash,
        tipo: 'usuario',
        toJSON: () => ({
          id: 1,
          email: 'teste@teste.com',
          tipo: 'usuario'
        })
      };

      Usuario.findOne = jest.fn().mockResolvedValue(mockUsuario);

      const req = {
        body: { email: 'teste@teste.com', senha: '123456' }
      };

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await usuarioController.login(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          usuario: expect.any(Object),
          token: expect.any(String)
        })
      );
    });

    it('deve rejeitar credenciais inválidas', async () => {
      const senha = '123456';
      const hash = await bcrypt.hash(senha, 10);

      const mockUsuario = {
        id: 1,
        email: 'teste@teste.com',
        senha: hash,
        toJSON: () => ({
          id: 1,
          email: 'teste@teste.com'
        })
      };

      Usuario.findOne = jest.fn().mockResolvedValue(mockUsuario);

      const req = {
        body: { email: 'teste@teste.com', senha: 'senha-errada' }
      };

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await usuarioController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(String)
        })
      );
    });
  });
});