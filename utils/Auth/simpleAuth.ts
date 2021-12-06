import { NextApiRequest, NextApiResponse } from 'next'
import Cookies from 'cookies'
import nJwt from 'njwt'
import bcrypt from 'bcrypt'
import { omit } from 'lodash'

// utils
import { handleError } from '@utils/api'
import prisma from '@utils/prisma'
import { User } from '.prisma/client'
import { IncomingMessage, ServerResponse } from 'http'
import { NextApiRequestCookies } from 'next/dist/server/api-utils'

export const secret = process.env.SECRET

/**
 * Verifies if a valid session exists, refreshes the token and returns a selective user object if it does, otherwise returns false
 * @param req NextApiRequest | IncomingMessage & { cookies: NextApiRequestCookies }
 * @returns false | Pick<User, 'id' | 'username' | 'created_at' | 'updated_at'>
 */
export type SessionUser = Pick<User, 'id' | 'username' | 'created_at' | 'updated_at'>
export const getSession = async (req: NextApiRequest | IncomingMessage & { cookies: NextApiRequestCookies }, res: NextApiResponse | ServerResponse )
: Promise<SessionUser | false> => {
  const cookies = new Cookies(req, res)
  const token_cookie = cookies.get('session-token')
  if (!token_cookie) return false
  const token_object = nJwt.verify(token_cookie, secret)
  if (!token_object) return false
  const { id } = token_object.body as any
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, username: true, created_at: true, updated_at: true } })
  if (!user) return false
  const jwt =  nJwt.create({ id: user.id }, secret).compact()
  cookies.set('session-token', jwt)
  return user
}

/**
 * authenticates a user from the req.body using a username and password, returns a cookie in res status 200 if auth is successfull.
 * @param req NextApiRequest
 * @param res NextApiResponse
 * @returns void
 */
export const signIn = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { username, password } = req.body
    if (!username || !password) throw new Error('No credentials included.')
    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) throw new Error('User does not exist in our records.')
    if (!await bcrypt.compare(password, user.password)) throw new Error('Authentication attempt failed.')
    const jwt = nJwt.create({ id: user.id }, secret).compact();
    new Cookies(req, res).set('session-token', jwt)
    return res.status(200).end()
  } catch (err) {
    handleError(res, 403, (err as Error).message)
  }
}