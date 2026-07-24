import { NextResponse } from 'next/server';

export interface ApiResponseOptions {
  codigo?: string;
  mensaje?: string;
  data?: any;
  status?: number;
  [key: string]: any;
}

export function apiResponse(
  optionsOrCodigo: ApiResponseOptions | string = '00',
  mensajeArg?: string,
  extraData?: Record<string, any>
) {
  if (typeof optionsOrCodigo === 'string') {
    const codigo = optionsOrCodigo;
    const mensaje = mensajeArg || 'OK';
    const body: Record<string, any> = {
      codigo,
      mensaje,
      ...extraData,
    };
    return NextResponse.json(body, { status: 200 });
  }

  const { codigo = '00', mensaje = 'OK', status = 200, data, ...extra } = optionsOrCodigo;
  
  const body: Record<string, any> = {
    codigo,
    mensaje,
    ...extra,
  };

  if (data !== undefined) {
    body.data = data;
  }

  return NextResponse.json(body, { status });
}

export function apiSuccess(data?: any, mensaje: string = 'Operación exitosa', extra: Record<string, any> = {}) {
  return apiResponse({
    codigo: '00',
    mensaje,
    data,
    status: 200,
    ...extra,
  });
}

export function apiError(mensaje: string = 'Error en la operación', codigo: string = '99', status: number = 400, extra: Record<string, any> = {}) {
  return apiResponse({
    codigo,
    mensaje,
    status,
    ...extra,
  });
}
