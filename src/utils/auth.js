import Cookies from 'js-cookie'

const TokenKey = 'mms_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 1 }) // cookie默认关闭浏览器清空
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
