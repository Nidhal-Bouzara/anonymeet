import { NextApiResponse } from "next";

const handleError = (res: NextApiResponse, status: number, msg: string) => {
  res.status(status).json({ error: msg })
}

export {
  handleError
}