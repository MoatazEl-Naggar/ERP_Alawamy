import "dotenv/config";
import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL || "postgresql://postgres:123456@localhost:5432/erp_db";

const pool = new Pool({ connectionString });

export default defineConfig({
  earlyAccess: true,
  schema: "prisma/schema.prisma",
  datasource: {
    url: connectionString,          // ✅ Required by migrate dev
  },
  migrate: {
    async adapter() {
      return new PrismaPg(pool);    // ✅ Required by PrismaClient at runtime
    },
  },
});