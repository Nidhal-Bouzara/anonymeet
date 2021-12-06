import { NextApiRequest, NextApiResponse } from "next";
import { signIn as signInHandler } from '@utils/Auth/simpleAuth'
import { handleError } from "@utils/api";

export const signIn = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await signInHandler(req, res)
  } catch (err) {
    handleError(res, 422, (err as Error).message || 'Unhandled error.')
  }
}