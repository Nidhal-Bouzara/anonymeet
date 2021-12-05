import { NextApiRequest, NextApiResponse } from "next";
import { getSession, GetSessionParams } from "next-auth/react";
import { User } from '@prisma/client'
import prisma from '@utils/prisma'
import { handleError } from "@utils/api";
import { Message } from "pages/chat";
import { IncomingMessage } from "http";

export const getMessagesFromDB = async (cursor: number | false = false) => {
  const messages = await prisma.message.findMany({
    take: 25,
    skip: cursor ? 1 : 0,
    cursor: !cursor ? undefined : {
      id: cursor
    }
  })
  return messages
}

const getMessages = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cursor: number | false
    if ( req.query.params ) cursor = Number(req.query.params[0])
    else cursor = false
    const messages = await getMessagesFromDB(cursor)
    return res.json({ messages, cursor })

  } catch (err) {
    return handleError(res, 422, (err as Error).message)
  }
}

const upsertMessage = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // !todo: Implement authentication
    const session = {}
    console.log('entered session: ', session);
    if (session === null) throw new Error('ERROR: User not logged in.')
    const user = await prisma.user.findUnique({ where: { username: (session.user! as User).username } })
    if (!user) return new Error('ERROR: User does not exist')
    const message = req.body as Message
    if (message.user_id === user.id) return new Error('ERROR: User does not have permission')
    // if message is a new message upsert where id == message_id will not match anything
    // this creates a new message
    let message_id: number = 0
    if (message.id) message_id = message.id
    const new_message = prisma.message.upsert({
      where: {
        id: message_id
      },
      update: {
        message: message.message
      },
      create: {
        message: message.message,
        user_id: (session.user as User).id
      }
    })
    return res.json({ message: new_message })
  } catch (err) {
    return handleError(res, 422, (err as Error).message)
  }
}

export {
  getMessages,
  upsertMessage,
}