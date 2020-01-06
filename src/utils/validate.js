/**
 * Created by Cortejo on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
const isExternal = path => {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
const validUsername = str => {
  // const vmap = ['admin', 'editor', 'cortejo']
  // return vmap.indexOf(str.trim()) >= 0
  var reg = /^[a-zA-Z\d]\w{3,11}[a-zA-Z\d]$/
  return reg.test(str.trim())
}
export { isExternal, validUsername }
