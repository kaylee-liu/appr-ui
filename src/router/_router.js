const _import = require('./_import')
export default [{
  path: '/',
  name: '主页',
  redirect: '/dashboard'
}, {
  path: '*',
  redirect: '/404',
  hidden: true
}, {
  path: '/login',
  name: '登录页',
  component: _import('login/index')
}, {
  path: '/lock',
  name: '锁屏页',
  component: _import('lock/index')
}, {
  path: '/404',
  component: _import('error-page/404', 'components'),
  name: '404'
}, {
  path: '/403',
  component: _import('error-page/403', 'components'),
  name: '403'
}, {
  path: '/500',
  component: _import('error-page/500', 'components'),
  name: '500'
},
// {
//   path: '/taskhall',
//   name: '任务大厅页',
//   component: () => import('@/views/taskhall/taskhall')
// },
// // {
//   path: '/taskhall',
//   name: '发布任务',
//   component: () => import('@/views/taskhall/TaskAnnouncement')
// },
// {
//   path: '/taskhall',
//   name: '我的任务',
//   component: () => import('@/views/taskhall/myTask')
// }
]
