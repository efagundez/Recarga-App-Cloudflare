import User from '../models/User';
import Grupo from '../models/Grupo';
import Producto from '../models/Producto';
import Banco from '../models/Banco';
import Deposito from '../models/Deposito';
import Mensaje from '../models/Mensaje';
import Recharge from '../models/Recharge';

export async function seedDatabase() {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return;
    }

    console.log('Poblando base de datos con datos mock iniciales...');

    await Grupo.insertMany([
      { nombre: 'GENERAL', estado: 'ACTIVO' },
      { nombre: 'VIP', estado: 'ACTIVO' },
      { nombre: 'AGENCIAS', estado: 'ACTIVO' }
    ]);

    await User.insertMany([
      {
        id_vendedor: 1001,
        grupo: 'GENERAL',
        usuario: 'ADMIN',
        contrasenia: 'admin123',
        nombre: 'Administrador Principal',
        saldo: 5000,
        comision: 5,
        estado: 'ACTIVO',
        role: 'ADMIN'
      },
      {
        id_vendedor: 1002,
        grupo: 'GENERAL',
        usuario: 'RECARGA1',
        contrasenia: 'recarga123',
        nombre: 'Punto Recargas Centro',
        saldo: 1500,
        comision: 3,
        estado: 'ACTIVO',
        role: 'VENDEDOR'
      },
      {
        id_vendedor: 1003,
        grupo: 'AGENCIAS',
        usuario: 'AGENCIA1',
        contrasenia: 'agencia123',
        nombre: 'Agencia Comercial Caracas',
        saldo: 10000,
        comision: 4,
        estado: 'ACTIVO',
        role: 'AGENCIA'
      }
    ]);

    await Producto.insertMany([
      {
        id_producto: 1,
        nombre: 'Movistar Prepago',
        operadora: 'MOVISTAR',
        monto_minimo: 50,
        monto_maximo: 1000,
        multiplo: 10,
        estado: 'ACTIVO'
      },
      {
        id_producto: 2,
        nombre: 'Digitel Prepago',
        operadora: 'DIGITEL',
        monto_minimo: 50,
        monto_maximo: 1000,
        multiplo: 10,
        estado: 'ACTIVO'
      },
      {
        id_producto: 3,
        nombre: 'Movilnet Prepago',
        operadora: 'MOVILNET',
        monto_minimo: 20,
        monto_maximo: 500,
        multiplo: 5,
        estado: 'ACTIVO'
      },
      {
        id_producto: 4,
        nombre: 'SimpleTV Plan Básico',
        operadora: 'SIMPLE_TV',
        monto_minimo: 100,
        monto_maximo: 2000,
        multiplo: 50,
        estado: 'ACTIVO'
      }
    ]);

    await Banco.insertMany([
      { id_banco: 1, nombre: 'Banesco Banco Universal', codigo: '0134' },
      { id_banco: 2, nombre: 'Banco de Venezuela', codigo: '0102' },
      { id_banco: 3, nombre: 'Banco Mercantil', codigo: '0105' }
    ]);

    await Mensaje.insertMany([
      {
        id_mensaje: 1,
        id_vendedor: 1002,
        grupo: 'GENERAL',
        titulo: 'Bienvenido al sistema',
        mensaje: 'Estimado cliente, bienvenido a la plataforma Visual Recarga.',
        fecha_envio: '2026-07-23 10:00:00',
        leido: false
      }
    ]);

    await Deposito.insertMany([
      {
        id_deposito: 101,
        id_vendedor: 1002,
        id_banco: 1,
        banco_origen: 'Banesco',
        cuenta_destino: '01340001000000000000',
        tipo_deposito: 'TRANSFERENCIA',
        nro_deposito: 'DEP-00101',
        monto: 2000,
        fecha: '2026-07-23',
        estado: 'Conciliado',
        saldo_al_conciliar: 1500,
        verificado_por: 'ADMIN',
        verificado_el: '2026-07-23 11:00:00'
      }
    ]);

    await Recharge.insertMany([
      {
        nro_transaccion: 5001,
        id_vendedor: 1002,
        grupo: 'GENERAL',
        producto: 'Movistar Prepago',
        cuenta: '04141234567',
        monto: 100,
        resultado: 'AP',
        status: 'APROBADA',
        error: '',
        respuesta: 'Transacción Exitosa',
        fecha: '2026-07-23',
        hora: '12:30:00',
        comision: 3,
        porcentaje_comision: 3
      }
    ]);

    console.log('Base de datos poblada exitosamente.');
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
  }
}
