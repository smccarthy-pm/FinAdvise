import { SignJWT, jwtVerify } from 'jose';
import { z } from 'zod';

// Environment variable validation with fallback for development
const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'development_secret_key_minimum_32_chars_long';

// Only enforce strict validation in production
const secret = new TextEncoder().encode(
  process.env.NODE_ENV === 'production'
    ? (() => {
        const envCheck = z.object({
          VITE_JWT_SECRET: z.string().min(32)
        }).safeParse({
          VITE_JWT_SECRET: import.meta.env.VITE_JWT_SECRET
        });

        if (!envCheck.success) {
          throw new Error('Production requires a secure JWT secret (min 32 chars)');
        }
        return envCheck.data.VITE_JWT_SECRET;
      })()
    : JWT_SECRET
);

// Token payload validation schema
const tokenPayloadSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  exp: z.number()
});

export async function createToken(payload: z.infer<typeof tokenPayloadSchema>) {
  try {
    const validatedPayload = tokenPayloadSchema.parse(payload);
    return await new SignJWT(validatedPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);
  } catch (error) {
    console.error('Token creation error:', error);
    throw new Error('Failed to create authentication token');
  }
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return tokenPayloadSchema.parse(payload);
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export function setAuthToken(token: string) {
  if (!token || typeof token !== 'string') {
    throw new Error('Invalid token');
  }
  try {
    localStorage.setItem('auth_token', token);
  } catch (error) {
    console.error('Token storage error:', error);
    throw new Error('Failed to store authentication token');
  }
}

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem('auth_token');
  } catch (error) {
    console.error('Token retrieval error:', error);
    return null;
  }
}

export function removeAuthToken() {
  try {
    localStorage.removeItem('auth_token');
  } catch (error) {
    console.error('Token removal error:', error);
    throw new Error('Failed to remove authentication token');
  }
}

export function isAuthenticated(): boolean {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    console.error('Token validation error:', error);
    removeAuthToken();
    return false;
  }
}