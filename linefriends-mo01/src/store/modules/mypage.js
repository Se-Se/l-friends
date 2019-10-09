import { createNcpApiStore } from '@/api'

const apiStore = createNcpApiStore([
  {
    action: '_coupons',
    property: 'cuponList',
    path: '/coupons', // クーポンを取得する（マイページ）
    method: 'get',
    onSuccess: (state, payload) => {
      // console.log(payload.data)
      if (payload.data.items !== null) {
        state.cuponList = [...state.cuponList || [], ...payload.data.items]
      }
      state.totalCount = payload.data.totalCount
    }
  },
  {
    action: '_registerCoupon',
    property: 'registerCoupon',
    path: 'coupons/register-code/{promotionCode}',
    pathParams: ['promotionCode'],
    method: 'post'
  },
  {
    action: '_qa',
    property: 'qaList',
    path: '/profile/product-inquiries', // 私の商品お問い合わせリスト
    method: 'get',
    onSuccess: (state, payload) => {
      // console.log(payload.data)
      if (payload.data.items !== null) {
        state.qaList = [...state.qaList || [], ...payload.data.items]
      }
      state.totalCount = payload.data.totalCount
    }
  },
  {
    action: '_delQa',
    path: 'products/inquiries/{inquiryNo}',
    pathParams: ['inquiryNo'],
    method: 'delete'
  },
  {
    action: '_updateQa',
    path: 'products/inquiries/{inquiryNo}',
    pathParams: ['inquiryNo'],
    method: 'put'
  }
])

export default {
  namespaced: true,
  state: {
    cuponList: null,
    qaList: null,
    totalCount: 0,
    currentPage: 1,
    currentPageSize: 10,
    cuponTab: '1',
    loading: 0
  },
  mixins: [apiStore],
  actions: {
    // 상품 문의 목록
    async fetchQa ({ state, dispatch, commit }, { to }) {
      commit('CLEAR_QALIST')
      commit('RESET_PARAMS')
      commit('SET_PARAMS', {
        'hasTotalCount': true,
        'pageNumber': state.currentPage,
        'pageSize': state.currentPageSize
      })
      await dispatch('_qa', { params: state.fetchListParams })
    },
    async delQa ({ state, dispatch, commit, rootState }, deleteparams) {
      await dispatch('_delQa', { params: { inquiryNo: deleteparams } })
      await dispatch('fetchQa', { state, dispatch, commit })
      return true
    },
    async updateQa ({ state, dispatch, commit, rootState }, params) {
      await dispatch('_updateQa', { data: params, params: { inquiryNo: params.inquiryNo } })
      await dispatch('fetchQa', { state, dispatch, commit })
      return true
    },
    async fetchRegisterCoupon ({ state, dispatch, commit }, promotionCode) {
      let result = true
      await dispatch('_registerCoupon', { params: { promotionCode: encodeURIComponent(promotionCode) } }).catch(() => {
        result = false
      })
      return result
    },
    async fetchCupon ({ state, dispatch, commit }, { to }) {
      commit('CLEAR_CUPONLIST')
      commit('RESET_PARAMS')
      commit('SET_PARAMS', {
        'hasTotalCount': true,
        'pageNumber': state.currentPage,
        'pageSize': state.currentPageSize,
        'usable': true
      })
      if (to.params.usable === '2') {
        commit('SET_PARAMS', {
          'usable': false
        })
        state.cuponTab = '2'
      } else {
        commit('SET_PARAMS', {
          'usable': true
        })
        state.cuponTab = '1'
      }
      await dispatch('_coupons', { params: state.fetchListParams })
    },
    async fetchPage ({ state, dispatch, commit, rootState }, page) {
      commit('CLEAR_CUPONLIST')
      commit('SET_PARAMS', {
        'hasTotalCount': true,
        'pageNumber': page
      })
      await dispatch('_coupons', { params: state.fetchListParams })
    },
    setCurrentPageNo ({ state, dispatch, commit, rootState }, pageNo) {
      commit('SET_CUR_PAGE_NO', pageNo)
    },
    async fetchCuponMore ({ state, dispatch, commit }) {
      if (state.loading > 0) return
      commit('SET_PARAMS', {
        'hasTotalCount': true,
        pageNumber: state.fetchListParams.pageNumber + 1
      })
      state.fetchListParams.r = new Date().getTime()
      state.loading = 1
      await dispatch('_coupons', { params: state.fetchListParams }).then(() => {
        state.loading = 0
      })
    },
    async fetchQaMore ({ state, dispatch, commit }) {
      if (state.loading > 0) return
      commit('SET_PARAMS', {
        'hasTotalCount': true,
        pageNumber: state.fetchListParams.pageNumber + 1
      })
      state.fetchListParams.r = new Date().getTime()
      state.loading = 1
      await dispatch('_qa', { params: state.fetchListParams }).then(() => {
        state.loading = 0
      })
    }
  },
  getters: {
  },
  mutations: {
    RESET_PARAMS (state) {
      state.fetchListParams = []
      state.currentPage = 1
      state.currentPageSize = 20
    },
    SET_PARAMS (state, params) {
      state.fetchListParams = {
        ...state.fetchListParams,
        ...params
      }
    },
    CLEAR_CUPONLIST (state) {
      state.cuponList = null
      state.totalCount = 0
    },
    CLEAR_QALIST (state) {
      state.qaList = null
      state.totalCount = 0
    },
    SET_CUR_PAGE_NO (state, pageNo) {
      state.currentPage = pageNo
    }
  }
}
