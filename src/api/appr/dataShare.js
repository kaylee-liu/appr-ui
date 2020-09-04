import request from '@/router/axios'
const baseUserUrl = '/api/appr/appr/dataShare/'

//获取我添加的共享文件
export function myPage(query) {
    return request({
        url: baseUserUrl + 'myPage',
        method: 'get',
        params: query
    })
}

//获取我添加的共享文件
export function pageList(query) {
    return request({
        url: baseUserUrl + 'pageList',
        method: 'get',
        params: query
    })
}

//新增共享文件
export function addDataShare(obj) {
    return request({
        url: baseUserUrl + 'addDataShare',
        method: 'post',
        data: obj
    })
}

//修改共享文件
export function updateDataShare(obj) {
    return request({
        url: baseUserUrl + 'updateDataShare',
        method: 'post',
        data: obj
    })
}

// 删除共享文件
export function deleteDataShare(id) {
    return request({
        url: baseUserUrl + 'deleteDataShare',
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