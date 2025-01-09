const { Usuario } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const registrar = async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;
    
    // Verifica se usuário já existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Cria o usuário
    const usuario = await Usuario.create({
      nome,
      email,
      senha: await bcrypt.hash(senha, 10),
      tipo
    });

    // Remove a senha do retorno
    const { senha: _, ...usuarioSemSenha } = usuario.toJSON();
    
    res.status(201).json(usuarioSemSenha);
  } catch (error) {
    logger.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

const login = async (req, res) => {
  try {
    console.log('Dados recebidos:', req.body);
    const { email, senha } = req.body;

    // Busca o usuário
    const usuario = await Usuario.findOne({ where: { email } });
    console.log('Usuário encontrado:', usuario ? 'Sim' : 'Não');
    
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verifica a senha
    console.log('Senha recebida:', senha);
    console.log('Hash armazenado:', usuario.senha);
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    console.log('Senha válida:', senhaValida ? 'Sim' : 'Não');

    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gera o token
    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login bem sucedido para:', email);

    // Remove a senha do retorno
    const { senha: _, ...usuarioSemSenha } = usuario.toJSON();

    res.json({
      usuario: usuarioSemSenha,
      token
    });
  } catch (error) {
    logger.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

const obterPerfil = async (req, res) => {
  try {
    const usuario = req.usuario;
    const { senha: _, ...usuarioSemSenha } = usuario.toJSON();
    res.json(usuarioSemSenha);
  } catch (error) {
    logger.error('Erro ao obter perfil:', error);
    res.status(500).json({ error: 'Erro ao obter perfil' });
  }
};

const atualizarPerfil = async (req, res) => {
  try {
    const usuario = req.usuario;
    const { nome, email, senhaAtual, novaSenha } = req.body;

    if (senhaAtual && novaSenha) {
      const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ error: 'Senha atual incorreta' });
      }
      usuario.senha = await bcrypt.hash(novaSenha, 10);
    }

    if (nome) usuario.nome = nome;
    if (email) usuario.email = email;

    await usuario.save();

    const { senha: _, ...usuarioSemSenha } = usuario.toJSON();
    res.json(usuarioSemSenha);
  } catch (error) {
    logger.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
};

const logout = async (req, res) => {
  try {
    // Implemente a lógica de logout se necessário
    // Por exemplo, invalidar o token no Redis
    res.json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    logger.error('Erro ao fazer logout:', error);
    res.status(500).json({ error: 'Erro ao fazer logout' });
  }
};

module.exports = {
  registrar,
  login,
  obterPerfil,
  atualizarPerfil,
  logout
};