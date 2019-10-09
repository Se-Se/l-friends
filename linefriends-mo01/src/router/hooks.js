import { isLogin, isPC } from '@/utils/utils'
import cookies from 'js-cookie'
export function moToPc (to, from, next) {
  let viewMode = cookies.get('view_mode') || '' // footer pc/mo 버전
  let _isPC = viewMode !== 'SP' && isPC()
  if (_isPC && to.fullPath.indexOf('/m/') > -1) {
    if (to.fullPath.indexOf('/m/member/join/complete') > -1) {
      window.location.replace(to.fullPath.replace('/m/', '/'))
    } else {
      window.location.replace(`/`)
    }
  } else {
    next()
  }
}

export function checkLogin (to, from, next) {
  if (to.meta.needAuth && !isLogin()) {
    next({
      path: '/m/member/login',
      query: {
        redirect: to.fullPath
      }
    })
  } else {
    next()
  }
}
