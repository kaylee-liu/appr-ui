import request from '@/router/axios'

const baseUserUrl = '/api/appr/appr/conference/'

export function fetchList (query) {
  return request({
    url: baseUserUrl + 'list',
    method: 'get',
    params: query
  })
}
// 查询分页列表，与上面的区别是添加了许多关联查询
export function fetchPageList (query) {
  return request({
    url: baseUserUrl + 'pageList',
    method: 'get',
    params: query
  })
}

// 查询我的任务分页列表
export function fetchPersonalList (query) {
  return request({
    url: baseUserUrl + 'pageList',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: baseUserUrl + 'addConference',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: baseUserUrl + id,
    method: 'get'
  })
}

export function delObj (id) {
  return request({
    url: baseUserUrl + id,
    method: 'delete'
  })
}

export function putObj (obj) {
  return request({
    url: baseUserUrl,
    method: 'put',
    data: obj
  })
}

// 获取参会人员列表
export function getParticipantList (query) {
  return request({
    url: baseUserUrl + 'participantList',
    method: 'get',
    params: query
  })
}

// 保存会议记录
export function saveRecord (record) {
  return request({
    url: baseUserUrl + 'saveRecord',
    method: 'post',
    params: {'record': record}
  })
}


export function cancel (id) {
  return request({
    url: baseUserUrl + 'cancel',
    method: 'post',
    params: {'conferenceId': id}
  })
}

// 更改会议状态
export function changeStatus (obj) {
  return request({
    url: baseUserUrl + 'changeConferenceStatus',
    method: 'post',
    params: obj
  })
}

// 
export function getConferenceInfo (id) {
  return request({
    url: baseUserUrl + 'conferenceInfo/' + id,
    method: 'get',
  })
}

// 修改参会意愿
export function setIsAble (obj) {
  return request({
    url: baseUserUrl + 'setIsAble',
    method: 'post',
    params: obj
  })
}