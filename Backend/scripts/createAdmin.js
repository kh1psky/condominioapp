// scripts/createAdmin.js
const { sequelize } = require('../src/models');
const Usuario = require('../src/models/Usuario');

async function criarAdmin() {
  try {
    await sequelize.sync();

    const admin = await Usuario.create({
      nome: 'Administrador',
      email: 'admin@admin.com',
      senha: '123456',
      tipo: 'admin'
    });

    console.log('Usuário admin criado com sucesso:', admin.toJSON());
  } catch (error) {
    console.error('Erro ao criar admin:', error);
  } finally {
    await sequelize.close();
  }
}

criarAdmin();