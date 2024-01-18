import { Request, Response, NextFunction } from 'express';

const notFound = async (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found ${req.originalUrl}`);
  res.status(404);
  next(error);
};



const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode;

  if (err.name === 'ValidationError') {
    // If it's a validation error, you might want to send a 400 Bad Request
    statusCode = 400;
  } else if (err.name === 'UnauthorizedError') {
    // If it's an unauthorized error (e.g., authentication failure), you might want to send a 401 Unauthorized
    statusCode = 401;
  } else if (err.message === 'Username already exists') {
    // Conflict for existing resource
    statusCode = 409;
  } 
  else {
    // For other errors, set a default status code of 500 Internal Server Error
    statusCode = 500;
  }

  res.status(statusCode);
  res.json({ status: 'error', message: err.message });
};

export { notFound, errorHandler };