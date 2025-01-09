// src/middleware/cache.js
const redis = require('../config/redis');
const logger = require('../config/logger');

const cache = (duration) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      const cachedResponse = await redis.get(key);

      if (cachedResponse) {
        logger.info(`Cache hit: ${key}`);
        return res.json(JSON.parse(cachedResponse));
      }

      // Intercepta o método json para armazenar em cache antes de enviar
      res.sendResponse = res.json;
      res.json = async (body) => {
        try {
          await redis.setex(key, duration, JSON.stringify(body));
          logger.info(`Cache set: ${key}`);
        } catch (error) {
          logger.error('Erro ao definir cache:', error);
        }
        res.sendResponse(body);
      };

      next();
    } catch (error) {
      logger.error('Erro no middleware de cache:', error);
      next();
    }
  };
};

const clearCache = async (pattern) => {
  try {
    const keys = await redis.keys(`cache:${pattern}`);
    if (keys.length) {
      await redis.del(keys);
      logger.info(`Cache limpo: ${pattern}`);
    }
  } catch (error) {
    logger.error('Erro ao limpar cache:', error);
  }
};

module.exports = { cache, clearCache };