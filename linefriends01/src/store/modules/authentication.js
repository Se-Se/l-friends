import { createNcpApiStore, createPinkdiaryApiStore } from '@/api'
import axios from 'axios'
import cookies from 'js-cookie'
import config from '@/config/index'
import { logoutRemoveCookie } from '@/utils/utils'
import ncpApi from '@/api/ncpApi'
import router from '@/router'
import { Alert } from '@/utils/event-bus'

const apiStore = createNcpApiStore([
  {
    action: '_getSnsLoginUrl',
    property: 'getSnsLoginUrl',
    path: 'oauth/login-url',
    method: 'get'
  },
  {
    action: '_openid',
    property: 'openid',
    path: 'oauth/openid',
    method: 'get'
  },
  {
    action: 'token',
    property: 'token',
    path: 'openid/token'
  },
  {
    action: 'delToken',
    property: 'result',
    path: 'oauth/token',
    method: 'delete'
  },
  {
    action: '_sendMailCode',
    path: 'authentications/email',
    method: 'post'
  },
  {
    action: '_confirmMailCode',
    path: 'authentications/email',
    method: 'get'
  },
  {
    action: '_passwordMailCode',
    path: 'authentications/email',
    method: 'get'
  },
  {
    action: '_normalLogin',
    property: 'normalLogin',
    path: 'oauth/token',
    method: 'post'
  },
  {
    action: '_getSnsMember',
    property: 'getSnsMember',
    path: 'profile',
    method: 'get'
  },
  {
    action: '_linkOpenId',
    property: 'linkOpenId',
    path: 'profile/link-openid',
    method: 'post'
  },
  {
    action: '_unlinkOpenId',
    property: 'unlinkOpenId',
    path: 'profile/link-openid',
    method: 'delete'
  }
])

const pinkApiStore = createPinkdiaryApiStore([
  {
    action: 'getShopAgreement',
    property: 'shopAgreement',
    path: 'shopAgreementDate.jsp'
  },
  {
    action: 'postShopAgreement',
    property: 'result',
    path: 'shopAgreementDate.jsp',
    method: 'post'
  },
  {
    action: 'delShopAgreement',
    property: 'result',
    path: 'shopAgreementDate.jsp',
    method: 'delete'
  },

  {
    action: 'getAdPushAgreement',
    property: 'adPushAgreement',
    path: 'shopAdPushAgreementDate.jsp'
  },
  {
    action: 'postAdPushAgreement',
    property: 'result',
    path: 'shopAdPushAgreementDate.jsp',
    method: 'post'
  },
  {
    action: '_delAdPushAgreement',
    property: 'delAdPushAgreement',
    path: 'shopAdPushAgreementDate.jsp',
    method: 'delete'
  }
])

export default {
  namespaced: true,
  mixins: [apiStore, pinkApiStore],
  actions: {
    async logoutToLogin ({ state, commit, dispatch }) {
      // await dispatch('delToken')
      logoutRemoveCookie()
      window.location.href = '/'
    },
    async logout ({ state, commit, dispatch }) {
      await dispatch('delToken')
      logoutRemoveCookie()
      window.location.href = '/'
    },
    // shopAgreement
    async fetchShopAgreement ({ state, commit, dispatch }) {
      await dispatch('getShopAgreement', { params: { uuid: cookies.get('ncpOauthIdNo') } })
      await cookies.set('ncpMemberAgree', state.shopAgreement.isAgree)
    },
    async setShopAgreementY ({ state, commit, dispatch }) {
      const uuid = cookies.get('ncpOauthIdNo')
      const url = `${config.pinkdiaryApiBaseUrl}shopAgreementDate.jsp?uuid=${uuid}`
      const res = await axios.post(url)
      if (res.data.result.status === 0) {
        cookies.set('ncpMemberAgree', 'Y')
      }
      return res
      // return dispatch('postShopAgreement', { params: { uuid: cookies.get('ncpOauthIdNo') } })
    },
    async setShopAgreementN ({ state, commit, dispatch }) {
      await dispatch('delShopAgreement', { params: { uuid: cookies.get('ncpOauthIdNo') } })
      if (state.result.result.status === 0) {
        cookies.set('ncpMemberAgree', 'N')
      }
    },
    fetchAdPushAgreement ({ state, commit, dispatch }) {
      return dispatch('getAdPushAgreement', { params: { uuid: cookies.get('ncpOauthIdNo') } })
    },
    setShopAdpushY ({ state, commit, dispatch }) {
      const uuid = cookies.get('ncpOauthIdNo')
      const url = `${config.pinkdiaryApiBaseUrl}shopAdPushAgreementDate.jsp?uuid=${uuid}`
      const res = axios.post(url)
      return res
      // return dispatch('postAdPushAgreement', { params: { uuid: cookies.get('ncpOauthIdNo') } })
    },
    setShopAdpushN ({ state, commit, dispatch }) {
      return dispatch('delAdPushAgreement', { params: { uuid: cookies.get('ncpOauthIdNo') } })
    },
    sendMailCode ({ state, commit, dispatch, rootState }, params) {
      return dispatch('_sendMailCode', { data: { email: params.email, uri: params.uri, usage: 'JOIN_URI' } })
    },
    confirmMailCode ({ state, commit, dispatch, rootState }, params) {
      return dispatch('_confirmMailCode', { params: { email: params.email, certificatedNumber: params.cn, usage: 'JOIN_URI' } }).catch(e => {
        return e.data.code
      })
    },
    passwordMailCode ({ state, commit, dispatch, rootState }, params) {
      return dispatch('_passwordMailCode', { params: { email: params.email, certificatedNumber: params.cn, usage: 'FIND_PASSWORD' } }).catch(e => {
        return e.data.code
      })
    },
    async normalLogin ({ state, commit, dispatch, rootState }, { memberId, password }) {
      return dispatch('_normalLogin', { data: { memberId: memberId, password: password } }).then((res) => {
        if (state.normalLogin.accessToken) {
          cookies.set('ncpAccessToken', state.normalLogin.accessToken, { 'max-age': state.normalLogin.expireIn })
          ncpApi.defaults.headers.accessToken = state.normalLogin.accessToken
        }
        return res
      }).catch(e => {
        return e.data.code
      })
    },
    getSnsLoginUrl ({ state, commit, dispatch, rootState }, params) {
      return dispatch('_getSnsLoginUrl', { params: { provider: params.provider, redirectUri: params.redirectUri, state: params.state } })
    },
    async getSnsAccessToken ({ state, commit, dispatch, rootGetters }, params) {
      await dispatch('_openid', { params: { provider: params.provider, redirectUri: params.redirectUri, code: params.code, state: params.state } }).then((response) => {
        if (params.type === 'connect') {
          dispatch('_linkOpenId', {
            data: { accessToken: response.data.accessToken }
          }).then((response) => {
            router.push({ path: '/mypage/profile' })
          })
        } else {
          cookies.set('ncpAccessToken', response.data.accessToken, {'max-age': response.data.expireIn})
          ncpApi.defaults.headers.accessToken = response.data.accessToken
          dispatch('_getSnsMember').then((response) => {
            if (response.data.memberStatus === 'WAITING') {
              cookies.remove('ncpAccessToken')
              Alert({
                message: '연결된 계정이 없습니다. 회원가입후 이용해주세요.'
              })
              // alert('연결된 계정이 없습니다. 회원가입후 이용해주세요.')
              router.replace({path: '/member/join'})
            } else {
              location.href = '/'
            }
          })
        }
      })
    }
  },
  mutations: {
  }
}
