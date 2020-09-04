import request from '@/router/axios'

const baseUserUrl = '/api/appr/appr/'



export function fetchInfo (query) {
    return request({
        url: baseUserUrl + 'conference/' + query,
        method: 'get',
    })
}

export function postFetch (obj) {
    return request({
        url: baseUserUrl + 'task/report',
        method: 'post',
        data: obj
    })
}