import { createNcpApiStore } from '@/api'
import { getStrDate, addDay, getToday, addMonth } from '@/utils/dateUtils'
import { maskingMemberId } from '@/utils/StringUtils'
import { isPC } from '@/utils/utils'

const defaultParams = {
  'order.by': 'RECOMMEND',
  'order.direction': 'DESC',
  'pageNumber': 1,
  'pageSize': isPC() ? 20 : 5,
  'hasTotalCount': true,
  'productNo': null,
  'startYmd': null,
  'endYmd': null
}

const apiStore = createNcpApiStore([
  {
    action: '_fetchProductReviewable',
    property: 'productReviewable',
    path: 'profile/order-options/product-reviewable',
    method: 'get'
  },
  {
    action: '_postProductReviews',
    path: 'products/{productNo}/product-reviews',
    pathParams: ['productNo'],
    method: 'post'
  },
  {
    action: '_fetchProfileProductReviews',
    property: 'profileProductReviews',
    path: 'profile/product-reviews',
    method: 'get',
    onSuccess (state, payload) {
      state.profileProductReviews = [...(state.profileProductReviews || []), ...payload.data.items]
      state.totalCount = payload.data.totalCount
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
  },
  {
    action: '_putProductReviews',
    path: 'products/{productNo}/product-reviews/{reviewNo}',
    pathParams: ['productNo', 'reviewNo'],
    method: 'put'
  },
  {
    action: '_deleteProductReviews',
    path: 'products/{productNo}/product-reviews/{reviewNo}',
    pathParams: ['productNo', 'reviewNo'],
    method: 'delete'
  },
  {
    action: '_fetchProductReviews',
    property: 'productReviews',
    path: '/products/{productNo}/product-reviews',
    pathParams: ['productNo'],
    method: 'get',
    queryParams: true,
    cacheable: false,
    cacheMaxAge: 1000 * 30
  },
  {
    action: '_postProductReviewsRecommend',
    path: 'products/{productNo}/product-reviews/{reviewNo}/recommend',
    pathParams: ['productNo', 'reviewNo'],
    method: 'post'
  },
  {
    action: '_deleteProductReviewsRecommend',
    path: 'products/{productNo}/product-reviews/{reviewNo}/recommend',
    pathParams: ['productNo', 'reviewNo'],
    method: 'delete'
  },
  {
    action: '_postProductReviewsReport',
    path: 'products/{productNo}/product-reviews/{reviewNo}/report',
    pathParams: ['productNo', 'reviewNo'],
    method: 'post'
  }
])

export default {
  namespaced: true,
  state: {
    fetchListParams: { ...defaultParams },
    totalCount: null,
    loading: true
  },
  mixins: [apiStore],
  actions: {
    fetchProductReviewable ({ state, dispatch, commit }, params) {
      commit('SET_PARAMS', {
        pageNumber: 1
      })
      state.profileProductReviews = null
      dispatch('_fetchProfileProductReviews', { params: state.fetchListParams })
      return dispatch('_fetchProductReviewable', { params: state.fetchListParams })
    },
    postProductReviews ({ state, dispatch, commit }, paramsReview) {
      return dispatch('_postProductReviews', { data: paramsReview, params: { productNo: paramsReview.productNo } }).then(ret => {
        if (paramsReview.orderAddFlg !== 'order') {
          dispatch('fetchProductReviewable')
        }
      })
    },
    fetchProfileProductReviews ({ state, dispatch, commit }, params) {
      commit('RESET_LIST')
      commit('SET_PARAMS', {
        startYmd: addMonth(new Date(), -6),
        endYmd: getToday(),
        ...params
      })
      state.profileProductReviews = null
      return dispatch('_fetchProfileProductReviews', { params: state.fetchListParams })
    },
    async fetchPage ({ state, dispatch, commit, rootState }, page) {
      commit('RESET_LIST')
      commit('SET_PARAMS', {
        'pageNumber': page
      })
      await dispatch('_fetchProfileProductReviews', { params: state.fetchListParams })
    },
    putProductReviews ({ state, dispatch, commit }, paramsReview) {
      return dispatch('_putProductReviews', { data: paramsReview, params: { productNo: paramsReview.productNo, reviewNo: paramsReview.reviewNo } }).then(ret => {
        dispatch('fetchProfileProductReviews')
      })
    },
    deleteProductReviews ({ state, dispatch, commit }, paramsReview) {
      return dispatch('_deleteProductReviews', { params: { productNo: paramsReview.productNo, reviewNo: paramsReview.reviewNo } }).then(ret => {
        dispatch('fetchProfileProductReviews')
      })
    },
    fetchProductReviews ({ state, dispatch, commit, rootState }, payload) {
      // commit('RESET_LIST')
      commit('RESET_REVIEWS')
      commit('SET_PARAMS', {
        productNo: payload.productNo,
        pageNumber: payload.pageNo,
        'order.by': payload.orderBy,
        hasTotalCount: true
      })
      if (payload.pageSize) {
        commit('SET_PARAMS', {
          pageSize: payload.pageSize
        })
      }
      return dispatch('_fetchProductReviews', { params: state.fetchListParams })
    },
    async postProductReviewsRecommend ({ state, dispatch, commit, rootState }, recommend) {
      await dispatch('_postProductReviewsRecommend', { params: { productNo: recommend.productNo, reviewNo: recommend.reviewNo } }).then(() => {
        commit('REFRESH_RECOMMEND', recommend)
      })
    },
    async deleteProductReviewsRecommend ({ state, dispatch, commit, rootState }, recommend) {
      await dispatch('_deleteProductReviewsRecommend', { params: { productNo: recommend.productNo, reviewNo: recommend.reviewNo } }).then(() => {
        commit('REFRESH_RECOMMEND', recommend)
      })
    },
    async postProductReviewsReport ({ state, dispatch, commit, rootState }, reportparam) {
      await dispatch('_postProductReviewsReport', { data: reportparam, params: { productNo: reportparam.productNo, reviewNo: reportparam.reviewNo } }).then(() => {
        commit('REPORT', reportparam)
      })
    },
    fetchMore ({ state, dispatch, commit, rootState }, payload) {
      commit('SET_PARAMS', {
        pageNumber: (state.fetchListParams.pageNumber + 1)
      })
      return dispatch('_fetchProductReviews', { params: state.fetchListParams }).then(() => {
        if (state.productReviews.length >= state.totalCount) {
          state.loading = false
        }
      })
    },
    fetchMoreMyReviews ({ state, dispatch, commit, rootState }, payload) {
      commit('SET_PARAMS', {
        // 'pageNumber': (state.fetchListParams.pageNumber + 1),
        'pageNumber': payload.pageNumber
      })
      return dispatch('_fetchProfileProductReviews', { params: state.fetchListParams }).then(() => {
        if (state.profileProductReviews.length >= state.totalCount) {
          state.loading = false
        }
      })
    }
  },
  getters: {
    productReviewable (state) {
      if (!state.productReviewable) {
        return
      }
      state.productReviewable.items.forEach(item => {
        if (item.orderStatusDate.reviewableYmdt) {
          const reviewableYmdt = getStrDate(new Date(item.orderStatusDate.reviewableYmdt), '.')
          item.productionPeriodYmd = addDay(new Date(item.orderStatusDate.reviewableYmdt), 90)
          item.reviewableYmd = reviewableYmdt
        }
      })
      return state.productReviewable
    },
    productReviews (state) {
      if (!state.productReviews) {
        return
      }
      if (state.productReviews && state.productReviews.items && state.productReviews.items.rate) {
        state.productReviews.rate = state.productReviews.rate.toFixed(0)
      }
      if (!state.productReviews.items) return
      state.productReviews.items.forEach(item => {
        if (item.registerYmdt) {
          item.registerYmdt = getStrDate(new Date(item.registerYmdt), '.')
        }
        if (item.memberId) {
          item.memberId = maskingMemberId(item.memberId)
        }
      })
      return state.productReviews.items
    }
  },
  mutations: {
    SET_PARAMS (state, params) {
      state.fetchListParams = {
        ...state.fetchListParams,
        ...params
      }
    },
    RESET_LIST (state) {
      state.profileProductReviews = null
      state.productReviews = null
      state.totalCount = 0
      state.loading = true
      state.fetchListParams = defaultParams
    },
    RESET_REVIEWS (state) {
      state.productReviews = null
    },
    REFRESH_RECOMMEND (state, payload) {
      let p = state.productReviews.items.filter(r => r.reviewNo === payload.reviewNo)[0]
      p.recommendable = !p.recommendable
      p.recommendCnt = p.recommendable === true ? p.recommendCnt - 1 : p.recommendCnt + 1
    },
    REPORT (state, payload) {
      state.productReviews.items.filter(r => r.reviewNo === payload.reviewNo)[0].reportable = false
    }
  }
}
