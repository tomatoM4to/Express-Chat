const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;

  switch (status) {
    case 400:
      res.status(status).json({ error: 'ErrorHandler - Bad Request', message: err.message });
      break;
    case 401:
      res.status(status).json({ error: 'ErrorHandler - Unauthorized', message: err.message });
      break;
    case 403:
      res.status(status).json({ error: 'ErrorHandler - Forbidden', message: err.message });
      break;
    case 404:
      res.status(status).json({ error: 'ErrorHandler - Not Found', message: err.message });
      break;
    default:
      res.status(status).json({ error: 'ErrorHandler - Internal Server Error', message: err.message });
      break;
  }
};

module.exports = errorHandler;