import { NextApiRequest, NextApiResponse } from 'next'

type Response = any

const login = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const resp = await fetch('http://localhost:3000/api/auth/signin', {
    method: "POST",
    body: req.body
  })
  res.status(200).json(resp)
}

export { login }