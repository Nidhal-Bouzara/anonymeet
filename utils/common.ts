/**
 * Returns a serializeable version of the provided item.
 * Use this to bypass the "Please only return JSON serializable data types." error.
 * @param item any
 * @returns any
 */
export const makeSerializable = (item: any) => JSON.parse(JSON.stringify(item))