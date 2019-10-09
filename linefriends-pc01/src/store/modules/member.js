import { createNcpApiStore } from '@/api'

const apiStore = createNcpApiStore([
  {
    action: '_mySummary',
    property: 'mySummary',
    path: 'profile/summary',
    pathParams: ['get']
  },
  {
    action: '_emailExits',
    property: 'emailExits',
    path: 'profile/id/exist?memberId={memberId}',
    pathParams: ['memberId'],
    method: 'get'
  },
  {
    action: '_getWelfareTotal',
    property: 'welfareTotal',
    path: 'profile/accumulations/summary'
  }
])
export default {
  namespaced: true,
  mixins: [apiStore],
  actions: {
    mySummary ({ state, commit, dispatch }) {
      return dispatch('_mySummary')
    },
    emailExits ({ state, commit, dispatch }, memberId) {
      return dispatch('_emailExits', { params: { memberId } })
    },
    getWelfareTotal ({ state, commit, dispatch }) {
      return dispatch('_getWelfareTotal')
    }
  },
  getters: {}
}
