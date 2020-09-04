import request from '@/router/axios'

const baseUserUrl = '/api/appr/appr/assess/'

// 查询分页列表
export function fetchPageList (query) {
    return request({
        url: baseUserUrl + 'pageList',
        method: 'get',
        params: query
    })
}

// 新增一条评估
export function addAssess (obj) {
    return request({
        url: baseUserUrl + 'addAssess',
        method: 'post',
        data: obj
    })
}

// 修改一条评估
export function updateAssess (obj) {
    return request({
        url: baseUserUrl + 'updateAssess',
        method: 'post',
        data: obj
    })
}

// 删除一条评估
export function deleteAssess (id) {
    return request({
        url: baseUserUrl + 'deleteAssess/' + id,
        method: 'post',
    })
}