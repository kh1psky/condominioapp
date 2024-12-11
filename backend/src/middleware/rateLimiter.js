// src/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // aumentar de 5 para 20 tentativas
  message: 'Muitas tentativas de login, tente novamente em 15 minutos'
});

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 1000, // aumentar para 1000 requisições por hora
  message: 'Limite de requisições excedido. Tente novamente em uma hora.'
});

module.exports = { loginLimiter, apiLimiter };