// 网关地址
// const GATEWAY_HOST = process.env.GATEWAY_HOST || '106.38.121.115'
// const GATEWAY_HOST = process.env.GATEWAY_HOST || '172.16.124.153' //大国IP
// const GATEWAY_HOST = process.env.GATEWAY_HOST || '59.212.147.32' //内网服务器
// const GATEWAY_HOST = process.env.GATEWAY_HOST || '59.212.147.83' //正式服务器
const GATEWAY_HOST = process.env.GATEWAY_HOST || 'xin1747.eicp.net'
const GATEWAY_PORT = process.env.GATEWAY_PORT || '8000'

// 转发配置
module.exports = {
  proxyList: {
    '/api': {
      // target: 'http://' + GATEWAY_HOST + ':' + GATEWAY_PORT,
      target: 'http://' + GATEWAY_HOST,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api'
      }
    }
  }
}
