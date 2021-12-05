import { getMessages, upsertMessage } from '@controllers/MessageController'
import { handleError } from '@utils/api'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case "GET": return getMessages(req, res)
      case "POST": return upsertMessage(req, res)
      default: throw new Error('ERROR: Unexpected error occured.')
    }
  } catch (err) {
    return handleError(res, 422, (err as Error).message)
  }
}

export default handler