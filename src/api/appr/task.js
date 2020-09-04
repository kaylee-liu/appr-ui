import request from '@/router/axios'

const baseUserUrl = '/api/appr/appr/task-depart/'

export function fetchList (query) {
    return request({
      url: baseUserUrl + 'singleTaskAssessment',
      method: 'get',
      params: query
    })
  }
