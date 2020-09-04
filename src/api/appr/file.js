import request from '@/router/axios'
const baseUserUrl = '/api/appr/appr/file/'

// 下载文件
export function downloadFile (id) {
    return request({
      url: baseUserUrl + 'download/' + id,
      method: 'get',
      responseType: 'arraybuffer',
      headers: { 'filename': 'utf-8' },
    })
  }