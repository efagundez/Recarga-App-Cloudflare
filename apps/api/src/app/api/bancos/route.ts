import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Banco from '../../../models/Banco';
import { apiResponse, apiError } from '../../../lib/apiResponse';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const bancos = await Banco.find({ estado: 'ACTIVO' }).sort({ nombre: 1 });

    return apiResponse({
      codigo: '00',
      mensaje: 'Entidades bancarias recuperadas exitosamente.',
      bancos
    });
  } catch (error: any) {
    return apiError(error.message || 'Error al obtener la lista de bancos.', '99', 500);
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id_banco, nombre, codigo_banco, num_cuenta, titular, rif_cedula, tipo_cuenta } = body;

    if (!id_banco || !nombre) {
      return apiError('Se requieren id_banco y nombre.', '01', 400);
    }

    const bancoExistente = await Banco.findOne({ id_banco });
    let banco;

    if (bancoExistente) {
      banco = await Banco.findOneAndUpdate(
        { id_banco },
        { nombre, codigo_banco, num_cuenta, titular, rif_cedula, tipo_cuenta },
        { new: true }
      );
    } else {
      banco = await Banco.create({
        id_banco,
        nombre,
        codigo_banco,
        num_cuenta,
        titular,
        rif_cedula,
        tipo_cuenta
      });
    }

    return apiResponse({
      codigo: '00',
      mensaje: 'Entidad bancaria guardada exitosamente.',
      banco
    });
  } catch (error: any) {
    return apiError(error.message || 'Error al procesar entidad bancaria.', '99', 500);
  }
}
