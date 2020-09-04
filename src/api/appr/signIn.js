import request from '@/router/axios'
const baseUserUrl = '/api/appr/appr/sign-in/'


// 获取当前用户是否签到
export function isSignIn() {
    return request({
        url: baseUserUrl + 'isSignIn',
        method: 'get',
    })
}

// 当前用户签到
export function signIn() {
    return request({
        url: baseUserUrl + 'signIn',
        method: 'get',
    })
}

// 获取当前用户签到累计积分
export function signInScore() {
    return request({
        url: baseUserUrl + 'signInScore',
        method: 'get',
    })
}