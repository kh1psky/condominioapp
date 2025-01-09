// src/utils/backup.js
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../config/logger');

const backupDir = path.join(__dirname, '../../backups');

const createBackup = async () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `backup-${timestamp}.sql`;
  const filepath = path.join(backupDir, filename);

  const command = `mysqldump -u${process.env.DB_USER} -p${process.env.DB_PASS} ${process.env.DB_NAME} > ${filepath}`;

  try {
    // Garante que o diretório de backup existe
    await fs.mkdir(backupDir, { recursive: true });

    // Executa o backup
    await new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) reject(error);
        else resolve(stdout);
      });
    });

    logger.info(`Backup criado com sucesso: ${filename}`);

    // Remove backups antigos (mais de 7 dias)
    const files = await fs.readdir(backupDir);
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 dias

    for (const file of files) {
      const filePath = path.join(backupDir, file);
      const stats = await fs.stat(filePath);
      if (now - stats.mtime.getTime() > maxAge) {
        await fs.unlink(filePath);
        logger.info(`Backup antigo removido: ${file}`);
      }
    }

    return filepath;
  } catch (error) {
    logger.error('Erro ao criar backup:', error);
    throw error;
  }
};

module.exports = { createBackup };