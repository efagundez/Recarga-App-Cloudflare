import { PrismaClient } from '@prisma/client/edge';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

let cachedPrisma: PrismaClient | undefined;

function getPrismaClient(): PrismaClient {
  if (cachedPrisma) {
    return cachedPrisma;
  }

  let connectionString = process.env.DATABASE_URL;

  // En Cloudflare, recuperamos la conexión directamente desde el binding de Hyperdrive
  try {
    // Importación dinámica para evitar problemas de resolución en build-time de entornos no Cloudflare
    const { getRequestContext } = require('@cloudflare/next-on-pages');
    const ctx = getRequestContext();
    if (ctx?.env?.HYPERDRIVE?.connectionString) {
      connectionString = ctx.env.HYPERDRIVE.connectionString;
    }
  } catch (e) {
    // Silencioso: ignoramos el error si no estamos dentro del contexto de request de Cloudflare
  }

  if (!connectionString) {
    connectionString =
      'postgresql://postgres:postgres@localhost:5432/recargadb?schema=public';
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  cachedPrisma = new PrismaClient({ adapter } as any);

  return cachedPrisma;
}

// Usamos un Proxy para evaluar el cliente de forma perezosa (lazy).
// Esto garantiza que getRequestContext() se llame solo DURANTE la ejecución de un endpoint,
// y no durante la carga estática inicial del módulo, evitando así tener que reescribir todos los archivos.
const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const val = (client as any)[prop];
    if (typeof val === 'function') {
      return val.bind(client);
    }
    return val;
  },
});

export default prisma;
