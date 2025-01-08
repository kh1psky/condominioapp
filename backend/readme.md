# Sistema de Gerenciamento de Condomínios - Documentação Detalhada

## Estrutura de Arquivos e Funcionalidades

### Config/
```
📁 config/
  ├── database.js
  │   - Configuração do Sequelize com MySQL
  │   - Estabelece conexão com banco de dados
  │   - Define opções como timezone e logging
  │
  ├── redis.js
  │   - Configuração do Redis para cache
  │   - Gerencia tempo de expiração do cache
  │   - Define estratégias de armazenamento
  │
  └── logger.js
      - Configuração do Winston para logs
      - Define níveis e formatos de log
      - Gerencia rotação de arquivos de log
```

### Models/
```
📁 models/
  ├── Usuario.js
  │   - Define esquema de usuários
  │   - Gerencia senhas com bcrypt
  │   - Controla níveis de acesso
  │
  ├── Condominio.js
  │   - Define estrutura dos condomínios
  │   - Relacionamentos com unidades
  │   - Dados cadastrais completos
  │
  ├── Unidade.js
  │   - Gerencia unidades dos condomínios
  │   - Controle de ocupação e pagamentos
  │   - Status e informações do imóvel
  │
  ├── Pagamento.js
  │   - Registra pagamentos de aluguéis
  │   - Controle de vencimentos
  │   - Histórico financeiro
  │
  ├── Fornecedor.js
  │   - Cadastro de prestadores
  │   - Avaliações e histórico
  │   - Documentação e contratos
  │
  ├── Contrato.js
  │   - Gestão de contratos
  │   - Alertas de vencimento
  │   - Renovações automáticas
  │
  ├── Inventario.js
  │   - Controle de equipamentos
  │   - QR codes e localizações
  │   - Manutenções preventivas
  │
  ├── ManutencaoInventario.js
  │   - Registra manutenções
  │   - Histórico de serviços
  │   - Custos e avaliações
  │
  ├── FinanceiroAvancado.js
  │   - Fluxo de caixa
  │   - Previsões financeiras
  │   - Categorização de despesas
  │
  └── Notificacao.js
      - Sistema de alertas
      - Comunicados automáticos
      - Histórico de mensagens
```

### Controllers/
```
📁 controllers/
  ├── usuarioController.js
  │   - Autenticação (login/registro)
  │   - Gestão de perfis
  │   - Recuperação de senha
  │
  ├── condominioController.js
  │   - CRUD de condomínios
  │   - Relatórios gerenciais
  │   - Gestão de unidades
  │
  ├── unidadeController.js
  │   - Gestão de unidades
  │   - Controle de ocupação
  │   - Histórico de moradores
  │
  ├── pagamentoController.js
  │   - Registro de pagamentos
  │   - Controle de inadimplência
  │   - Relatórios financeiros
  │
  ├── fornecedorController.js
  │   - Gestão de fornecedores
  │   - Avaliações
  │   - Histórico de serviços
  │
  ├── contratoController.js
  │   - Gestão de contratos
  │   - Alertas automáticos
  │   - Renovações
  │
  ├── inventarioController.js
  │   - Controle de equipamentos
  │   - Manutenções
  │   - Relatórios de estado
  │
  ├── financeiroAvancadoController.js
  │   - Fluxo de caixa
  │   - Análises financeiras
  │   - Previsões e relatórios
  │
  └── notificacaoController.js
      - Geração de alertas
      - Envio de notificações
      - Histórico de comunicações
```

### Routes/
```
📁 routes/
  ├── usuarioRoutes.js
  │   - POST /login
  │   - POST /register
  │   - GET /perfil
  │   - PUT /atualizar
  │
  ├── condominioRoutes.js
  │   - GET / (listar)
  │   - POST / (criar)
  │   - PUT /:id (atualizar)
  │   - DELETE /:id (remover)
  │
  ├── unidadeRoutes.js
  │   - GET /condominio/:id/unidades
  │   - POST / (criar)
  │   - PUT /:id (atualizar)
  │
  ├── pagamentoRoutes.js
  │   - POST /registrar
  │   - GET /historico
  │   - GET /relatorios
  │
  ├── fornecedorRoutes.js
  │   - CRUD completo
  │   - GET /avaliacoes
  │   - GET /servicos
  │
  ├── contratoRoutes.js
  │   - CRUD de contratos
  │   - GET /vencimentos
  │   - PATCH /renovar
  │
  ├── inventarioRoutes.js
  │   - Gestão de equipamentos
  │   - POST /manutencao
  │   - GET /relatorios
  │
  ├── financeiroAvancadoRoutes.js
  │   - GET /fluxo-caixa
  │   - GET /previsoes
  │   - GET /relatorios
  │
  └── notificacaoRoutes.js
      - GET /pendentes
      - POST /enviar
      - PATCH /ler
```

### Middleware/
```
📁 middleware/
  ├── auth.js
  │   - Verifica JWT
  │   - Valida permissões
  │   - Controle de acesso
  │
  ├── validate.js
  │   - Validação de inputs
  │   - Sanitização de dados
  │   - Regras de negócio
  │
  ├── cache.js
  │   - Gerencia cache Redis
  │   - Estratégias de cache
  │   - Invalidação
  │
  └── errorHandler.js
      - Tratamento de erros
      - Logs estruturados
      - Respostas padronizadas
```

### Utils/
```
📁 utils/
  ├── validators.js
  │   - Funções de validação
  │   - Regras de negócio
  │   - Formatação de dados
  │
  ├── formatters.js
  │   - Formatação de datas
  │   - Valores monetários
  │   - Documentos
  │
  ├── backup.js
  │   - Backup automático
  │   - Agendamento
  │   - Armazenamento
  │
  └── scheduler.js
      - Tarefas agendadas
      - Notificações automáticas
      - Manutenções preventivas
```

## Fluxos de Dados Detalhados

### Pagamento de Aluguel
1. Frontend envia requisição para `/api/pagamentos/registrar`
2. `auth.js` valida token JWT
3. `validate.js` verifica dados do pagamento
4. `pagamentoController.js` processa pagamento
5. Atualiza status no banco
6. Gera notificação automática
7. Atualiza cache Redis
8. Retorna confirmação

### Manutenção de Equipamento
1. Requisição para `/api/inventario/manutencao`
2. Validação de permissões
3. Registro no banco de dados
4. Atualização do status do equipamento
5. Notificação aos responsáveis
6. Agendamento de próxima manutenção
7. Log da operação

## Componentes do Sistema

### Sistema de Cache
- Utiliza Redis para performance
- Cache de consultas frequentes
- Invalidação automática
- Estratégias por rota

### Logging
- Logs por nível de severidade
- Rotação diária de arquivos
- Monitoramento de erros
- Métricas de uso

### Backup
- Backup diário do banco
- Versionamento de arquivos
- Restauração automatizada
- Testes de integridade

### Segurança
- JWT para autenticação
- Bcrypt para senhas
- Rate limiting
- Sanitização de inputs