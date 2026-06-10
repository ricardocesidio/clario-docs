import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const connectionString = process.env.DATABASE_URL || ""
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const adminPassword = await bcrypt.hash("admin1234", 12)
  const demoPassword = await bcrypt.hash("demo1234", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@clariodocs.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@clariodocs.com",
      passwordHash: adminPassword,
      role: "ADMIN",
      plan: "BUSINESS",
    },
  })

  const demo = await prisma.user.upsert({
    where: { email: "demo@clariodocs.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@clariodocs.com",
      passwordHash: demoPassword,
      role: "USER",
      plan: "FREE",
    },
  })

  console.log("Seed users created:")
  console.log(`  Admin: admin@clariodocs.com / admin1234`)
  console.log(`  Demo:  demo@clariodocs.com / demo1234`)

  await prisma.chatMessage.deleteMany({ where: { userId: demo.id } })
  await prisma.analysis.deleteMany({ where: { document: { userId: demo.id } } })
  await prisma.document.deleteMany({ where: { userId: demo.id } })
  await prisma.usage.deleteMany({ where: { userId: demo.id } })

  console.log("Cleared demo user's existing documents and data")
  console.log("Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
