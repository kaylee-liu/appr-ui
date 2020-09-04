import request from '@/router/axios'

const baseUserUrl = '/api/appr/appr/apprworkresult/'

//  获取列表
export function getList(query) {
    return request({
        url: baseUserUrl + 'myList',
        method: 'get',
        params: query
    })
}

// 修改战果 
export function modify(obj) {
    return request({
        url: baseUserUrl + 'modify',
        method: 'put',
        data: obj
    })
}

// 新增战果
export function addWorkResult(obj) {
    return request({
        url: baseUserUrl + 'addWorkResult',
        method: 'POST',
        data: obj
    })
}

// 删除战果
export function removeItem(id) {
    return request({
        url: baseUserUrl + id,
        method: 'DELETE',
        data: {deleleFlag: 0}
    })
}

// 获取成果部门分组统计
export function locationCounts() {
    return request({
        url: baseUserUrl + 'resultLocationCounts',
        method: 'get'
    })
}

// 获取成果类型分组统计
export function typeCounts() {
    return request({
        url: baseUserUrl + 'resultTypeCounts',
        method: 'get'
    })
}