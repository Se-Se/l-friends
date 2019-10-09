import { isLogin, isPC } from '@/utils/utils'
import cookies from 'js-cookie'
export function pc2Mo (to, from, next) {
  let viewMode = cookies.get('view_mode') || '' // footer pc/mo 버전
  let isSP = viewMode !== 'PC' && !isPC()
  if (isSP && (to.fullPath.indexOf('/m/') === -1 && to.fullPath !== '/m')) {
    if (to.fullPath.indexOf('/member/join/complete') > -1) {
      window.location.replace('/m' + to.fullPath)
    } else {
      window.location.replace(`/m`)
    }
  } else {
    next()
  }
}

export function checkLogin (to, from, next) {
  if (to.meta.needAuth && !isLogin()) {
    next({
      path: '/member/login',
      query: {
        redirect: to.fullPath
      }
    })
  } else {
    next()
  }
}
