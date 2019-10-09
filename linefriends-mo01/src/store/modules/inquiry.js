import { createNcpApiStore } from '@/api'

const defaultParams = {
  'pageNumber': 1,
  'pageSize': 5,
  'hasTotalCount': true,
  'startYmd': null,
  'endYmd': null
}

const apiStore = createNcpApiStore([
  {
    action: '_signInInquiries',
    property: 'profile',
    path: 'inquiries',
    method: 'post'
  },
  {
    action: '_fetchInquiries',
    property: 'inquiries',
    path: 'inquiries',
    method: 'get',
    onSuccess (state, payload) {
      state.inquiries = [...state.inquiries || [], ...payload.data.items]
      state.totalCount = payload.data.totalCount
    }
  }
])

export default {
  namespaced: true,
  state: {
    fetchListParams: {},
    totalCount: null,
    loading: true
  },
  mixins: [apiStore],
  actions: {
    async fetchInquiries ({ state, dispatch, commit, rootState }, payload) {
      commit('RESET_LIST')
      commit('SET_PARAMS', payload)
      await dispatch('_fetchInquiries', { params: state.fetchListParams })
      if (state.inquiries.length >= state.totalCount) {
        state.loading = false
      }
    },
    async signInInquiries ({ commit, dispatch, rootState }, iparam) {
      await dispatch('_signInInquiries', { data: iparam, params: {} })
    }
  },
  mutations: {
    RESET_LIST (state) {
      state.inquiries = null
      state.totalCount = null
      state.loading = true
      state.fetchListParams = defaultParams
    },
    SET_PARAMS (state, params) {
      state.fetchListParams = {
        ...state.fetchListParams,
        ...params
      }
    }
  },
  getters: {
  }
}
