import { createNcpApiStore } from '@/api'
import { getStrYMDHM } from '@/utils/dateUtils'
import { maskingMemberId, formatCurrency } from '@/utils/StringUtils'
const defaultParams = {
  'order.by': 'REGISTER_YMDT',
  'order.direction': 'DESC',
  'pageNumber': 1,
  'pageSize': 2,
  'hasTotalCount': true,
  'mallProductNo': null
}

const apiStore = createNcpApiStore([
  {
    action: '_fetchProductReviews',
    property: 'productReviews',
    path: 'products/{mallProductNo}/product-reviews',
    pathParams: ['mallProductNo'],
    method: 'get',
    queryParams: true,
    onSuccess (state, payload) {
      if (payload.data.items) {
        state.productReviews = [...state.productReviews || [], ...payload.data.items]
      }
      state.averageRate = payload.data.rate
    },
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
    fetchListParams: {},
    totalCount: null,
    loading: true,
    averageRate: 0
  },
  mixins: [apiStore],
  actions: {
    async fetchProductReviews ({ state, dispatch, commit, rootState, rootGetters }, mallProductNo) {
      commit('RESET_LIST')
      commit('SET_PARAMS', {
        'mallProductNo': mallProductNo
      })
      await dispatch('_fetchProductReviews', { params: state.fetchListParams })
      commit('PRODUCT_REVIEWS', rootGetters.isLogined)
    },
    async postProductReviewsRecommend ({ state, dispatch, commit, rootState, rootGetters }, recommend) {
      await dispatch('_postProductReviewsRecommend', { params: { productNo: recommend.productNo, reviewNo: recommend.reviewNo } })
      commit('RESET_LIST')
      commit('SET_PARAMS', {
        'mallProductNo': recommend.productNo
      })
      await dispatch('_fetchProductReviews', { params: state.fetchListParams })
      commit('PRODUCT_REVIEWS', rootGetters.isLogined)
    },
    async deleteProductReviewsRecommend ({ state, dispatch, commit, rootState, rootGetters }, recommend) {
      await dispatch('_deleteProductReviewsRecommend', { params: { productNo: recommend.productNo, reviewNo: recommend.reviewNo } })
      commit('RESET_LIST')
      commit('SET_PARAMS', {
        'mallProductNo': recommend.productNo
      })
      await dispatch('_fetchProductReviews', { params: state.fetchListParams })
      commit('PRODUCT_REVIEWS', rootGetters.isLogined)
    },
    async postProductReviewsReport ({ state, dispatch, commit, rootState, rootGetters }, reportparam) {
      await dispatch('_postProductReviewsReport', { data: reportparam, params: { productNo: reportparam.productNo, reviewNo: reportparam.reviewNo } })
      commit('RESET_LIST')
      commit('SET_PARAMS', {
        'mallProductNo': reportparam.productNo
      })
      await dispatch('_fetchProductReviews', { params: state.fetchListParams })
      commit('PRODUCT_REVIEWS', rootGetters.isLogined)
    },
    async fetchMore ({ state, dispatch, commit, rootState, rootGetters }, payload) {
      commit('SET_PARAMS', {
        pageNumber: (state.fetchListParams.pageNumber + 1)
      })
      await dispatch('_fetchProductReviews', { params: state.fetchListParams })
      if (state.productReviews.length >= state.totalCount) {
        state.loading = false
      }
      commit('PRODUCT_REVIEWS', rootGetters.isLogined)
    }
  },
  getters: {
  },
  mutations: {
    SET_PARAMS (state, params) {
      state.fetchListParams = {
        ...state.fetchListParams,
        ...params
      }
    },
    RESET_LIST (state) {
      state.productReviews = null
      state.totalCount = 0
      state.rate = 0
      state.loading = true
      state.fetchListParams = defaultParams
    },
    PRODUCT_REVIEWS (state, isLogined) {
      if (state.productReviews) {
        state.productReviews.forEach(item => {
          if (item.registerYmdt) {
            item.registerYmdt = getStrYMDHM(new Date(item.registerYmdt), '.')
          }
          if (item.memberId) {
            item.memberId = maskingMemberId(item.memberId)
          }
          item.showOptions = []
          if (item.orderedOption.optionUsed) {
            if (item.orderedOption.optionName && item.orderedOption.optionValue) {
              const optionNames = item.orderedOption.optionName.split('|')
              const optionValues = item.orderedOption.optionValue.split('|')
              optionNames.forEach((tempName, index) => {
                item.showOptions.push(tempName + ':' + optionValues[index])
              })
            }
            if (item.orderedOption.inputs && item.orderedOption.inputs.length > 0) {
              item.orderedOption.inputs.forEach(optionInput => {
                item.showOptions.push(optionInput.inputLabel + ':' + optionInput.inputValue)
              })
            }
          } else {
            item.showOptions.push('본품')
          }
          if (item.orderedOption.addPrice > 0) {
            let last = item.showOptions.pop()
            let lastoption = last + ' (+' + formatCurrency(item.orderedOption.addPrice) + '원)'
            item.showOptions.push(lastoption)
          }
          item.showOptions.push(item.orderedOption.orderCnt + '개')
          item.isLogined = isLogined
        })
      }
    }
  }
}
