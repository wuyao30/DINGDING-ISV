import request from '@/utils/request'

export function insertNotice(data) {
  return request({
    url: 'http://39.98.194.195:8090/test/notice',
    method: 'post',
    data
  })
}

export function getNotice(data) {
  return request({
    url: 'http://39.98.194.195:8090/test/defnotice',
    method: 'post',
    data
  })
}

