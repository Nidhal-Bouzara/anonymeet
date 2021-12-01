import NextAuth from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
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
      authorize: async () => {
        return {
          id: 1,
          name: 'Nidhal Anis BOUZARA',
          username: 'Nidhal',
        }
      }
    })
  ]
})