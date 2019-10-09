import { createNcpApiStore } from '@/api'
import { isLogin, logoutProcess } from '@/utils/utils'

const apiStore = createNcpApiStore([
  {
    action: '_fetch',
    property: 'profile',
    path: 'profile',
    method: 'get'
  },
  {
    action: '_emailExits',
    property: 'emailExits',
    path: 'profile/id/exist?memberId={memberId}',
    pathParams: ['memberId'],
    method: 'get'
  },
  {
    action: '_signUp',
    property: 'profile',
    path: 'profile',
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
    action: '_delProfile',
    property: 'delResult',
    path: 'profile',
    method: 'delete'
  },
  {
    action: '_fetchProfileNonMasking',
    property: 'profileNonMasking',
    path: 'profile/non-masking',
    method: 'post'
  }
])

export default {
  namespaced: true,
  mixins: [apiStore],
  actions: {
    async memberFetch ({ commit, dispatch, state, route, rootGetters }) {
      if (isLogin()) {
        await dispatch('_fetch').catch((e) => {
          if (e.data.code === 'M0017') {
            logoutProcess()
          }
        })
      }
    },
    emailExits ({ state, commit, dispatch }, memberId) {
      return dispatch('_emailExits', { params: { memberId } })
    },
    async signUp ({ commit, dispatch, rootState }, payload) {
      // let nickNameArr = ['브라운', '코니', '샐리', '초코', '문']
      // payload.memberName = nickNameArr[Math.floor(Math.random() * nickNameArr.length)]
      await dispatch('_signUp', { data: payload })
    },
    async sendingEmailWithUrl ({ commit, dispatch, state }, params) {
      return dispatch('_sendingEmailWithUrl', { data: { memberId: params.memberId, url: params.url } })
    },
    async certificatedByEmail ({ commit, dispatch, state }, params) {
      return dispatch('_certificatedByEmail', { data: { certificationNumber: params.certificationNumber, memberId: params.memberId, newPassword: params.newPassword } })
    },
    async checkPassword ({ commit, dispatch, state }, password) {
      return dispatch('_checkPassword', {
        data: { password: password }
      })
    },
    async updatePassword ({ dispatch }, { currentPassword, newPassword }) {
      await dispatch('_updatePassword', { data: { currentPassword, newPassword, willChangeNextTime: false } })
    },
    async updateProfile ({ commit, dispatch, state }, { nickname, directMailAgreed, birthday, mobileNo }) {
      await dispatch('_updateProfile', { data: { nickname, directMailAgreed, birthday, mobileNo } })
    },
    async delProfile ({ commit, dispatch, state }, { reason }) {
      await dispatch('_delProfile', { params: { reason: reason || '退会' } })
    }
  },
  getters: {
    memberName (state) {
      if (state.profile) {
        if (state.profile.memberName) {
          return state.profile.memberName
        } else {
          let nickNameArr = ['ブラウン', 'コニー', 'サリー', 'チョコ', 'ムーン']
          return nickNameArr[Math.floor(Math.random() * nickNameArr.length)]
        }
      }
    },
    isExec (state) {
      if (state.profile) {
        let checkMember = false
        let executivesGroups = process.env.VUE_APP_EXECUTIVES
        if (state.profile.memberGroups) {
          state.profile.memberGroups.map((group) => {
            if (executivesGroups.indexOf(String(group.memberGroupNo)) !== -1) checkMember = true
          })
          return checkMember
        } else {
          return false
        }
      } else {
        return false
      }
    },
    getConnectSns (state) {
      if (state.profile && state.profile.providerTypes) {
        return {
          google: (state.profile.providerTypes.indexOf('GOOGLE') !== -1) ? 'ing' : '',
          line: (state.profile.providerTypes.indexOf('LINE') !== -1) ? 'ing' : '',
          facebook: (state.profile.providerTypes.indexOf('FACEBOOK') !== -1) ? 'ing' : ''
        }
      } else {
        return {
          google: '',
          line: '',
          facebook: ''
        }
      }
    },
    isSaleExec (state) {
      return state.profile && state.profile.memberGroups && state.profile.memberGroups.length > 0
    }
  }
}
