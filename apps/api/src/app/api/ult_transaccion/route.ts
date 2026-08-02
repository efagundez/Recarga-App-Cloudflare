export const runtime = 'edge';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/apiResponse';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id_vendedor, grupo } = body;

    if (!id_vendedor || !grupo) {
      return apiError('id_vendedor y grupo son requeridos', '01');
    }

    const lastTx = await prisma.recharge.findFirst({
      where: { id_vendedor: Number(id_vendedor) },
      orderBy: { createdAt: 'desc' },
    });

    if (!lastTx) {
      return apiError('No se encontraron transacciones para este vendedor', '01');
    }

    return apiSuccess(lastTx, 'Ãšltima transacciÃ³n realizada.');
  } catch (error: any) {
    return apiError(error.message || 'Error en el servidor', '01');
  }
}
