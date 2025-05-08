import { Request, Response, NextFunction } from 'express';
const { secret, expiresIn } = require('../config/jwtConfig');
const jwt = require('jsonwebtoken');

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}
export default authMiddleware;
