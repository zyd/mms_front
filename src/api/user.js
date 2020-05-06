import request from '@/utils/request'
import qs from 'qs'

export function login(username, password) {
  return request.post('/user/login', qs.stringify({
    username,
    password
  }))
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
