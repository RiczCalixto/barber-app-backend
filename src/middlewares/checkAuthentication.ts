import { Request, Response, NextFunction, request, response } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';
import { RouteError } from '../errors/RouteError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export const checkAuthentication = (
  req: Request,
  resp: Response,
  next: NextFunction,
): void => {
  const { authorization } = req.headers;

  if (!authorization) throw new RouteError('JWT is missing', 401);

  const [, token] = authorization.split(' ');

  try {
    const decodedAuth = verify(token, authConfig.jwt.tokenSecret);

    const { sub } = decodedAuth as TokenPayload;

    req.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new RouteError('Invalid JWT', 401);
  }
};
