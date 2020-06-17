import request from '@/utils/request'

export function insertNotice(data) {
  return request({
    url: '/test/notice',
    method: 'post',
    data
  })
}

export function getNotice(data) {
  return request({
    url: '/test/defnotice',
    method: 'post',
    data
  })
}

