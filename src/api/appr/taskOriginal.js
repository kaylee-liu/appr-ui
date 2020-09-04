import request from '@/router/axios'

const baseUserUrl = '/api/appr/appr/task/'

export function fetchList (query) {
  return request({
    url: baseUserUrl + 'list',
    method: 'get',
    params: query
  })
}

// 比fetchList能查询更多的字段
export function pageList (query) {
  return request({
    url: baseUserUrl + 'pageList',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: baseUserUrl,
    method: 'post',
    data: obj
  })
}

// 添加任务并获取任务信息
export function addTask (obj) {
  return request({
    url: baseUserUrl + 'addTask',
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

// 通过任务ID取DTO
export function getTaskDTO (id) {
  return request({
    url: baseUserUrl + 'getTaskDTO',
    method: 'get',
    params: {taskId: id}
  })
}

// 打分
export function markTask (obj) {
  return request({
    url: baseUserUrl + 'markTask',
    method: 'POST',
    data: obj
  })
}
