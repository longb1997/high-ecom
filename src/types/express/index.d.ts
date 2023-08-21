import express from 'express';
import { Jwt, Secret } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      keyStore?: Jwt.Secret;
      user?: any;
      refreshToken?: string | string[];
    }
  }
}
