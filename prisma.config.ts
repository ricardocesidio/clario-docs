import { defineConfig } from "@prisma/config"

const dbUrl = process.env.DATABASE_URL || "postgresql://localhost:5432/postgres"

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: dbUrl,
  },
})
