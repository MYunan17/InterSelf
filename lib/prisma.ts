import { PrismaClient, Prisma } from "@prisma/client";

// Neon/Supabase poolers run PgBouncer in transaction mode, which Prisma only supports with
// pgbouncer=true. Add it automatically for pooled hosts so the plain connection string works.
function resolveDatasourceUrl() {
  const url = process.env.DATABASE_URL;
  if (!url || url.includes("pgbouncer=") || !/-pooler\.|pooler\.supabase\.com/.test(url)) {
    return undefined;
  }
  return url + (url.includes("?") ? "&" : "?") + "pgbouncer=true";
}

// Reuse the Prisma client across hot reloads to avoid exhausting database connections in dev.
const globalForPrisma = globalThis as unknown as {
  prisma?: Prisma.DefaultPrismaClient;
};

export const prisma: Prisma.DefaultPrismaClient =
  globalForPrisma.prisma ??
  (new PrismaClient({
    datasourceUrl: resolveDatasourceUrl(),
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["error"],
  }) as Prisma.DefaultPrismaClient);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
