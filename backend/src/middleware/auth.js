// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');  // Corrigido para usar destructuring

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ erro: 'Token não fornecido' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findOne({ where: { id: decoded.id } });

    if (!usuario) {
      throw new Error();
    }

    req.token = token;
    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(401).json({ erro: 'Por favor, faça login novamente.' });
  }
};

module.exports = { auth };  // Exportando como objeto