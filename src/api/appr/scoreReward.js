import request from '@/router/axios'

const baseUserUrl = '/api/appr/appr/scoreReward/'

export function fetchList(query) {
    return request({
        url: baseUserUrl + 'pageList',
        method: 'get',
        params: query
    })
}


export function addObj(obj) {
    return request({
        url: baseUserUrl + 'addScoreReward',
        method: 'post',
        data: obj
    })
}

export function putObj(obj,id) {
    return request({
        url: baseUserUrl + id,
        method: 'put',
        data: obj
    })
}

export function delObj(id) {
    return request({
        url: baseUserUrl + "deleteScoreReward",
        method: 'post',
        data: {
            id : id
        }
    })
}