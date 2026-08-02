export const runtime = 'edge';
import prisma from '../../../lib/prisma';
import { apiSuccess, apiError } from '../../../lib/apiResponse';

async function handleOperadora(id_producto?: number | null) {
  if (id_producto) {
    const producto = await prisma.producto.findFirst({
      where: { id_producto: Number(id_producto) },
    });

    if (!producto) {
      return apiError('Producto u operadora no encontrada', '01');
    }

    return apiSuccess({ operadora: producto }, 'LÃ­mites de operadora.');
  }

  // Sin id_producto: retorna todos los activos
  const productos = await prisma.producto.findMany({ where: { estado: 'ACTIVO' } });
  return apiSuccess({ operadora: productos }, 'LÃ­mites de operadora.');
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id_producto = searchParams.get('id_producto')
      ? Number(searchParams.get('id_producto'))
      : null;

    return await handleOperadora(id_producto);
  } catch (error: any) {
    return apiError(error.message || 'Error en el servidor', '01');
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { id_producto } = body;

    return await handleOperadora(id_producto ? Number(id_producto) : null);
  } catch (error: any) {
    return apiError(error.message || 'Error en el servidor', '01');
  }
}

