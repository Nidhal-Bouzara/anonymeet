import prsima_client from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new prsima_client.PrismaClient()
import faker from 'faker'

const seed = async () => {
  const user = await prisma.user.upsert({
    where: { username: 'nidhal' },
    update: {},
    create: { username: "nidhal", password: await bcrypt.hash("password", 12) }
  })
  
  await prisma.message.createMany({
    data: Array(25).fill({}).map(item => ({ message: faker.hacker.phrase(), user_id: user?.id }))
  })
}

seed()