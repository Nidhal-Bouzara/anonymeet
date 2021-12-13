import { NextApiRequest, NextApiResponse } from "next";
import { signIn as signInHandler } from '@utils/Auth/simpleAuth'
import { handleError, collapseParamsToString } from "@utils/api";
import prisma from "@utils/prisma";
import { User } from "@prisma/client";
import bcrypt from 'bcrypt'

export type SIGNIN_FORM_SCHEMA = {
  username: string
  password: string
}
export const signIn = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await signInHandler(req, res)
  } catch (err) {
    handleError(res, 422, (err as Error).message || 'Unhandled error.')
  }
}

/**
 * Checkes if the provided username already exists in the db
 * @param username The username to check the existence of
 * @returns boolean true if username is not found/is not used before, true if it's found/already used 
 * @example
 * const username_exists = !(await usernameIsUnique(username))
 */
 export const usernameIsUnique = async (username: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({ where: { username } })
  if (user === null) return true
  else return false
  
}

export type CHECK_IF_UNIQUE_RESPONSE = { exists: boolean }
export const checkIfUnique = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const username = collapseParamsToString((req.query as { username: string | string[] }).username)
    const exists = !(await usernameIsUnique(username))
    const response: CHECK_IF_UNIQUE_RESPONSE = { exists }
    return res.json( response )
  } catch (err) {
    handleError(res, 422, (err as Error).message)
  }
}

export type REGISTRATION_FORM_SCHEMA = {
  username: string
  password: string
}
export const registerUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { username, password }: REGISTRATION_FORM_SCHEMA = req.body
    if (!(await usernameIsUnique(username))) throw new Error('User with this name already exists.')
    const { password: password_ignore, ...user } = await prisma.user.create({ data: { username, password: await bcrypt.hash(password, 12) }})
    await signInHandler(req, res)
  } catch (err) {
    handleError(res, 422, (err as Error).message)
  }
}
