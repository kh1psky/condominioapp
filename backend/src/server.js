// src/server.js
const express = require('express');
const cors = require('cors');
const { apiLimiter, loginLimiter } = require('./middleware/rateLimiter');
const securityConfig = require('./config/security');
const { sequelize } = require('./models');

// Importação das rotas existentes
const usuarioRoutes = require('./routes/usuarioRoutes');
const condominioRoutes = require('./routes/condominioRoutes');
const unidadeRoutes = require('./routes/unidadeRoutes');
const pagamentoRoutes = require('./routes/pagamentoRoutes');
const inventarioRoutes = require('./routes/inventarioRoutes');

const app = express();

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurações de segurança
securityConfig(app);

// Rate limiting global
app.use('/api/', apiLimiter);

// Rate limiting específico para login
app.use('/api/usuarios/login', loginLimiter);

// Rotas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/condominios', condominioRoutes);
app.use('/api/unidades', unidadeRoutes);
app.use('/api/pagamentos', pagamentoRoutes);
app.use('/api/inventario', inventarioRoutes);

// Rota de teste/saúde
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Handler de erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Inicialização do servidor
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com banco de dados estabelecida.');
    
    await sequelize.sync({ force: true }); // Em produção, use { force: false }
    console.log('Modelos sincronizados com o banco de dados.');

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;