import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/apiResponse';
import UserModel from '@/models/User';
import ProductoModel from '@/models/Producto';
import BancoModel from '@/models/Banco';
import DepositoModel from '@/models/Deposito';
import MensajeModel from '@/models/Mensaje';
import RechargeModel from '@/models/Recharge';

export async function POST(req: NextRequest) {
  // ── Auth guard ─────────────────────────────────────────────────────────────
  const migrateKey = req.headers.get('x-migrate-key');
  const expectedKey = process.env.MIGRATE_SECRET;

  if (!expectedKey) {
    return apiError('MIGRATE_SECRET no está configurado en el servidor.', '99', 500);
  }
  if (migrateKey !== expectedKey) {
    return apiError('No autorizado. Header X-Migrate-Key inválido.', '01', 401);
  }

  // ── MongoDB connection ──────────────────────────────────────────────────────
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    return apiError('MONGODB_URI no está configurado en el servidor.', '99', 500);
  }

  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    const summary = {
      grupos:    0,
      bancos:    0,
      productos: 0,
      users:     0,
      recharges: 0,
      depositos: 0,
      mensajes:  0,
    };

    // ── Grupos (extraídos de users) ────────────────────────────────────────────
    const mongoUsers = await UserModel.find({}).lean();
    const uniqueGrupos = [...new Set(mongoUsers.map((u: any) => u.grupo).filter(Boolean))] as string[];

    for (const nombre of uniqueGrupos) {
      await prisma.grupo.upsert({
        where:  { nombre },
        update: {},
        create: { nombre },
      });
      summary.grupos++;
    }

    // ── Bancos ─────────────────────────────────────────────────────────────────
    const mongoBancos = await BancoModel.find({}).lean();
    for (const b of mongoBancos) {
      const bancoData = b as any;
      await prisma.banco.upsert({
        where:  { id_banco: Number(bancoData.id_banco) },
        update: {
          nombre: bancoData.nombre,
          codigo: bancoData.codigo_banco ?? bancoData.codigo ?? '',
        },
        create: {
          id_banco: Number(bancoData.id_banco),
          nombre:   bancoData.nombre,
          codigo:   bancoData.codigo_banco ?? bancoData.codigo ?? '',
        },
      });
      summary.bancos++;
    }

    // ── Productos ──────────────────────────────────────────────────────────────
    const mongoProductos = await ProductoModel.find({}).lean();
    for (const p of mongoProductos) {
      const prod = p as any;
      await prisma.producto.upsert({
        where:  { id_producto: Number(prod.id_producto) },
        update: {
          nombre:     prod.nombre,
          operadora:  prod.operadora,
          monto_minimo: prod.monto_minimo ?? 0,
          monto_maximo: prod.monto_maximo ?? 0,
          multiplo:   prod.multiplo ?? 1,
          estado:     prod.estado ?? 'ACTIVO',
        },
        create: {
          id_producto:  Number(prod.id_producto),
          nombre:       prod.nombre,
          operadora:    prod.operadora,
          monto_minimo: prod.monto_minimo ?? 0,
          monto_maximo: prod.monto_maximo ?? 0,
          multiplo:     prod.multiplo ?? 1,
          estado:       prod.estado ?? 'ACTIVO',
        },
      });
      summary.productos++;
    }

    // ── Users ──────────────────────────────────────────────────────────────────
    // Re-fetch with password (select: false in schema)
    const mongoUsersWithPwd = await UserModel.find({}).select('+password').lean();
    let idVendedorCounter = 1;

    for (const u of mongoUsersWithPwd) {
      const user = u as any;
      const id_vendedor = user.id_vendedor ? Number(user.id_vendedor) : idVendedorCounter++;

      await prisma.user.upsert({
        where:  { id_vendedor },
        update: {
          grupo:       user.grupo ?? 'RECARGA1',
          usuario:     user.usuario ?? user.name ?? String(id_vendedor),
          contrasenia: user.password ?? '',
          nombre:      user.name ?? user.nombre ?? null,
          saldo:       user.saldo ?? 0,
          role:        user.role ?? 'VENDEDOR',
          correo_electronico: user.email ?? null,
        },
        create: {
          id_vendedor,
          grupo:       user.grupo ?? 'RECARGA1',
          usuario:     user.usuario ?? user.name ?? String(id_vendedor),
          contrasenia: user.password ?? '',
          nombre:      user.name ?? user.nombre ?? null,
          saldo:       user.saldo ?? 0,
          role:        user.role ?? 'VENDEDOR',
          correo_electronico: user.email ?? null,
        },
      });
      summary.users++;
    }

    // ── Recharges ──────────────────────────────────────────────────────────────
    const mongoRecharges = await RechargeModel.find({}).lean();
    let nroCounter = 100000;

    for (const r of mongoRecharges) {
      const rec = r as any;
      const nro_transaccion = rec.nro_transaccion ? Number(rec.nro_transaccion) : nroCounter++;

      await prisma.recharge.upsert({
        where:  { nro_transaccion },
        update: {
          resultado: rec.resultado ?? 'AP',
          status:    rec.resultado === 'EXITOSA' ? 'APROBADA' : 'RECHAZADA',
          error:     rec.error ?? null,
        },
        create: {
          nro_transaccion,
          id_vendedor: Number(rec.id_vendedor) || 1,
          grupo:       rec.grupo ?? 'RECARGA1',
          id_producto: Number(rec.id_producto) || 1,
          producto:    rec.producto ?? null,
          cuenta:      rec.cuenta ?? '',
          monto:       rec.monto ?? 0,
          resultado:   rec.resultado ?? 'AP',
          status:      rec.resultado === 'EXITOSA' ? 'APROBADA' : 'RECHAZADA',
          error:       rec.error ?? null,
          fecha:       rec.fecha ?? null,
          hora:        rec.hora ?? null,
        },
      });
      summary.recharges++;
    }

    // ── Depositos ──────────────────────────────────────────────────────────────
    const mongoDepositos = await DepositoModel.find({}).lean();
    let depositoCounter = 1;

    for (const d of mongoDepositos) {
      const dep = d as any;
      const id_deposito = depositoCounter++;

      await prisma.deposito.upsert({
        where:  { id_deposito },
        update: {
          estado: dep.estado ?? 'En Tránsito',
        },
        create: {
          id_deposito,
          id_vendedor:   Number(dep.id_vendedor) || 1,
          id_banco:      Number(dep.id_banco) || 1,
          banco_origen:  dep.grupo ?? null,
          nro_deposito:  dep.nro_deposito ?? null,
          monto:         dep.monto ?? 0,
          fecha:         dep.fecha ?? null,
          estado:        dep.estado ?? 'En Tránsito',
        },
      });
      summary.depositos++;
    }

    // ── Mensajes ───────────────────────────────────────────────────────────────
    const mongoMensajes = await MensajeModel.find({}).lean();
    let mensajeCounter = 1;

    for (const m of mongoMensajes) {
      const msg = m as any;
      const id_mensaje = mensajeCounter++;

      await prisma.mensaje.upsert({
        where:  { id_mensaje },
        update: {
          leido: msg.leido ?? false,
        },
        create: {
          id_mensaje,
          id_vendedor: Number(msg.id_vendedor) || 1,
          grupo:       msg.grupo ?? 'RECARGA1',
          titulo:      msg.titulo ?? 'Sin título',
          mensaje:     msg.contenido ?? msg.mensaje ?? '',
          fecha_envio: msg.fecha
            ? new Date(msg.fecha).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          leido:       msg.leido ?? false,
        },
      });
      summary.mensajes++;
    }

    return apiSuccess(
      { migrated: summary },
      'Migración completada.'
    );
  } catch (error: any) {
    console.error('[migrate] Error durante la migración:', error);
    return apiError(
      `Error durante la migración: ${error?.message ?? 'Error desconocido'}`,
      '99',
      500
    );
  } finally {
    // Disconnect Mongoose after migration
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}
