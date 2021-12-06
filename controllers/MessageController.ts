import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@utils/prisma'
import { handleError } from "@utils/api";
import { Message, User } from ".prisma/client";
import { reverse } from "lodash";
import { getSession } from "@utils/Auth/simpleAuth";

export type MessageWithUser = Message & { user: { username: string } }
export const getMessagesFromDB = async (cursor: number | false = false): Promise<MessageWithUser[]> => {
  const messages = reverse(await prisma.message.findMany({
    take: 100,
    skip: cursor ? 1 : 0,
    cursor: !cursor ? undefined : {
      id: cursor
    },
    include: { user: { select: { username: true } } },
    orderBy: { id: 'desc' }
  }))
  return messages
}

export type GET_MESSAGE_RES = { messages: MessageWithUser[], new_cursor: number }
const getMessages = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let cursor: number | false
    if ( req.query.params ) cursor = Number(req.query.params[0]); 
    else cursor = false
    const messages = await getMessagesFromDB(cursor)
    return res.json({ messages, new_cursor: messages[0].id })
  } catch (err) {
    return handleError(res, 422, (err as Error).message)
  }
}

export type POST_MESSAGE_RES = { message: Message & { user: { username: string } } }
const upsertMessage = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const user = await getSession(req, res)
    if (!user) throw new Error('Request not authorized')

    const message = await prisma.message.create({
      data: {
        message: req.body.message,
        user: {
          connect: {
            id: user.id
          }
        }
      },
      include: { user: { select: { username: true }}}
    })
    return res.json({ message })
  } catch (err) {
    return handleError(res, 422, (err as Error).message)
  }
}

export {
  getMessages,
  upsertMessage,
}