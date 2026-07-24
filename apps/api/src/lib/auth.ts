import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'secret-temporario';

export interface AuthUser {
  id?: string;
  id_vendedor?: number;
  usuario?: string;
  grupo?: string;
  role: string;
}

export async function verifyAuth(request: Request): Promise<AuthUser | null> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded.id || decoded._id,
      id_vendedor: decoded.id_vendedor,
      usuario: decoded.usuario,
      grupo: decoded.grupo,
      role: decoded.role || 'VENDEDOR'
    };
  } catch (error) {
    return null;
  }
}

export function signToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      id_vendedor: user.id_vendedor,
      usuario: user.usuario,
      grupo: user.grupo,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
}
