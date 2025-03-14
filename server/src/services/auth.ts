import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  _id: string;
  username: string;
  email: string;
}

export const authenticateToken = (token: string | null) => {
  if (!token) return null;

  try {
    const secretKey = process.env.JWT_SECRET_KEY || '';
    return jwt.verify(token, secretKey) as JwtPayload;
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
};

export const signToken = (username: string, email: string, _id: string) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
