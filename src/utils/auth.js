const TokenKey = 'super_token'
const InfoKey = 'super_info'

export function encodeToken () {
  return window.localStorage.getItem(TokenKey)
}

export function setToken (token) {
  return window.localStorage.setItem(TokenKey, token)
}

export function removeToken () {
  return window.localStorage.removeItem(TokenKey)
}
export function setUser (user) {
  return window.localStorage.setItem(InfoKey, JSON.stringify(user))
}
export function getUser () {
  return window.localStorage.getItem(InfoKey)
}
export function removeUser () {
  return window.localStorage.removeItem(InfoKey)
}
