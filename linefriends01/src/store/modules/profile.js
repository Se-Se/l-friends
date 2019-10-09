import { createNcpApiStore } from '@/api'
import cookies from 'js-cookie'
import ncpApi from '@/api/ncpApi'
import config from '@/config'

const apiStore = createNcpApiStore([
  {
    action: '_signUp',
    property: 'profile',
    path: 'profile',
    method: 'post'
  },
  {
    action: '_fetch',
    property: 'profile',
    path: 'profile',
    method: 'get'
  },
  {
    action: '_signUpOpenid',
    property: 'profile',
    path: 'profile/openid',
    method: 'post'
  },
  {
    action: '_delProfile',
    property: 'delResult',
    path: 'profile',
    method: 'delete'
  },
  {
    action: '_syncProfile',
    property: 'sync',
    path: 'profile/payco/sync',
    method: 'put'
  },
  {
    action: '_checkPassword',
    path: 'profile/check-password',
    method: 'post'
  },
  {
    action: '_updatePassword',
    path: 'profile/password',
    method: 'put'
  },
  {
    action: '_updateProfile',
    property: 'profile',
    path: 'profile',
    method: 'put'
  },
  {
    action: '_linkOpenId',
    path: 'profile/link-openid',
    method: 'post'
  },
  {
    action: '_sendingEmailWithUrl',
    property: 'sendingEmailWithUrl',
    path: 'profile/password/sending-email-with-url',
    method: 'put'
  },
  {
    action: '_certificatedByEmail',
    property: 'certificatedByEmail',
    path: 'profile/password/no-authentication/certificated-by-email',
    method: 'put'
  }
])

export default {
  namespaced: true,
  mixins: [apiStore],
  actions: {
    async signUp ({ commit, dispatch, rootState }, payload) {
      let nickNameArr = ['브라운', '코니', '샐리', '초코', '문']
      payload.memberName = nickNameArr[Math.floor(Math.random() * nickNameArr.length)]
      await dispatch('_signUp', { data: payload })
    },
    async memberStatusChange ({ commit, dispatch, state, rootState }, shopAdChecked) {
      if (rootState.memberStatus !== 'ACTIVE') {
        const requestBody = shopAdChecked ? {
          directMailAgreed: true,
          smsAgreed: true
        } : { nodata: '' }
        await dispatch('_signUpOpenid', { data: requestBody })
      }
      // await dispatch('_syncProfile')
      await dispatch('memberFetch')
    },
    async memberFetch ({ commit, dispatch, state, route, rootGetters }) {
      if (cookies.get('ncpAccessToken') && cookies.get('ncpAccessToken').length > 0) {
        await dispatch('_fetch')
        cookies.set('ncpMemberId', state.profile.memberId)
        cookies.set('ncpOauthIdNo', state.profile.oauthIdNo)
        cookies.set('memberStatus', state.profile.memberStatus)
        cookies.set('ncpCertificated', state.profile.principalCertificated)
        cookies.set('memberName', state.profile.memberName)
      }
    },
    async delProfile ({ commit, dispatch, state }, { reason }) {
      await dispatch('_delProfile', { params: { reason: reason || '회원 탈퇴' } })
    },
    async updateProfile ({ commit, dispatch, state }, { memberName, smsAgreed, directMailAgreed }) {
      await dispatch('_updateProfile', { data: { memberName, smsAgreed, directMailAgreed } })
    },
    async getProfileForAceTM ({ commit, dispatch, state }) {
      let ace = {
        uID: '',
        uAge: 0,
        uGender: ''
      }
      if (cookies.get('ncpAccessToken') && cookies.get('ncpAccessToken').length > 0) {
        await dispatch('_fetch')
        ace.uID = state.profile.oauthIdNo
        ace.uAge = state.profile.birthday ? new Date().getFullYear() - state.profile.birthday.substr(0, 4) : 0
        if (state.profile.sex === 'M') {
          ace.uGender = 'man'
        } else {
          ace.uGender = 'woman'
        }
      }
      return ace
    },
    async updatePassword ({ commit, dispatch, state }, { currentPassword, newPassword }) {
      ncpApi.defaults.headers.Version = '1.1'
      await dispatch('_updatePassword', {
        data: {
          currentPassword: currentPassword,
          newPassword: newPassword
        }
      })
      ncpApi.defaults.headers.Version = '1.0'
    },
    async checkPassword ({ commit, dispatch, state }, password) {
      return dispatch('_checkPassword', {
        data: { password: password }
      })
    },
    async sendingEmailWithUrl ({ commit, dispatch, state }, params) {
      return dispatch('_sendingEmailWithUrl', { data: { memberId: params.memberId, url: params.url } })
    },
    async certificatedByEmail ({ commit, dispatch, state }, params) {
      return dispatch('_certificatedByEmail', { data: { certificationNumber: params.certificationNumber, memberId: params.memberId, newPassword: params.newPassword } })
    }
  },
  getters: {
    getConnectSns (state) {
      if (state.profile && state.profile.providerTypes) {
        return {
          naver: (state.profile.providerTypes.indexOf('NAVER') !== -1) ? 'ing' : '',
          line: (state.profile.providerTypes.indexOf('LINE') !== -1) ? 'ing' : '',
          facebook: (state.profile.providerTypes.indexOf('FACEBOOK') !== -1) ? 'ing' : ''
        }
      } else {
        return {
          naver: '',
          line: '',
          facebook: ''
        }
      }
    },
    memberId () {
      return cookies.get('ncpMemberId')
    },
    memberName (state) {
      if (state.profile) {
        if (state.profile.memberName) {
          return state.profile.memberName
        } else {
          let nickNameArr = ['브라운', '코니', '샐리', '초코', '문']
          return nickNameArr[Math.floor(Math.random() * nickNameArr.length)]
        }
      }
    },
    isExec (state) {
      if (state.profile) {
        for (const group of state.profile.memberGroups) {
          if (config.executives.includes(String(group.memberGroupNo))) {
            return true
          }
        }
      }
      return false
    },
    isSaleExec (state) {
      return state.profile && state.profile.memberGroups.length > 0
    },
    boardInquireInfo (state) {
      if (state.profile) {
        const memberInfo = {}
        let memberId = state.profile.memberId
        let telephoneNo = state.profile.telephoneNo
        if (memberId) {
          memberInfo.memberId = memberId
        }
        if (telephoneNo) {
          if (telephoneNo.indexOf('-') > -1) {
            let telephoneArry = telephoneNo.split('-')
            memberInfo.telephoneNo1 = telephoneArry[0]
            memberInfo.telephoneNo2 = telephoneArry[1]
            memberInfo.telephoneNo3 = telephoneArry[2]
            memberInfo.telephoneNoflg = true
          }
        } else {
          memberInfo.telephoneNoflg = false
        }
        return memberInfo
      }
    }
  }
}
