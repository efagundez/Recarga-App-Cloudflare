export const runtime = 'edge';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/apiResponse';

export async function POST(request: Request) {
  try {
    // Token validation
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace(/^(Bearer|Token)\s+/i, '').trim();

    if (!token) {
      return apiError('No autorizado', '99');
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET as string);
    } catch {
      return apiError('Token invÃ¡lido o expirado', '99');
    }

    const body = await request.json();
    const { id_vendedor, id_producto, cuenta, monto, grupo } = body;

    if (!id_vendedor || !id_producto || !cuenta || monto === undefined || !grupo) {
      return apiError('Datos incompletos para la venta', '99');
    }

    const numericMonto = Number(monto);
    if (isNaN(numericMonto) || numericMonto <= 0) {
      return apiError('Monto invÃ¡lido', '99');
    }

    // Buscar usuario
    const user = await prisma.user.findFirst({ where: { id_vendedor: Number(id_vendedor) } });
    if (!user) {
      return apiError('Vendedor no encontrado', '99');
    }

    if (user.saldo < numericMonto) {
      return apiError('Saldo insuficiente.', '98');
    }

    // Buscar producto
    const producto = await prisma.producto.findFirst({ where: { id_producto: Number(id_producto) } });
    if (!producto) {
      return apiError('Producto no encontrado', '99');
    }

    // Validar monto mÃ­nimo y mÃ¡ximo
    if (numericMonto < producto.monto_minimo || numericMonto > producto.monto_maximo) {
      return apiError(
        `El monto debe estar entre ${producto.monto_minimo} y ${producto.monto_maximo}`,
        '99'
      );
    }

    // Validar mÃºltiplo
    if (producto.multiplo > 0 && numericMonto % producto.multiplo !== 0) {
      return apiError(`El monto debe ser mÃºltiplo de ${producto.multiplo}`, '99');
    }

    // Calcular comisiÃ³n
    const comision = numericMonto * (user.comision / 100);
    const nro_transaccion = Date.now();

    // Crear transacciÃ³n
    await prisma.recharge.create({
      data: {
        nro_transaccion,
        id_vendedor: user.id_vendedor,
        grupo,
        id_producto: producto.id_producto,
        producto: producto.nombre,
        cuenta,
        monto: numericMonto,
        fecha: new Date().toLocaleDateString('es-VE'),
        hora: new Date().toLocaleTimeString('es-VE'),
        comision,
        porcentaje_comision: user.comision,
      },
    });

    // Descontar saldo
    await prisma.user.update({
      where: { id_vendedor: user.id_vendedor },
      data: { saldo: { decrement: numericMonto } },
    });

    return apiSuccess(
      { nro_transaccion, saldo: user.saldo - numericMonto },
      'Recarga exitosa.'
    );
  } catch (error: any) {
    return apiError(error.message || 'Error al procesar la venta', '99');
  }
}
