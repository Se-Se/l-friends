import { createNcpApiStore } from '@/api'

const defaultParams = {
  pageNumber: 1,
  pageSize: 5,
  hasTotalCount: true
}

const apiStore = createNcpApiStore([
  {
    action: '_signInInquiries',
    property: 'profile',
    path: 'inquiries',
    method: 'post'
  },
  {
    action: '_updateInquiry',
    property: 'result',
    path: '/inquiries/{inquiryNo}',
    pathParams: ['inquiryNo'],
    method: 'put'
  },
  {
    action: '_deleteInquiry',
    property: 'result',
    path: '/inquiries/{inquiryNo}',
    pathParams: ['inquiryNo'],
    method: 'delete'
  },
  {
    action: '_fetchInquiries',
    property: 'inquiries',
    path: 'inquiries',
    method: 'get',
    queryParams: true,
    onSuccess (state, payload) {
      state.inquiries = payload.data.items
      state.totalCount = payload.data.totalCount
    }
  },
  {
    action: '_fetchMoreInquiries',
    property: 'inquiries',
    path: 'inquiries',
    method: 'get',
    queryParams: true,
    onSuccess (state, payload) {
      state.inquiries = [...state.inquiries || [], ...payload.data.items]
      state.totalCount = payload.data.totalCount
    }
  }
])

export default {
  namespaced: true,
  state: {
    fetchListParams: defaultParams,
    totalCount: null,
    inquiries: null,
    loading: true
  },
  mixins: [apiStore],
  actions: {
    async signInInquiries ({ commit, dispatch, rootState }, iparam) {
      await dispatch('_signInInquiries', { data: iparam, params: {} })
    },
    async fetchInquiries ({ state, dispatch, commit }) {
      commit('RESET_LIST')
      await dispatch('_fetchInquiries', { params: state.fetchListParams })
    },
    async fetchInquiriesMore ({ state, dispatch, commit, rootState }) {
      commit('SET_PARAMS', {
        pageNumber: state.fetchListParams.pageNumber + 1
      })
      await dispatch('_fetchMoreInquiries', { params: state.fetchListParams })
    },
    async deleteInquiry ({ state, dispatch, commit, rootState }, payload) {
      await dispatch('_deleteInquiry', { params: { inquiryNo: payload } })
      await dispatch('fetchInquiries')
    },
    async updateInquiry ({ state, dispatch, commit, rootState }, payload) {
      const data = {
        inquiryContent: payload.inquiryContent,
        inquiryTitle: payload.inquiryTitle,
        originalFileName: payload.originalFileName,
        uploadedFileName: payload.uploadedFileName
      }
      await dispatch('_updateInquiry', { data: data, params: { inquiryNo: payload.inquiryNo } })
      await dispatch('fetchInquiries')
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
  getters: {}
}
