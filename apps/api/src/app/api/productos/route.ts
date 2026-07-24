import { NextResponse } from 'next/server';
import { apiResponse } from '@/lib/apiResponse';
import { PRODUCTOS_CATALOGO } from '@/lib/productos';

export async function GET() {
  return NextResponse.json(
    apiResponse('00', 'Lista de productos.', {
      productos: PRODUCTOS_CATALOGO,
    })
  );
}

export async function POST() {
  return NextResponse.json(
    apiResponse('00', 'Lista de productos.', {
      productos: PRODUCTOS_CATALOGO,
    })
  );
}
