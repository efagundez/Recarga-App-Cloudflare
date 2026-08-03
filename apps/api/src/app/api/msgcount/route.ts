import { NextRequest } from 'next/server';
import prisma from '../../../lib/prisma';
import { apiSuccess, apiError } from '../../../lib/apiResponse';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id_vendedor, grupo } = body as { id_vendedor: number; grupo: string };

    if (!id_vendedor) {
      return apiError('Faltan campos requeridos.', '01', 400);
    }

    const conteo = await prisma.mensaje.count({
      where: { id_vendedor, leido: false },
    });

    return apiSuccess({ conteo }, 'Mensajes no leÃ­dos.');
  } catch (error) {
    console.error('[POST /api/msgcount]', error);
    return apiError('Error al obtener conteo de mensajes.');
  }
}


