import { Request, Response, NextFunction } from 'express';
import { RouteError } from '../errors/RouteError';

export const globalErrorHandler = (
  error: Error,
  request: Request,
  response: Response,
  _: NextFunction,
) => {
  if (error instanceof RouteError)
    response
      .status(error.statusCode)
      .json({ status: 'error', message: error.message });

  console.error(error);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};
