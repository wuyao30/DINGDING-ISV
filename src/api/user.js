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
