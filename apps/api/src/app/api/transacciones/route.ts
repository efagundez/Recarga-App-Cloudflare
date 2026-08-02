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

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const transactions = await prisma.recharge.findMany({
      where: {
        id_vendedor: Number(id_vendedor),
        createdAt: { gte: startOfDay },
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiSuccess({ transacciones: transactions }, 'Transacciones realizadas hoy.');
  } catch (error: any) {
    return apiError(error.message || 'Error en el servidor', '01');
  }
}

