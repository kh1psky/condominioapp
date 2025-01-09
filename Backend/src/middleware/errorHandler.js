// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Erro de validação',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }
  
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: err.message 
  });
};

module.exports = errorHandler;