import axios from 'axios'
import cookies from 'js-cookie'
import config from '@/config'
import applyUrlTemplate from './applyUrlTemplate'
import applyDefaultParams from './applyDefaultParams'
import { applyCacheResuest, applyCacheResponse } from './cache'
import normalizeAxiosError, {
  SERVER_ERROR,
  TIMEOUT_ERROR,
  NETWORK_ERROR,
  CLIENT_ERROR
} from './normalizeAxiosError'
import router from '@/router'
import { logoutRemoveCookie } from '@/utils/utils'
import { goUrl } from '@/utils/urlUtils'
import { getPrevOrderInfoInStoreage } from '@/utils/orderUtils'
import { Alert, Confirm } from '@/utils/event-bus'

const API_TIMEOUT = 30000 // 30s

const ncpApi = axios.create({
  baseURL: config.ncpApiBaseUrl,
  timeout: API_TIMEOUT,
  headers: {
    'accessToken': cookies.get('ncpAccessToken') || '',
    'clientId': config.ncpClientId,
    'Version': '1.0',
    'platform': config.platform,
    'guestToken': cookies.get('guestToken') || ''
  }
})

ncpApi.interceptors.request.use(applyCacheResuest)
ncpApi.interceptors.request.use(applyUrlTemplate)
ncpApi.interceptors.request.use(applyDefaultParams)

ncpApi.interceptors.response.use(applyCacheResponse)
ncpApi.interceptors.response.use(null, normalizeAxiosError)
ncpApi.interceptors.response.use(null, function (err) {
  console.log(err)
  // debugger
  if (err.code === TIMEOUT_ERROR || err.code === NETWORK_ERROR) {
    // soter.commit('error...', err)
  }
  if (err.code === SERVER_ERROR) {
    // soter.commit('error...', err)
    if (router.app._route.query.isDebug !== 'true') {
      // alert('NCP RESPONSE 에러 디자인적용필요')
      Alert({
        message: '라인프렌즈 고객센터 1544-5921로 문의 부탁드립니다.'
      })
      // window.location.href = '/etc/dataerror' develop
    }
  }
  if (err.code === CLIENT_ERROR) {
    /*
    M0005: 이메일 미 인증 / 로그인에서 처리
    MA0002: 이메일 인증이 잘못되거나 유효시간이 지난경우 / 인증완료 페이지에서 처리
     */
    const noalert = ['E0005', 'M0013', 'O0009', 'E9001', 'M0019', 'M0005', 'MA0002', 'I0007', 'A0006']
    if (!noalert.some(item => item === err.data.code)) {
      if (err.data.code === 'C1016') {
        // alert('쿠폰 코드를 다시 확인해 주세요.')
        Alert({
          message: '쿠폰 코드를 다시 확인해 주세요.'
        })
      } else if (err.data.code === 'C1011') {
        // alert('이미 발급 완료 된 쿠폰코드입니다. 쿠폰코드를 다시 확인해 주세요.')
        Alert({
          message: '이미 발급 완료 된 쿠폰코드입니다. 쿠폰코드를 다시 확인해 주세요.'
        })
      } else if (err.data.code === 'E0009') {
        // alert('선택하신 상품은 찜하기가 불가능한 상품입니다.')
        Alert({
          message: '선택하신 상품은 찜하기가 불가능한 상품입니다.'
        })
      } else if (err.data.code === 'O0016') {
        // alert('잘못된 주문정보 입니다.')
        Alert({
          message: '잘못된 주문정보 입니다.'
        })
        window.location.href = '/mypage/orderlist'
      } else if (err.data.code === 'CL904') {
        // alert('판매자 귀책사유로 인해 초도배송비가 발생합니다. 고객센터(1599-1246)를 통해 취소신청 해 주세요.')
        Alert({
          message: '판매자 귀책사유로 인해 초도배송비가 발생합니다. 고객센터(1599-1246)를 통해 취소신청 해 주세요.'
        })
      } else if (err.data.code === 'M0307' || err.data.code === 'PNPE001') {
        /*
        M0307 : 이메일인증 접근권한없음
        PNPE001 : 접근불가 상품
         */
        Alert({
          title: '알림',
          message: err.data.message,
          cancelRedirect: '/'
        })
      } else if (typeof err.data.code === 'undefined') {
        window.location.href = '/'
      } else if (err.data.code === 'E0006') {
        // alert('접근 불가한 페이지입니다.')
        Alert({
          message: '접근 불가한 페이지입니다.'
        })
      } else if (err.data.code === 'PPE0006') {
        Alert({
          message: err.data.message
        })
      } else {
        Alert({
          message: err.data.message,
          callback: () => {
            window.location.href = '/'
          }
        })
      }
    }
    const certify = `${location.protocol}//${location.host}/paycocertify?nxturl=${router.app._route.fullPath}`
    switch (err.data.code) {
      case 'M0012':
      case 'E0007': // UNAUTHORIZED
      case 'O7001': // UNAUTHORIZED
        router.push({
          path: '/member/login',
          query: {
            redirect: `${location.protocol}//${location.host}${router.app._route.fullPath}`
          }
        })
        break
      case 'E0008':
        const ncpCertificated = cookies.get('ncpCertificated')
        const ncpAdultCertificated = cookies.get('ncpAdultCertificated')
        if (ncpCertificated !== 'true') {
          window.location.href = config.paycoCertifyUrl(certify)
        } else if (ncpCertificated === 'true' && ncpAdultCertificated === 'false') {
          router.push({
            path: '/'
          })
        } else {
          router.push({
            path: '/'
          })
        }
        break
      case 'M0013': // AccessToken fail
        logoutRemoveCookie()
        goUrl('/')
        break
      case 'O3336':
        window.location.href = config.paycoCertifyUrl(certify)
        break
      case 'D0002':
        window.location.reload()
        break
      case 'M0030':
        router.push({
          path: '/member/agreement',
          query: {
            nxturl: `${location.protocol}//${location.host}${router.app._route.fullPath}`
          }
        })
        break
      case 'PNR001':
        Alert({
          message: err.data.message,
          callback: () => {
            router.replace('/')
          }
        })
        break
      case 'E9001':
        if (router.app._route.name !== 'Login') {
          router.push({
            path: '/pagenotfound'
          })
        }
        break
      case 'M0019':
        if (router.app._route.name === 'Login') {
          Alert({
            // title: '로그인',
            message: '아이디 또는 비밀번호를 잘못 입력하였거나 등록되지 않은 아이디입니다.<br/>(비밀번호 입력 10회 오류 시, 해당 아이디로 1분간 로그인하실 수 없습니다.)'
          })
        } else {
          Alert({
            message: '비밀번호가 맞지 않습니다.'
          })
        }
        break
      case 'M0305':
        Alert({
          title: '로그인',
          message: '로그인 시도 횟수를 초과했습니다.'
        })
        break
      default:
        break
    }
    /** ordersheet */
    // coupon
    // 이미 사용된 쿠폰을 사용하셨습니다.
    const codeparrten = /C2[0-9][0-9][0-9]/
    if (codeparrten.test(err.data.code) || err.data.code === 'C1020') {
      const searchid = router.app._route.query.searchProductID
      const productNo = router.app._route.query.productNo
      const tempArr = []
      if (searchid) {
        tempArr.push(`searchProductID=${searchid}`)
      }
      if (productNo) {
        tempArr.push(`productNo=${productNo}`)
      }
      let requestUrl = '/order/getsheetno'
      if (tempArr.length > 0) {
        requestUrl = requestUrl + '?' + tempArr.join('&')
      }
      const orderSheetNo = router.app._route.params.orderSheetNo
      const orderinfo = getPrevOrderInfoInStoreage(orderSheetNo)
      if (orderinfo) {
        window.localStorage.orderInfo = orderinfo
        window.location.replace(requestUrl)
      }
    }
    /******************************/
  }
  return Promise.reject(err)
})

export default ncpApi
