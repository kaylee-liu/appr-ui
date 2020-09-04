import request from '@/router/axios'

const baseUserUrl = '/api/appr/appr/score-standard/'

export function fetchList (query) {
  return request({
    url: baseUserUrl + 'list',
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

export function getObj (id) {
  return request({
    url: baseUserUrl + id,
    method: 'get'
  })
}

// 删除的时候后端默认是逻辑删除，物理删除需加上deleteFlag=1
export function delObj (id) {
  return request({
    url: baseUserUrl + id,
    method: 'delete',
    params: {
      deleleFlag: 1
    }
  })
}

export function putObj (obj) {
  return request({
    url: baseUserUrl,
    method: 'put',
    data: obj
  })
}

export function saveObj (obj) {
  return request({
    url: baseUserUrl + 'list',
    method: 'post',
    data: obj
  })
}