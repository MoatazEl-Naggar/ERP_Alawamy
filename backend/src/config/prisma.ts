import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:123456@localhost:5432/erp_db",
});

pool.on('error', (err: any) => {
  console.error('Unexpected error on idle client', err);
});

export const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

prisma.$connect()
  .catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });