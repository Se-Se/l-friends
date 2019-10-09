import { createNcpApiStore } from '@/api'
import cookies from 'js-cookie'

const defaultParams = {
  'pageNumber': 1,
  'pageSize': 10,
  'hasTotalCount': true
}

const apiStore = createNcpApiStore([
  {
    action: '_uploadImages',
    property: 'uploadImagesData',
    path: 'files/images',
    method: 'post'
  },
  {
    action: '_uploadFiles',
    property: 'uploadFilesData',
    path: 'files',
    method: 'post'
  },
  {
    action: '_deleteFiles',
    property: 'deleteFilesData',
    path: 'files',
    method: 'delete'
  },
  {
    action: '_terms',
    property: 'terms',
    path: 'terms',
    method: 'get',
    queryParams: true,
    onSuccess (state, payload) {
      state.terms = {
        ...state.terms,
        ...payload.data
      }
    }
  },
  {
    action: '_malls',
    property: 'malls',
    path: 'malls',
    onSuccess (state, payload) {
      state.malls = {
        ...payload.data,
        productInquiryType: payload.data.productInquiryType.filter(item => item.label === '상품')
      }
    }
  },
  {
    action: '_partners',
    property: 'partners',
    path: 'malls/partners'
  },
  {
    action: '_fetchAddresses',
    property: 'addresses',
    path: 'addresses/search',
    method: 'get',
    queryParams: true,
    onSuccess (state, payload) {
      state.addresses = {
        items: payload.data.items,
        totalCount: payload.data.totalCount
      }
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
  },
  {
    action: '_fetchMoreAddresses',
    property: 'addresses',
    path: 'addresses/search',
    method: 'get',
    queryParams: true,
    onSuccess (state, payload) {
      state.addresses = {
        items: [...(state.addresses.items || []), ...payload.data.items],
        totalCount: payload.data.totalCount
      }
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
  }
])

export default {
  namespaced: true,
  state: {
    useDeviceMode: false,
    fetchListParams: {},
    totalCount: null,
    loading: true,
    terms: []
  },
  mixins: [apiStore],
  actions: {
    uploadImages ({ state, dispatch, commit }, data) {
      return dispatch('_uploadImages', { data })
    },
    uploadFiles ({ state, dispatch, commit }, data) {
      return dispatch('_uploadFiles', { data })
    },
    deleteFiles ({ state, dispatch, commit }, filename) {
      return dispatch('_deleteFiles', {params: { fileName: filename }})
    },
    fetchTerms ({ state, commit, dispatch }, termsTypes) {
      return dispatch('_terms', {params: { termsTypes }})
    },
    fetchMalls ({ state, commit, dispatch }) {
      if (state.malls) {
        return
      }
      return dispatch('_malls')
    },
    fetchPartners ({ state, commit, dispatch }) {
      if (state.malls) {
        return
      }
      return dispatch('_partners')
    },
    fetchAddresses ({ state, dispatch, commit }, params) {
      commit('SET_PARAMS', {
        'keyword': params.keyword,
        'pageNumber': params.pageNumber,
        'pageSize': 5,
        'hasTotalCount': true
      })
      return dispatch('_fetchAddresses', { params: state.fetchListParams })
    },
    fetchMoreAddresses ({ state, dispatch, commit }) {
      commit('SET_PARAMS', {
        'pageNumber': state.fetchListParams.pageNumber + 1
      })
      return dispatch('_fetchMoreAddresses', { params: state.fetchListParams })
    },
    resetAddress ({ commit }) {
      commit('RESET_LIST')
    }
  },
  getters: {
    productInquiryTypes (state) {
      if (state.malls) {
        return state.malls.productInquiryType
      }
      return null
    },
    productReviewReportType (state) {
      if (state.malls) {
        return state.malls.productReviewReportType
      }
      return null
    },
    inquiryType  (state) {
      if (state.malls) {
        return state.malls.inquiryType
      }
      return null
    },
    claimReasonTypes (state) {
      if (state.malls) {
        return state.malls.claimReasonType
      }
      return null
    },
    orderStatusTypes (state) {
      if (state.malls) {
        return state.malls.orderStatusType
      }
      return null
    }
  },
  mutations: {
    SET_DEVICE_MODE (state, type) {
      cookies.set('useDeviceMode', type)
      window.location.reload()
    },
    SET_PARAMS (state, params) {
      state.fetchListParams = {
        ...state.fetchListParams,
        ...params
      }
    },
    RESET_LIST (state) {
      state.addresses = null
      state.totalCount = 0
      state.loading = true
      state.fetchListParams = defaultParams
    }
  }
}
