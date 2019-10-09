import { createNcpApiStore } from '@/api'

const apiStore = createNcpApiStore([
  {
    action: '_recent-addresses',
    property: 'recentAddresses',
    path: 'profile/shipping-addresses/recent'
  },
  {
    action: '_recent-delete',
    property: 'deleteRencent',
    path: 'profile/shipping-addresses/{addressNo}',
    pathParams: ['addressNo'],
    method: 'delete'
  }
])

export default {
  namespaced: true,
  mixins: [apiStore],
  actions: {
    async recentAddresses ({ commit, dispatch, rootState, rootGetters }) {
      if (!rootGetters.memberIsLogin) {
        return
      }
      await dispatch('_recent-addresses')
    },
    async deleteRecentAddresses ({ commit, dispatch, rootState, rootGetters }, addressNo) {
      if (!rootGetters.memberIsLogin) {
        return
      }
      await dispatch('_recent-delete', { params: { addressNo } })
      return dispatch('_recent-addresses')
    }
  }
}
