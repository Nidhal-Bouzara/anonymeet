import prsima_client from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new prsima_client.PrismaClient()

const seed = async () => {
  await prisma.user.upsert({
    where: { username: 'nidhal' },
    update: {},
    create: { username: "nidhal", password: await bcrypt.hash("password", 12) }
  })
}

seed()