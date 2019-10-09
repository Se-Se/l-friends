import { createNcpApiStore } from '@/api'
import { getStrDate } from '@/utils/dateUtils'
import { formatCurrency } from '@/utils/StringUtils'
import { isPC } from '@/utils/utils'
import Vue from 'vue'
const defaultReviewableParams = {
  'pageNumber': 1,
  'pageSize': isPC() ? 20 : 5,
  'hasTotalCount': true
}

const defaultReviewsParams = {
  'pageNumber': 1,
  'pageSize': 1,
  'hasTotalCount': true
}

const apiStore = createNcpApiStore([
  {
    action: '_fetchProductReviewable',
    property: 'productReviewable',
    path: 'profile/order-options/product-reviewable',
    method: 'get',
    onSuccess (state, payload) {
      state.productReviewable = [...state.productReviewable || [], ...payload.data.items]
      state.totalCount = payload.data.totalCount
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
  },
  {
    action: '_fetchProfileProductReviews',
    property: 'profileProductReviews',
    path: '/profile/order-options/product-reviewable',
    method: 'get',
    onSuccess (state, payload) {
      state.profileProductReviews = [...state.profileProductReviews || [], ...payload.data.items]
      state.totalCount = payload.data.totalCount
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
  },
  {
    action: '_postProductReviews',
    path: 'products/{productNo}/product-reviews',
    pathParams: ['productNo'],
    method: 'post'
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
    action: '_fetchProductReviewDetail',
    property: 'productReviewDetail',
    path: 'products/{productNo}/product-reviews/{reviewNo}',
    pathParams: ['productNo', 'reviewNo'],
    method: 'get'
  }
])

export default {
  namespaced: true,
  state: {
    fetchListParams: {},
    totalCount: null,
    reviewsLoading: true,
    reviewableLoading: true
  },
  mixins: [apiStore],
  actions: {
    async fetchProductReviewable ({ state, dispatch, commit }, params) {
      commit('REVIEWABLE_RESET_LIST')
      commit('REVIEWABLE_SET_PARAMS', params)
      await dispatch('_fetchProductReviewable', { params: state.fetchListParams })
      // commit('PRODUCT_REVIEWABLE')
    },
    postProductReviews ({ state, dispatch, commit }, paramsReview) {
      return dispatch('_postProductReviews', { data: paramsReview, params: { productNo: paramsReview.productNo } }).then(ret => {
        if (paramsReview.orderAddFlg !== 'order') {
          dispatch('fetchProductReviewable')
        }
      })
    },
    async fetchProfileProductReviews ({ state, dispatch, commit }, params) {
      commit('REVIEWS_RESET_LIST')
      commit('REVIEWS_SET_PARAMS', params)
      await dispatch('_fetchProfileProductReviews', { params: state.fetchListParams })
      commit('PROFILE_PRODUCT_REVIEWS')
    },
    putProductReviews ({ state, dispatch, commit }, paramsReview) {
      return dispatch('_putProductReviews', { data: paramsReview, params: { reviewNo: paramsReview.reviewNo, productNo: paramsReview.productNo } })
    },
    async deleteProductReviews ({ state, dispatch, commit }, paramsReview) {
      await dispatch('_deleteProductReviews', { params: { reviewNo: paramsReview.reviewNo, productNo: paramsReview.productNo } })
      await dispatch('fetchProfileProductReviews', state.fetchListParams)
    },
    async fetchReviewableMore ({ state, dispatch, commit, rootState }, payload) {
      commit('REVIEWABLE_SET_PARAMS', {
        pageNumber: (state.fetchListParams.pageNumber + 1)
      })
      await dispatch('_fetchProductReviewable', { params: state.fetchListParams })
      if (state.productReviewable.length >= state.totalCount) {
        state.reviewableLoading = false
      }
      // commit('PRODUCT_REVIEWABLE')
    },
    async fetchReviewsMore ({ state, dispatch, commit, rootState }, payload) {
      commit('REVIEWS_SET_PARAMS', {
        pageNumber: (state.fetchListParams.pageNumber + 1)
      })
      await dispatch('_fetchProfileProductReviews', { params: state.fetchListParams })
      if (state.profileProductReviews.length >= state.totalCount) {
        state.reviewsLoading = false
      }
      commit('PROFILE_PRODUCT_REVIEWS')
    },
    fetchProductReviewDetail ({ state, commit, dispatch }, { editParams }) {
      dispatch('_fetchProductReviewDetail', { params: { reviewNo: editParams.reviewNo, productNo: editParams.productNo } })
    }

  },
  getters: {
  },
  mutations: {
    REVIEWABLE_SET_PARAMS (state, params) {
      state.fetchListParams = {
        ...state.fetchListParams,
        ...params
      }
    },
    REVIEWABLE_RESET_LIST (state) {
      state.productReviewable = null
      state.totalCount = 0
      state.reviewableLoading = true
      state.fetchListParams = defaultReviewableParams
    },
    REVIEWS_SET_PARAMS (state, params) {
      state.fetchListParams = {
        ...state.fetchListParams,
        ...params
      }
    },
    REVIEWS_RESET_LIST (state) {
      state.profileProductReviews = null
      state.totalCount = 0
      state.reviewsLoading = true
      state.fetchListParams = defaultReviewsParams
    },
    PRODUCT_REVIEWABLE (state) {
      if (state.productReviewable) {
        state.productReviewable.forEach(item => {
          item.showOptions = []
          if (item.optionUsed) {
            if (item.optionName && item.optionValue) {
              const optionNames = item.optionName.split('|')
              const optionValues = item.optionValue.split('|')

              optionNames.forEach((tempName, index) => {
                item.showOptions.push(tempName + ':' + optionValues[index])
              })
            }
            if (item.inputs && item.inputs.length > 0) {
              item.inputs.forEach(optionInput => {
                item.showOptions.push(optionInput.inputLabel + ':' + optionInput.inputValue)
              })
            }
            if (item.price.addPrice > 0) {
              let last = item.showOptions.pop()
              let lastoption = last + ' (+' + formatCurrency(item.price.addPrice) + '원)'
              item.showOptions.push(lastoption)
            }
          } else {
            item.showOptions.push('본품')
          }
          item.showOptions.push(item.orderCnt + '개')
        })
      }
    },
    PROFILE_PRODUCT_REVIEWS (state) {
      if (state.profileProductReviews) {
        state.profileProductReviews.forEach(item => {
          if (item.registerYmdt) {
            Vue.set(item, 'showRegisterYmdt', getStrDate(new Date(item.registerYmdt), '.'))
          }
          if (item.orderedOption.optionUsed) {
            if (item.orderedOption.optionName && item.orderedOption.optionValue) {
              const optionNames = item.orderedOption.optionName.split('|')
              const optionValues = item.orderedOption.optionValue.split('|')
              item.showOptions = []
              optionNames.forEach((tempName, index) => {
                item.showOptions.push(tempName + ':' + optionValues[index])
              })
            }
            if (item.orderedOption.inputs && item.orderedOption.inputs.length > 0) {
              item.orderedOption.inputs.forEach(optionInput => {
                item.showOptions.push(optionInput.inputLabel + ':' + optionInput.inputValue)
              })
            }
            if (item.orderedOption.addPrice > 0) {
              let last = item.showOptions.pop()
              let lastoption = last + ' (+' + formatCurrency(item.orderedOption.addPrice) + '원)'
              item.showOptions.push(lastoption)
            }
          } else {
            item.showOptions.push('본품')
          }
          item.showOptions.push(item.orderedOption.orderCnt + '개')
        })
      }
    }
  }
}
