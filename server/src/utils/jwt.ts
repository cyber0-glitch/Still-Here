import jwt from 'jsonwebtoken';

function requireEnvSecret(name: string, fallback: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === 'production') {
    throw new Error(`${name} environment variable is required in production`);
  }
  return value || fallback;
}

const JWT_SECRET = requireEnvSecret('JWT_SECRET', 'dev-secret');
const JWT_REFRESH_SECRET = requireEnvSecret('JWT_REFRESH_SECRET', 'dev-refresh-secret');

export interface TokenPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
}
