import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: 'http://118.190.175.198:8081/token',
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
    url: 'http://118.190.175.198:8081/token',
    method: 'delete'
  })
}

export function getUserInfo(token) {
  return request({
    url: 'http://118.190.175.198:8081/getinfo',
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + token }
  })
}

export function getExamInfo(token) {
  return request({
    url: 'http://118.190.175.198:8081/exam/examinfo',
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + token }
  })
}

export function getInfo(token, data) {
  return request({
    url: 'http://118.190.175.198:8081/exam/info',
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + token },
    data
  })
}

export function getOneQuestionByID(token, data) {
  return request({
    url: 'http://118.190.175.198:8081/exam/quebyid',
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + token },
    data
  })
}

export function getAllQuestionByID(token, data) {
  return request({
    url: 'http://118.190.175.198:8081/exam/questionbyid',
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + token },
    data
  })
}

export function getExamDetailSingle(token, data) {
  return request({
    url: 'http://118.190.175.198:8081/exam/quebyexamid',
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + token },
    data
  })
}

export function insertExample(token, data) {
  return request({
    url: 'http://118.190.175.198:8081/exam/insertexam',
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + token },
    data
  })
}

export function deleteExam(token, data) {
  return request({
    url: 'http://118.190.175.198:8081/exam/deleteExam',
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + token },
    data
  })
}

export function insertQue(token, data) {
  return request({
    url: 'http://118.190.175.198:8081/exam/insertque',
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + token },
    data
  })
}

export function insertNotice(token, data) {
  return request({
    url: 'http://118.190.175.198:8081/F',
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + token },
    data
  })
}

export function updateNotice(token, data) {
  return request({
    url: 'http://118.190.175.198:8081/test/upnotice',
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + token },
    data
  })
}

export function updateQue(token, data) {
  return request({
    url: 'http://118.190.175.198:8081/exam/updateque',
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + token },
    data
  })
}

export function updateExam(token, data) {
  return request({
    url: 'http://118.190.175.198:8081/exam/updateexam',
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + token },
    data
  })
}

export function getReport01(token, data) {
  return request({
    url: 'http://118.190.175.198:8081/test/page',
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + token },
    data
  })
}

export function getNotice(token, data) {
  return request({
    url: 'http://118.190.175.198:8081/test/defnotice',
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + token },
    data
  })
}

export function getNoticeType(token, data) {
  return request({
    url: 'http://118.190.175.198:8081/test/appnoticetype',
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + token },
    data
  })
}

export function upLoadExecl(token, data) {
  return request({
    url: 'http://118.190.175.198:8081/file/modfile',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + token },
    data
  })
}

export function downloadExecl(token, fileName) {
  const data = {
    fileName
  }
  return request({
    url: 'http://118.190.175.198:8081/file/download',
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + token, 'Access-Control-Allow-Origin': '*' },
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
    headers: { 'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + token },
    data
  })
}

export function Reader(token, data) {
  return request({
    url: 'http://118.190.175.198:8081/reader',
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + token },
    data
  })
}

export function NoReader(token, data) {
  return request({
    url: 'http://118.190.175.198:8081/noreader',
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + token },
    data
  })
}

export function ExamRead(token, data) {
  return request({
    url: 'http://118.190.175.198:8081/examread',
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + token },
    data
  })
}

export function ExamNoRead(token, data) {
  return request({
    url: 'http://118.190.175.198:8081/examnoread',
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + token },
    data
  })
}

export function querySwiper(token) {
  return request({
    url: 'http://118.190.175.198:8081/test/appswiper',
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + token }

  })
}

export function deleteNotice(token, data) {
  return request({
    url: 'http://118.190.175.198:8081/test/deleteNotice',
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + token },
    data
  })
}

export function getSurveyInfo() {
  return request({
    url: 'http://118.190.175.198:8081/survey/info',
    method: 'get'
  })
}

export function getSurveyDetail(id) {
  return request({
    url: 'http://118.190.175.198:8081/survey/surveyDetail',
    method: 'get',
    params: { id }
  })
}

export function insertSurvey(token, data) {
  return request({
    url: 'http://118.190.175.198:8081/survey/insert',
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + token },
    data
  })
}

export function updateSurvey(token, data) {
  return request({
    url: 'http://118.190.175.198:8081/survey/update',
    method: 'post',
    headers: { 'Authorization': 'Bearer ' + token },
    data
  })
}

export function deleteSurveyById(token, id) {
  return request({
    url: 'http://118.190.175.198:8081/survey/delete',
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + token },
    params: { id }
  })
}

export function getSurveyItemDetail(sid) {
  return request({
    url: 'http://118.190.175.198:8081/item/queryAll',
    method: 'get',
    // headers: { 'Authorization': 'Bearer ' + token },
    params: { sid }
  })
}

export function getSurveyItemDetailById(id) {
  return request({
    url: 'http://118.190.175.198:8081/item/query',
    method: 'get',
    // headers: { 'Authorization': 'Bearer ' + token },
    params: { id }
  })
}

export function insertSurveyItemDetail(data) {
  return request({
    url: 'http://118.190.175.198:8081/item/insert',
    method: 'post',
    // headers: { 'Authorization': 'Bearer ' + token },
    data
  })
}

export function deleteSurveyItem(id) {
  return request({
    url: 'http://118.190.175.198:8081/item/delete',
    method: 'get',
    // headers: { 'Authorization': 'Bearer ' + token },
    params: { id }
  })
}

export function querySurveyResult(sid) {
  return request({
    url: 'http://118.190.175.198:8081/survey/chart',
    method: 'get',
    // headers: { 'Authorization': 'Bearer ' + token },
    params: { sid }
  })
}

export function queryAllSurvey() {
  return request({
    url: 'http://118.190.175.198:8081/survey/info',
    method: 'get'
    // headers: { 'Authorization': 'Bearer ' + token },
  })
}

export function deleteQue(data) {
  return request({
    url: 'http://localhost:8081/exam/deleteque',
    method: 'post',
    data
  })
}
