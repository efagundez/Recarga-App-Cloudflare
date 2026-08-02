export const runtime = 'edge';
import prisma from '../../../lib/prisma';
import { apiSuccess, apiError } from '../../../lib/apiResponse';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id_vendedor, grupo } = body;

    if (!id_vendedor || !grupo) {
      return apiError('id_vendedor y grupo son requeridos', '01');
    }

    const user = await prisma.user.findFirst({
      where: { id_vendedor: Number(id_vendedor), grupo },
    });

    if (!user) {
      return apiError('Vendedor no encontrado', '01');
    }

    return apiSuccess({ saldo_actual: user.saldo }, 'Saldo actual.');
  } catch (error: any) {
    return apiError(error.message || 'Error en el servidor', '01');
  }
}

