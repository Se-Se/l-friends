import { createNcpApiStore } from '@/api'
import { logoutRemoveCookie, setCookie, removeCookie } from '@/utils/utils'
import ncpApi from '@/api/ncpApi'
import router from '@/router'

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

export default {
  namespaced: true,
  mixins: [apiStore],
  actions: {
    async logoutToLogin ({ state, commit, dispatch }) {
      await dispatch('delToken')
      logoutRemoveCookie()
      window.location.href = '/'
    },
    async logout ({ state, commit, dispatch }) {
      await dispatch('delToken')
      logoutRemoveCookie()
      window.location.href = '/'
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
          setCookie('ACCESS_TOKEN', state.normalLogin.accessToken, state.normalLogin.expireIn)
          ncpApi.defaults.headers.accessToken = state.normalLogin.accessToken
        }
        return res
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
          setCookie('ACCESS_TOKEN', response.data.accessToken, response.data.expireIn)
          ncpApi.defaults.headers.accessToken = response.data.accessToken
          dispatch('_getSnsMember').then((response) => {
            if (response.data.memberStatus === 'WAITING') {
              removeCookie('ACCESS_TOKEN')
              alert('連携されたアカウントがありません。会員登録後ご利用ください。')
              router.push({ path: '/member/join' })
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
