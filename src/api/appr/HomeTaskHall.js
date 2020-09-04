import request from '@/router/axios'

const baseUserUrl = '/api/appr/appr/task/'

export function fetchList(query) {
  return request({
    url: baseUserUrl + 'list',
    method: 'get',
    params: query
  })
}

// 查询分页列表，与上面的区别是添加了关联查询
export function fetchPageList(query) {
  return request({
    url: baseUserUrl + 'pageList',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: baseUserUrl + 'releaseTask',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: baseUserUrl + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: baseUserUrl + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: baseUserUrl,
    method: 'put',
    data: obj
  })
}

// 获取参会人员列表
export function getParticipantList(query) {
  return request({
    url: baseUserUrl + 'participantList',
    method: 'get',
    params: query
  })
}

// 通过会议ID取任务列表
export function getTaskList(query) {
  return request({
    url: baseUserUrl + 'tasksId',
    method: 'get',
    params: query
  })
}

// 通过ID删除指定任务
export function deleteTask(id) {
  return request({
    url: baseUserUrl + 'deleteTask',
    method: 'get',
    params: { taskId: id }
  })
}

// 获取当前用户的任务累计分数
export function userTaskScoreSum() {
  return request({
    url: baseUserUrl + 'userTaskScoreSum',
    method: 'get',
  })
}