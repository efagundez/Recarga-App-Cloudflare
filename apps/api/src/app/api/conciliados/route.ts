import { NextRequest } from 'next/server';
import prisma from '../../../lib/prisma';
import { apiSuccess, apiError } from '../../../lib/apiResponse';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { grupo } = body as { grupo: string };

    const conciliados = await prisma.deposito.findMany({
      where: { estado: 'Conciliado' },
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    return apiSuccess({ conciliados }, 'DepÃ³sitos conciliados.');
  } catch (error) {
    console.error('[POST /api/conciliados]', error);
    return apiError('Error al obtener depÃ³sitos conciliados.');
  }
}


