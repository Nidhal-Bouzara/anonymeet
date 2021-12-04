import NextAuth from "next-auth"
import { compare } from 'bcrypt'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import _ from "lodash"
const prisma = new PrismaClient()

export default NextAuth({
  secret: process.env.SECRET,
  pages: {
    signIn: '/',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: "Username", placeholder: "User Name", type: "text" },
        password: { label: "Password", placeholder: "Password", type: "password" }
      },
      authorize: async (values) => {
        try {
          if (!values?.username || !values.password) return null
          const user = await prisma.user.findUnique({
            where: { username: values?.username }
          })
          if (user === null) return null
          if (!await compare(values?.password, user?.password)) return null
          return user
        } catch (err) {
          return null
        }
      }
    })
  ]
})