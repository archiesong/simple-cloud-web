/**
 * @param {string} path
 * @return {Boolean}
 */
export function isExternal(path: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @return {Boolean}
 */
export function validUsername(str: string): boolean {
  return /^[a-z0-9_-]{4,15}$/.test(str.trim())
}
/**
 * @param {string} str
 * @return {Boolean}
 */
export function validPassword(value: string): boolean {
  return /^\d{6,}$/.test(value)
}