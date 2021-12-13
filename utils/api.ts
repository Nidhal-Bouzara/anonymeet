import { NextApiResponse } from "next";

/**
 * Utility function that returns an error message with the provided status.
 * @param res NextApiResponse
 * @param status The status code
 * @param msg The error message to be returned
 * @example
 * } catch (err) {
 *  //
  * handleError(res, 422, (err as Error).message)
 * }
 */
export const handleError = (res: NextApiResponse, status: number, msg: string) => {
  return res.status(status).json({ error: msg })
}


/**
 * Joins the query params into a string separated by '/' if they are an array, otherwise return the params
 * @param params The params included in request query
 * @returns String
 * @example
 * const param: string = collapseParamsToString(req.query.params)
 */
export const collapseParamsToString = (params: string | string[]) => {
  if (!Array.isArray(params)) return params
  else return params.join('/')
}