import prisma from './prisma';

export async function seedPrismaDatabase(): Promise<void> {
  const count = await prisma.grupo.count();
  if (count > 0) {
    console.log('[seedPrisma] Database already seeded. Skipping.');
    return;
  }

  console.log('[seedPrisma] Seeding database...');

  // ── Grupos ──────────────────────────────────────────────────────────────────
  await prisma.grupo.createMany({
    data: [
      { nombre: 'RECARGA1' },
      { nombre: 'DEMO' },
      { nombre: 'CORPORATIVO' },
    ],
    skipDuplicates: true,
  });

  // ── Bancos ───────────────────────────────────────────────────────────────────
  await prisma.banco.createMany({
    data: [
      { id_banco: 1, nombre: 'Banesco',   codigo: '0134' },
      { id_banco: 2, nombre: 'BDV',       codigo: '0102' },
      { id_banco: 3, nombre: 'Mercantil', codigo: '0105' },
    ],
    skipDuplicates: true,
  });

  // ── Productos ─────────────────────────────────────────────────────────────────
  await prisma.producto.createMany({
    data: [
      {
        id_producto: 1,
        nombre:       'Movistar',
        operadora:    'Movistar',
        monto_minimo: 15,
        monto_maximo: 5000,
        multiplo:     15,
      },
      {
        id_producto: 2,
        nombre:       'Digitel',
        operadora:    'Digitel',
        monto_minimo: 10,
        monto_maximo: 3000,
        multiplo:     10,
      },
      {
        id_producto: 3,
        nombre:       'Movilnet',
        operadora:    'Movilnet',
        monto_minimo: 12,
        monto_maximo: 4000,
        multiplo:     12,
      },
      {
        id_producto: 4,
        nombre:       'SimpleTV',
        operadora:    'SimpleTV',
        monto_minimo: 50,
        monto_maximo: 500,
        multiplo:     50,
      },
    ],
    skipDuplicates: true,
  });

  // ── Usuarios ──────────────────────────────────────────────────────────────────
  await prisma.user.createMany({
    data: [
      {
        id_vendedor: 1,
        grupo:       'RECARGA1',
        usuario:     'ADMIN',
        contrasenia: 'admin123',
        nombre:      'Administrador',
        saldo:       50000,
        role:        'ADMIN',
      },
      {
        id_vendedor: 2,
        grupo:       'RECARGA1',
        usuario:     'AGENTE1',
        contrasenia: 'agente123',
        nombre:      'Agente Uno',
        saldo:       5000,
        role:        'VENDEDOR',
      },
    ],
    skipDuplicates: true,
  });

  // ── Mensajes de bienvenida ────────────────────────────────────────────────────
  const now = new Date();
  const fechaStr = now.toISOString().split('T')[0];

  await prisma.mensaje.createMany({
    data: [
      {
        id_mensaje:  1,
        id_vendedor: 1,
        grupo:       'RECARGA1',
        titulo:      '¡Bienvenido, Administrador!',
        mensaje:     'Tu cuenta de administrador ha sido creada exitosamente. Puedes gestionar usuarios, productos y depósitos desde este panel.',
        fecha_envio: fechaStr,
        leido:       false,
      },
      {
        id_mensaje:  2,
        id_vendedor: 2,
        grupo:       'RECARGA1',
        titulo:      '¡Bienvenido, Agente Uno!',
        mensaje:     'Tu cuenta de vendedor ha sido creada. Recuerda consultar tu saldo antes de realizar recargas.',
        fecha_envio: fechaStr,
        leido:       false,
      },
    ],
    skipDuplicates: true,
  });

  console.log('[seedPrisma] Seed completed successfully.');
}
