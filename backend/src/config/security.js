// src/config/security.js
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors'); // Adiciona a importação do cors

const securityConfig = (app) => {
  // Headers de segurança
  app.use(helmet());

  // Proteção contra XSS
  app.use(xss());

  // CORS configuração avançada
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 3600
  }));
};

module.exports = securityConfig;