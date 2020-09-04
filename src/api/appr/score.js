import request from '@/router/axios'

const baseUserUrl = '/api/appr/appr/score/'

// 获取当前用户的二维码信息
export function getUserCode(query) {
    return request({
        url: baseUserUrl + 'getUserCode',
        method: 'get',
        params: query
    })
}

// 获取当前用户总积分
export function getMyScoreAll() {
    return request({
        url: baseUserUrl + 'getMyScoreAll',
        method: 'get',
    })
}

export function scoreList () {
    return request({
        url: baseUserUrl + 'getMyScoreList',
        method: 'get'
    })
}

// 获取积分排名前100名用户
export function personScoreList () {
    return request({
        url: baseUserUrl + 'getPersonScoreList',
        method: 'get',
    })
}