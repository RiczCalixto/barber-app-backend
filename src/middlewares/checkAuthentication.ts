import { Request, Response, NextFunction, request, response } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';

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

  if (!authorization) throw new Error('JWT is missing');

  const [, token] = authorization.split(' ');

  try {
    const decodedAuth = verify(token, authConfig.jwt.tokenSecret);

    const { sub } = decodedAuth as TokenPayload;

    req.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new Error('Invalid JWT');
  }
};
