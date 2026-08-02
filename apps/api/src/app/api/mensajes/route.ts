export const runtime = 'edge';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/apiResponse';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id_vendedor, grupo } = body as { id_vendedor: number; grupo: string };

    if (!id_vendedor) {
      return apiError('Faltan campos requeridos.', '01', 400);
    }

    const mensajes = await prisma.mensaje.findMany({
      where: { id_vendedor },
      orderBy: { createdAt: 'desc' },
    });

    return apiSuccess({ mensajes }, 'Bandeja de mensajes.');
  } catch (error) {
    console.error('[POST /api/mensajes]', error);
    return apiError('Error al obtener mensajes.');
  }
}
