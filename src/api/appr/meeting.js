import request from '@/router/axios'
const baseUserUrl = '/api/appr/appr/meeting/'

//获取我添加的例会列表
export function myPage(query) {
    return request({
        url: baseUserUrl + 'myPage',
        method: 'get',
        params: query
    })
}

export function pageList(query) {
    return request({
        url: baseUserUrl + 'pageList',
        method: 'get',
        params: query
    })
}

//新增例会
export function addMeeting(obj) {
    return request({
        url: baseUserUrl + 'addMeeting',
        method: 'post',
        data: obj
    })
}

//修改例会
export function updateMeeting(obj) {
    return request({
        url: baseUserUrl + 'updateMeeting',
        method: 'post',
        data: obj
    })
}

// 删除共享文件
export function deleteMeeting(id) {
    return request({
        url: baseUserUrl + 'deleteMeeting',
        method: 'post',
        data: { id: id }
    })
}

//  统计我的累积积分
export function getMyScore() {
    return request({
        url: baseUserUrl + 'getMyScore',
        method: 'get',
    })
}

// 设置自动评分
export function fitAutoScore(query) {
    return request({
        url: baseUserUrl + 'fitAutoScore',
        method: 'get',
        params: query
    })
}


// 获取自动评分
export function getAutoScore() {
    return request({
        url: baseUserUrl + 'getAutoScore',
        method: 'get',
    })
}