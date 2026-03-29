import { errorResponse } from '../utils/apiResponse.js';

const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json(errorResponse(message, statusCode));
};

export default errorMiddleware;
