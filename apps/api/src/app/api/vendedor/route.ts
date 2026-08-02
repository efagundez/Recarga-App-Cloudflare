export const runtime = 'edge';
import { NextRequest } from 'next/server';
import prisma from '../../../lib/prisma';
import { apiSuccess, apiError } from '../../../lib/apiResponse';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { grupo, usuario, contrasenia, nombre } = body as {
      grupo: string;
      usuario: string;
      contrasenia: string;
      nombre: string;
    };

    if (!grupo || !usuario || !contrasenia || !nombre) {
      return apiError('Faltan campos requeridos.', '01', 400);
    }

    const id_vendedor = Date.now() % 100000;

    const user = await prisma.user.create({
      data: {
        id_vendedor,
        grupo,
        usuario,
        contrasenia,
        nombre,
        role: 'VENDEDOR',
        estado: 'ACTIVO',
      },
    });

    return apiSuccess(
      { id_vendedor: user.id_vendedor, usuario: user.usuario },
      'Vendedor registrado.'
    );
  } catch (error) {
    console.error('[POST /api/vendedor]', error);
    return apiError('Error al registrar el vendedor.');
  }
}

