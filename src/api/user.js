import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function loginByCode(code) {
  return request({
    url: '/token/enter',
    method: 'get',
    params: { code: code.code }
  })
}

export function getInfo(token) {
  return request({
    url: '/token/userinfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function uploadMessage(data) {
  return request({
    url: 'http://118.190.175.198:8081/login/dingding',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    data
  })
}
