import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import { apiResponse, apiError } from '../../../lib/apiResponse';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const {
      id_vendedor,
      grupo,
      usuario,
      contrasenia,
      nombre,
      saldo,
      comision,
      estado,
      role,
      rif,
      direccion,
      telefonos,
      contacto,
      correo_electronico,
      zona_postal,
      estado_venezuela,
      municipio,
      ciudad,
      region,
      tipo_comercio,
      codigo_sap_digitel,
      codigo_sap_movistar,
      tipo_saldo,
      condicion
    } = body;

    if (id_vendedor === undefined || !nombre) {
      return apiError('Se requieren id_vendedor y nombre.', '01', 400);
    }

    const numIdVendedor = Number(id_vendedor);

    let vendedor = await User.findOne({ id_vendedor: numIdVendedor });

    if (vendedor) {
      // Editar vendedor / sucursal
      const updateData: any = {
        nombre,
        ...(grupo && { grupo }),
        ...(usuario && { usuario }),
        ...(contrasenia && { contrasenia }),
        ...(saldo !== undefined && { saldo: Number(saldo) }),
        ...(comision !== undefined && { comision: Number(comision) }),
        ...(estado && { estado }),
        ...(role && { role }),
        ...(rif && { rif }),
        ...(direccion && { direccion }),
        ...(telefonos && { telefonos }),
        ...(contacto && { contacto }),
        ...(correo_electronico && { correo_electronico }),
        ...(zona_postal && { zona_postal }),
        ...(estado_venezuela && { estado_venezuela }),
        ...(municipio && { municipio }),
        ...(ciudad && { ciudad }),
        ...(region && { region }),
        ...(tipo_comercio && { tipo_comercio }),
        ...(codigo_sap_digitel && { codigo_sap_digitel }),
        ...(codigo_sap_movistar && { codigo_sap_movistar }),
        ...(tipo_saldo && { tipo_saldo }),
        ...(condicion && { condicion })
      };

      vendedor = await User.findOneAndUpdate({ id_vendedor: numIdVendedor }, updateData, { new: true });

      return apiResponse({
        codigo: '00',
        mensaje: 'Vendedor / sucursal actualizado exitosamente.',
        vendedor
      });
    } else {
      // Registrar nuevo vendedor / sucursal
      if (!usuario || !contrasenia) {
        return apiError('usuario y contrasenia son requeridos para nuevos registros.', '01', 400);
      }

      vendedor = await User.create({
        id_vendedor: numIdVendedor,
        grupo: grupo || 'DEFAULT',
        usuario,
        contrasenia,
        nombre,
        saldo: saldo !== undefined ? Number(saldo) : 0,
        comision: comision !== undefined ? Number(comision) : 0,
        estado: estado || 'ACTIVO',
        role: role || 'VENDEDOR',
        rif,
        direccion,
        telefonos,
        contacto,
        correo_electronico,
        zona_postal,
        estado_venezuela,
        municipio,
        ciudad,
        region,
        tipo_comercio,
        codigo_sap_digitel,
        codigo_sap_movistar,
        tipo_saldo,
        condicion
      });

      return apiResponse({
        codigo: '00',
        mensaje: 'Vendedor / sucursal registrado exitosamente.',
        vendedor
      });
    }
  } catch (error: any) {
    return apiError(error.message || 'Error al guardar vendedor / sucursal.', '99', 500);
  }
}
