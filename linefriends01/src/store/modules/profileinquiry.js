import { createNcpApiStore } from '@/api'
import { isPC } from '@/utils/utils'

const defaultParams = {
  'pageNumber': 1,
  'pageSize': isPC() ? 20 : 5,
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
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
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
    async signInInquiries ({ commit, dispatch, rootState }, iparam) {
      await dispatch('_signInInquiries', { data: iparam, params: {} })
    },
    async fetchInquiries ({ state, dispatch, commit, rootState }, payload) {
      commit('RESET_LIST')
      commit('SET_PARAMS', payload)
      await dispatch('_fetchInquiries', { params: state.fetchListParams })
      if (state.inquiries.length >= state.totalCount) {
        state.loading = false
      }
    },
    async fetchInquiriesMore ({ state, dispatch, commit, rootState }, payload) {
      commit('SET_PARAMS', {
        pageNumber: state.fetchListParams.pageNumber + 1
      })
      await dispatch('_fetchInquiries', { params: state.fetchListParams })
      if (state.inquiries.length >= state.totalCount) {
        state.loading = false
      }
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
