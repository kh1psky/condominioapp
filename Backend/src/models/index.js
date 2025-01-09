// src/models/index.js
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Condominio = require('./Condominio');
const Unidade = require('./Unidade');
const Pagamento = require('./Pagamento');
const Notificacao = require('./Notificacao');
const FinanceiroAvancado = require('./FinanceiroAvancado');
const Manutencao = require('./Manutencao');

// Primeiro, criar o objeto models para ser usado nas associações
const models = {
    Usuario,
    Condominio,
    Unidade,
    Pagamento,
    Notificacao,
    FinanceiroAvancado,
    Manutencao
};

// Associações
Usuario.hasMany(Condominio, {
    foreignKey: 'administradorId',
    as: 'condominios'
});

Condominio.belongsTo(Usuario, {
    foreignKey: 'administradorId',
    as: 'administrador'
});

Condominio.hasMany(Unidade, {
    foreignKey: 'condominioId',
    as: 'unidades'
});

Unidade.belongsTo(Condominio, {
    foreignKey: 'condominioId',
    as: 'condominio'
});

Unidade.hasMany(Pagamento, {
    foreignKey: 'unidadeId',
    as: 'pagamentos'
});

Pagamento.belongsTo(Unidade, {
    foreignKey: 'unidadeId',
    as: 'unidade'
});

Usuario.hasMany(Notificacao, {
    foreignKey: 'usuarioId',
    as: 'notificacoes'
});

Notificacao.belongsTo(Usuario, {
    foreignKey: 'usuarioId',
    as: 'usuario'
});

Unidade.hasMany(Notificacao, {
    foreignKey: 'unidadeId',
    as: 'notificacoes'
});

Notificacao.belongsTo(Unidade, {
    foreignKey: 'unidadeId',
    as: 'unidade'
});

// Associações do FinanceiroAvancado
FinanceiroAvancado.belongsTo(Condominio, {
    foreignKey: 'condominioId',
    as: 'condominio'
});

FinanceiroAvancado.belongsTo(Unidade, {
    foreignKey: 'unidadeId',
    as: 'unidade'
});

// Associações da Manutenção
Unidade.hasMany(Manutencao, {
    foreignKey: 'unidadeId',
    as: 'manutencoes'
});

Manutencao.belongsTo(Unidade, {
    foreignKey: 'unidadeId',
    as: 'unidade'
});

Usuario.hasMany(Manutencao, {
    foreignKey: 'responsavelId',
    as: 'manutencoes_responsavel'
});

Manutencao.belongsTo(Usuario, {
    foreignKey: 'responsavelId',
    as: 'responsavel'
});

// Exportando todos os modelos e o sequelize
module.exports = {
    sequelize,
    ...models
};