import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/apiResponse';

async function getHistorial(id_vendedor: number, cuenta: string) {
  return prisma.recharge.findMany({
    where: {
      id_vendedor,
      cuenta: { contains: cuenta },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id_vendedor = Number(searchParams.get('id_vendedor'));
    const cuenta = searchParams.get('cuenta') ?? '';

    if (!id_vendedor) {
      return apiError('Faltan campos requeridos.', '01', 400);
    }

    const transacciones = await getHistorial(id_vendedor, cuenta);
    return apiSuccess({ transacciones }, 'Historial de cuenta.');
  } catch (error) {
    console.error('[GET /api/cuenta_vendedor]', error);
    return apiError('Error al obtener historial de cuenta.');
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id_vendedor, cuenta = '', fecha, grupo } = body as {
      id_vendedor: number;
      cuenta: string;
      fecha?: string;
      grupo: string;
    };

    if (!id_vendedor) {
      return apiError('Faltan campos requeridos.', '01', 400);
    }

    const transacciones = await getHistorial(id_vendedor, cuenta);
    return apiSuccess({ transacciones }, 'Historial de cuenta.');
  } catch (error) {
    console.error('[POST /api/cuenta_vendedor]', error);
    return apiError('Error al obtener historial de cuenta.');
  }
}
