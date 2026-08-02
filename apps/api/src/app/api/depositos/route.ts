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

    const depositos = await prisma.deposito.findMany({
      where: { id_vendedor, estado: 'En TrÃ¡nsito' },
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    return apiSuccess({ depositos }, 'DepÃ³sitos en trÃ¡nsito.');
  } catch (error) {
    console.error('[POST /api/depositos]', error);
    return apiError('Error al obtener depÃ³sitos.');
  }
}
