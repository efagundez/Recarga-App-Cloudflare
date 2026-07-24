import prisma from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/apiResponse';

async function getProductos() {
  const productos = await prisma.producto.findMany({ where: { estado: 'ACTIVO' } });
  return apiSuccess({ productos }, 'Productos disponibles.');
}

export async function GET() {
  try {
    return await getProductos();
  } catch (error: any) {
    return apiError(error.message || 'Error en el servidor', '99');
  }
}

export async function POST() {
  try {
    return await getProductos();
  } catch (error: any) {
    return apiError(error.message || 'Error en el servidor', '99');
  }
}
