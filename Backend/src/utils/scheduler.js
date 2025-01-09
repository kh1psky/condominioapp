// src/utils/scheduler.js
const cron = require('node-cron');
const { createBackup } = require('./backup');
const logger = require('../config/logger');

// Agenda backup diário às 3h da manhã
cron.schedule('0 3 * * *', async () => {
  try {
    logger.info('Iniciando backup agendado');
    await createBackup();
    logger.info('Backup agendado concluído com sucesso');
  } catch (error) {
    logger.error('Erro no backup agendado:', error);
  }
});

// Verificar e limpar cache antigo à meia-noite
cron.schedule('0 0 * * *', async () => {
  try {
    const redis = require('../config/redis');
    const keys = await redis.keys('cache:*');
    if (keys.length > 0) {
      await redis.del(keys);
      logger.info(`Cache limpo: ${keys.length} chaves removidas`);
    }
  } catch (error) {
    logger.error('Erro ao limpar cache:', error);
  }
});