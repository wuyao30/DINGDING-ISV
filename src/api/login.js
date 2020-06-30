import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: 'http://39.98.194.195:8090/token',
    method: 'post',
    data
  })
}
export function loginByCode(code) {
  return request({
    url: 'http://39.98.194.195:8090/token/enter',
    method: 'post',
    params: code
  })
}

export function logout() {
  return request({
    url: 'http://39.98.194.195:8090/token',
    method: 'delete'
  })
}

export function getUserInfo(token) {
  return request({
    url: 'http://39.98.194.195:8090/getinfo',
    method: 'get'
  })
}

export function getExamInfo(token) {
  return request({
    url: 'http://39.98.194.195:8090/exam/examinfo',
    method: 'get'
  })
}

export function getInfo(token, data) {
  return request({
    url: 'http://39.98.194.195:8090/exam/info',
    method: 'post',
    data
  })
}

export function getOneQuestionByID(token, data) {
  return request({
    url: 'http://39.98.194.195:8090/exam/quebyid',
    method: 'post',
    data
  })
}

export function getAllQuestionByID(token, data) {
  return request({
    url: 'http://39.98.194.195:8090/exam/questionbyid',
    method: 'post',
    data
  })
}

export function getExamDetailSingle(token, data) {
  return request({
    url: 'http://39.98.194.195:8090/exam/quebyexamid',
    method: 'post',
    data
  })
}

export function insertExample(token, data) {
  return request({
    url: 'http://39.98.194.195:8090/exam/insertexam',
    method: 'post',
    data
  })
}

export function deleteExam(token, data) {
  return request({
    url: 'http://39.98.194.195:8090/exam/deleteExam',
    method: 'post',
    data
  })
}

export function insertQue(token, data) {
  return request({
    url: 'http://39.98.194.195:8090/exam/insertque',
    method: 'post',
    data
  })
}

export function insertNotice(token, data) {
  return request({
    url: 'http://39.98.194.195:8090/test/notice',
    method: 'post',
    data
  })
}

export function updateNotice(token, data) {
  return request({
    url: 'http://39.98.194.195:8090/test/upnotice',
    method: 'post',
    data
  })
}

export function updateQue(token, data) {
  return request({
    url: 'http://39.98.194.195:8090/exam/updateque',
    method: 'post',
    data
  })
}

export function updateExam(token, data) {
  return request({
    url: 'http://39.98.194.195:8090/exam/updateexam',
    method: 'post',
    data
  })
}

export function getReport01(token, data) {
  return request({
    url: 'http://39.98.194.195:8090/test/page',
    method: 'post',
    data
  })
}

export function getNotice(token, data) {
  return request({
    url: 'http://39.98.194.195:8090/test/defnotice',
    method: 'post',
    data
  })
}

export function getNoticeType(token, data) {
  return request({
    url: 'http://39.98.194.195:8090/test/appnoticetype',
    method: 'post',
    data
  })
}

export function upLoadExecl(token, data) {
  return request({
    url: 'http://39.98.194.195:8090/file/modfile',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

export function downloadExecl(token, fileName) {
  const data = {
    fileName
  }
  return request({
    url: 'http://39.98.194.195:8090/file/download',
    method: 'post',
    headers: { 'Access-Control-Allow-Origin': '*' },
    responseType: 'blob',
    data
  })
}

export function upLoadNoticeFile(token, filename) {
  const data = {
    filename
  }
  return request({
    url: 'http://www.yixiaoshenghua.top:8080/xuzhou/file',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

export function Reader(token, data) {
  return request({
    url: 'http://39.98.194.195:8090/reader',
    method: 'post',
    data
  })
}

export function NoReader(token, data) {
  return request({
    url: 'http://39.98.194.195:8090/noreader',
    method: 'post',
    data
  })
}

export function ExamRead(token, data) {
  return request({
    url: 'http://39.98.194.195:8090/examread',
    method: 'post',
    data
  })
}

export function ExamNoRead(token, data) {
  return request({
    url: 'http://39.98.194.195:8090/examnoread',
    method: 'post',
    data
  })
}

export function querySwiper(token) {
  return request({
    url: 'http://39.98.194.195:8090/test/appswiper',
    method: 'get'
  })
}

export function deleteNotice(token, data) {
  return request({
    url: 'http://39.98.194.195:8090/test/deleteNotice',
    method: 'post',
    data
  })
}

export function getSurveyInfo() {
  return request({
    url: 'http://39.98.194.195:8090/survey/info',
    method: 'get'
  })
}

export function getSurveyDetail(id) {
  return request({
    url: 'http://39.98.194.195:8090/survey/surveyDetail',
    method: 'get',
    params: { id }
  })
}

export function insertSurvey(token, data) {
  return request({
    url: 'http://39.98.194.195:8090/survey/insert',
    method: 'post',
    data
  })
}

export function updateSurvey(token, data) {
  return request({
    url: 'http://39.98.194.195:8090/survey/update',
    method: 'post',
    data
  })
}

export function deleteSurveyById(token, id) {
  return request({
    url: 'http://39.98.194.195:8090/survey/delete',
    method: 'get',
    params: { id }
  })
}

export function getSurveyItemDetail(sid) {
  return request({
    url: 'http://39.98.194.195:8090/item/queryAll',
    method: 'get',
    params: { sid }
  })
}

export function getSurveyItemDetailById(id) {
  return request({
    url: 'http://39.98.194.195:8090/item/query',
    method: 'get',
    params: { id }
  })
}

export function insertSurveyItemDetail(data) {
  return request({
    url: 'http://39.98.194.195:8090/item/insert',
    method: 'post',
    data
  })
}

export function deleteSurveyItem(id) {
  return request({
    url: 'http://39.98.194.195:8090/item/delete',
    method: 'get',
    params: { id }
  })
}

export function querySurveyResult(sid) {
  return request({
    url: 'http://39.98.194.195:8090/survey/chart',
    method: 'get',
    params: { sid }
  })
}

export function queryAllSurvey() {
  return request({
    url: 'http://39.98.194.195:8090/survey/info',
    method: 'get'
  })
}

export function deleteQue(data) {
  return request({
    url: 'http://39.98.194.195:8090/exam/deleteque',
    method: 'post',
    data
  })
}
