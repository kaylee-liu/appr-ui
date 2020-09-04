import request from '@/router/axios'

const baseUserUrl = '/api/appr/appr/conference-room/'

export function fetchList (query) {
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

export function putObj (obj,id) {
  return request({
    url: baseUserUrl + id,
    method: 'put',
    data: obj
  })
}

export function verifyAvailable (roomId, startTime, endTime){
  return request({
    url: baseUserUrl + 'verifyAvailable',
    method: 'post',
    params: {
      roomId: roomId,
      startTime: startTime,
      endTime: endTime
    }
  })
}
