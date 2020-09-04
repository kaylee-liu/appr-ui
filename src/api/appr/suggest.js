import request from '@/router/axios'
const baseUserUrl = '/api/appr/appr/suggest/'

//获取我添加的措施建议
export function suggestPage(query) {
    return request({
        url: baseUserUrl + 'myPage',
        method: 'get',
        params: query
    })
}

//获取我添加的措施建议
export function suggestPageList(query) {
    return request({
        url: baseUserUrl + 'pageList',
        method: 'get',
        params: query
    })
}

//新增措施建议
export function addSuggest(obj) {
    return request({
        url: baseUserUrl + 'addSuggest',
        method: 'post',
        data: obj
    })
}

//修改措施建议
export function updateSuggest(obj) {
    return request({
        url: baseUserUrl + 'updateSuggest',
        method: 'post',
        data: obj
    })
}

// 删除措施建议
export function deleteSuggest(id) {
    return request({
        url: baseUserUrl + 'deleteSuggest',
        method: 'post',
        data: { id: id }
    })
}

//  统计我的累积积分
export function getSuggestScore() {
    return request({
        url: baseUserUrl + 'getMyScore',
        method: 'get',
    })
}