// src/config/redis.js
const Redis = require('ioredis');
const logger = require('./logger');

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
};

const redis = new Redis(redisConfig);

redis.on('error', (error) => {
  logger.error('Erro na conexão com Redis:', error);
});

redis.on('connect', () => {
  logger.info('Conectado ao Redis');
});

module.exports = redis;