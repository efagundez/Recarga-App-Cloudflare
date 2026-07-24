import { NextResponse } from 'next/server';
import { apiResponse, apiError } from '@/lib/apiResponse';
import { PRODUCTOS_CATALOGO } from '@/lib/productos';

function handleOperadoraSearch(id_producto?: string | null, grupo?: string | null) {
  let filtered = PRODUCTOS_CATALOGO;

  if (id_producto) {
    filtered = filtered.filter(
      (p) =>
        p.id_producto.toLowerCase() === id_producto.toLowerCase() ||
        p.operadora.toLowerCase() === id_producto.toLowerCase()
    );
  }

  if (filtered.length === 0) {
    return NextResponse.json(apiError('Producto u operadora no encontrada', '01'));
  }

  return NextResponse.json(
    apiResponse('00', 'Detalles de operadora / producto.', {
      operadoras: filtered,
    })
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id_producto = searchParams.get('id_producto');
  const grupo = searchParams.get('grupo');

  return handleOperadoraSearch(id_producto, grupo);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { id_producto, grupo } = body;

    return handleOperadoraSearch(id_producto, grupo);
  } catch (error: any) {
    return NextResponse.json(apiError(error.message || 'Error en el servidor', '01'));
  }
}
