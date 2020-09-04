import request from '@/router/axios'

const baseUserUrl = '/api/appr/appr/conference/'

export function fetchList (query) {
    return request({
        url: baseUserUrl + 'list',
        method: 'get',
        params: query
    })
}