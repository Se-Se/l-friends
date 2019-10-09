import cookies from 'js-cookie'
import axios from 'axios'
import applyUrlTemplate from './applyUrlTemplate'
import applyDefaultParams from './applyDefaultParams'
import {
  applyCacheResuest,
  applyCacheResponse
} from './cache'
import {
  applyResetElm
} from './applyResetElm'
import {
  logoutProcess,
  logoutRemoveCookie,
  isPC
} from '@/utils/utils'
import normalizeAxiosError, {
  SERVER_ERROR,
  TIMEOUT_ERROR,
  NETWORK_ERROR,
  CLIENT_ERROR,
  TOKEN_ERROR
} from './normalizeAxiosError'

import router from '@/router'
import {
  Alert
} from '@/components/common/modal'
// const platform = (function () {
//   const u = navigator.userAgent
//   // const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
//   const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
//   return isiOS ? 'IOS' : 'AOS'
// }())

const API_TIMEOUT = 30000 // 30s

const ncpApi = axios.create({
  baseURL: process.env.VUE_APP_NCP_API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'accessToken': cookies.get('ACCESS_TOKEN') || '',
    'clientId': process.env.VUE_APP_NCP_CLIENTID,
    'Version': '1.0',
    'platform': isPC() ? 'PC' : 'MOBILE_WEB',
    'guestToken': cookies.get('guestToken') || ''
  }
})
const codeSwitch = (err) => {
  switch (err.data.code) {
    case 'M0013':
      logoutProcess()
      break
    case 'CL013':
      router.go(-1)
      break
    case 'O0017':
      router.replace({
        path: '/order/getsheetno',
        query: router.app._route.query
      })
      break
    default:
      break
  }
  return Promise.reject(err)
}
ncpApi.interceptors.request.use(applyCacheResuest)
ncpApi.interceptors.request.use(applyUrlTemplate)
ncpApi.interceptors.request.use(applyDefaultParams)

ncpApi.interceptors.response.use(applyResetElm)
ncpApi.interceptors.response.use(applyCacheResponse)
ncpApi.interceptors.response.use(null, normalizeAxiosError)
ncpApi.interceptors.response.use(null, function (err) {
  if (err.code === TOKEN_ERROR) {
    logoutRemoveCookie()
    window.location.href = '/member/login'
  }
  if (err.code === TIMEOUT_ERROR || err.code === NETWORK_ERROR) {
    // store.commit('page/timeout')
  }
  if (err.code === SERVER_ERROR) {
    // store.commit('error...', err)
    if (router.app._route.query.isDebug !== 'true') {
      window.location.href = '/etc/dataerror'
    }
  }
  if (err.code === CLIENT_ERROR) {
    const noalert = ['M0013', 'M0005', 'M0017']

    // OrderSheet init max coupon error
    if (router.app._route.name === 'OrderSheet') {
      noalert.push('O3037')
      noalert.push('C2005')
    }
    if (router.app._route.name === 'Login') {
      noalert.push('M0019')
      noalert.push('M1003')
    }
    if (err.data.code === 'C2004') {
      return Alert('決済手段が制限されたクーポンを使用しました。 (使用可能決済手段、' + err.data.data + ')').then(() => {
      })
    }
    if (err.data.message && !noalert.some((item) => item === err.data.code)) {
      return Alert(err.data.message).then(() => {
        return codeSwitch(err)
      })
    } else {
      return codeSwitch(err)
    }
  }
  return Promise.reject(err)
})
export default ncpApi
