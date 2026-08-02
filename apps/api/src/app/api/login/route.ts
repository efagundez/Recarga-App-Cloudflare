export const runtime = 'edge';
import jwt from 'jsonwebtoken';
import prisma from '../../../lib/prisma';
import { apiSuccess, apiError } from '../../../lib/apiResponse';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { grupo, usuario, contrasenia } = body;

    if (!grupo || !usuario || !contrasenia) {
      return apiError('ParÃ¡metros de entrada invÃ¡lidos (grupo, usuario y contrasenia son requeridos)', '01');
    }

    const user = await prisma.user.findFirst({ where: { usuario, grupo } });

    if (!user) {
      return apiError('Usuario o contraseÃ±a incorrectos.', '01');
    }

    if (body.contrasenia !== user.contrasenia) {
      return apiError('Usuario o contraseÃ±a incorrectos.', '01');
    }

    const token = jwt.sign(
      { id_vendedor: user.id_vendedor, usuario: user.usuario, grupo: user.grupo, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    return apiSuccess(
      { token, grupo: user.grupo, vendedor: user.id_vendedor, saldo: user.saldo },
      'Entrada exitosa.'
    );
  } catch (error: any) {
    return apiError(error.message || 'Error en el servidor', '01');
  }
}

