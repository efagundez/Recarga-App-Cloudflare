export const runtime = 'edge';
import { NextRequest } from 'next/server';
import prisma from '../../../lib/prisma';
import { apiSuccess, apiError } from '../../../lib/apiResponse';

export async function GET(_req: NextRequest) {
  try {
    const bancos = await prisma.banco.findMany();
    return apiSuccess({ bancos }, 'Lista de bancos.');
  } catch (error) {
    console.error('[GET /api/bancos]', error);
    return apiError('Error al obtener bancos.');
  }
}

export async function POST(_req: NextRequest) {
  try {
    const bancos = await prisma.banco.findMany();
    return apiSuccess({ bancos }, 'Lista de bancos.');
  } catch (error) {
    console.error('[POST /api/bancos]', error);
    return apiError('Error al obtener bancos.');
  }
}

