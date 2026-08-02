export const runtime = 'edge';
import prisma from '../../../lib/prisma';
import { apiSuccess, apiError } from '../../../lib/apiResponse';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nro_transaccion, grupo } = body;

    if (!nro_transaccion || !grupo) {
      return apiError('nro_transaccion y grupo son requeridos', '01');
    }

    const tx = await prisma.recharge.findFirst({
      where: { nro_transaccion: Number(nro_transaccion) },
    });

    if (!tx) {
      return apiError('TransacciÃ³n no encontrada', '01');
    }

    return apiSuccess({ transaccion: tx }, 'Detalle de la transacciÃ³n.');
  } catch (error: any) {
    return apiError(error.message || 'Error en el servidor', '01');
  }
}

