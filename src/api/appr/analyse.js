import request from '@/router/axios'

const baseUserUrl = '/api/appr/appr/analyse/'

//  统计数据共享总数
export function getDataShareCount() {
    return request({
        url: baseUserUrl + 'getDataShareCount',
        method: 'get',
    })
}

//  统计未完成任务总数
export function getNoFinishTaskCount() {
    return request({
        url: baseUserUrl + 'getNoFinishTaskCount',
        method: 'get',
    })
}

//  统计参与单位总数

export function getPartakeDeptCount() {
    return request({
        url: baseUserUrl + 'getPartakeDeptCount',
        method: 'get',
    })
}

//  统计任务总数

export function getTaskCount() {
    return request({
        url: baseUserUrl + 'getTaskCount',
        method: 'get',
    })
}

// 获取部门得分排行
export function getDeptScore() {
    return request({
        url: baseUserUrl + 'getDeptScore',
        method: 'get',
    })
}