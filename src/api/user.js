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
    url: 'http://39.98.194.195:8090/token/enter',
    method: 'get',
    params: { code: code.code }
  })
}

export function getInfo(token) {
  return request({
    url: 'http://39.98.194.195:8090/token/userinfo',
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
    url: 'http://39.98.194.195:8090/dingding',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    data
  })
}

export function getDepartment() {
  return request({
    url: 'http://39.98.194.195:8090/getdepnamelist',
    method: 'get'
  })
}

export function findByListquery(data) {
  return request({
    url: 'http://39.98.194.195:8090/exam/userscorespc',
    method: 'POST',
    data
  })
}
