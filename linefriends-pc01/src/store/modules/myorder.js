import { createNcpApiStore } from '@/api'
import { getToday, addMonth } from '@/utils/dateUtils'
import { formatOptionTitle } from '@/utils/utils'
import qs from 'qs'
import Vue from 'vue'

const defaultParams = {
  'orderRequestTypes': null,
  'pageNumber': 1,
  'pageSize': 5,
  'hasTotalCount': true,
  'startYmd': null,
  'endYmd': null
}

const apiStore = createNcpApiStore([
  {
    action: '_getOrder',
    property: 'order',
    path: 'profile/orders/{orderNo}',
    pathParams: ['orderNo']
  },
  {
    action: '_editDeliveries',
    property: 'deliverie',
    path: 'profile/orders/{orderNo}/deliveries',
    pathParams: ['orderNo'],
    method: 'put'
  },
  {
    action: '_getOrderList',
    property: 'orders',
    path: 'profile/orders',
    method: 'get',
    queryParams: true,
    onSuccess (state, payload) {
      state.orders = [...state.orders || [], ...payload.data.items]
      state.totalCount = payload.data.totalCount
    },
    requestConfig: {
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
    }
  },
  {
    action: '_getClaimResult',
    property: 'claimResult',
    path: 'profile/order-options/{orderOptionNo}/claim/result',
    pathParams: ['orderOptionNo']
  },
  {
    action: '_postOrderClaimCancel',
    path: 'profile/orders/{orderNo}/claim/cancel',
    pathParams: ['orderNo'],
    method: 'post'
  },
  {
    action: '_orderClaimCancel',
    path: 'profile/orders/{orderNo}/claim/cancel',
    pathParams: ['orderNo'],
    method: 'post'
  },
  {
    action: '_deliveryDone',
    path: 'profile/order-options/{orderOptionNo}/delivery-done',
    pathParams: ['orderOptionNo'],
    method: 'put'
  },
  {
    action: '_optionConfirm',
    path: 'profile/order-options/{orderOptionNo}/confirm',
    pathParams: ['orderOptionNo'],
    method: 'put'
  },
  {
    action: '_getClaimOrderOption',
    property: 'claimOrderOption',
    path: 'profile/order-options/{orderOptionNo}/claim',
    pathParams: ['orderOptionNo']
  },
  {
    action: '_claimEstimate',
    property: 'claimEstimate',
    path: 'profile/claim/estimate',
    method: 'post'
  },
  {
    action: '_claimCancel',
    property: 'claimCancel',
    path: 'profile/claim/cancel',
    method: 'post'
  },
  {
    action: '_claimReturn',
    property: 'claimReturn',
    path: 'profile/claim/return',
    method: 'post'
  },
  {
    action: '_getMultiClaimResult',
    property: 'multiClaimResult',
    path: 'profile/claims/{claimNo}/result',
    pathParams: ['claimNo']
  }
])

export default {
  namespaced: true,
  state: {
    fetchListParams: {},
    totalPoint: null,
    totalAmt: null,
    totalCount: null,
    totalHistoryCount: null,
    loading: true,
    startYmd: '2018-01-01',
    endYmd: getToday(),
    returnInfo: [],
    claimOptions: []
  },
  mixins: [apiStore],
  actions: {
    async getOrder ({ state, dispatch }, { orderNo }) {
      state.order = null
      await dispatch('_getOrder', { params: { orderNo } })
    },
    async editDeliveries ({ dispatch }, { orderNo, data }) {
      await dispatch('_editDeliveries', { params: { add: false, orderNo }, data }).then(res => {
        dispatch('getOrder', { orderNo })
      })
    },
    async getOrderListInInquiry ({ state, commit, dispatch }, { period, to }) {
      commit('RESET_LIST')
      commit('SET_PARAMS', {
        startYmd: period.startYmd || addMonth(new Date(), -1),
        endYmd: period.endYmd || getToday()
      })

      await dispatch('_getOrderList', { params: state.fetchListParams })
    },
    async fetchMoreOrderListInInquiry ({ state, dispatch, commit }, payload) {
      commit('SET_PARAMS', {
        pageNumber: payload
      })
      state.orders = []
      await dispatch('_getOrderList', { params: state.fetchListParams })
    },
    postOrderClaimCancel ({ state, dispatch, commit, rootState }, orderNo) {
      return dispatch('_postOrderClaimCancel', { params: { orderNo } })
    },
    async getClaimResult ({ state, dispatch, commit, rootState }, { claimParams }) {
      const retClaimResult = await dispatch('_getClaimResult', { params: { orderOptionNo: claimParams.orderOptionNo } })
      return retClaimResult
    },
    async orderClaimCancel ({ dispatch }, orderNo) {
      await dispatch('_orderClaimCancel', { params: { orderNo } })
    },
    async deliveryDone ({ dispatch }, orderOptionNo) {
      await dispatch('_deliveryDone', { params: { orderOptionNo } })
    },
    async optionConfirm ({ dispatch }, orderOptionNo) {
      await dispatch('_optionConfirm', { params: { orderOptionNo: orderOptionNo } })
    },
    async getClaimOrderOption ({ dispatch, commit, state }, { claimType, orderOptionNo }) {
      state.claimEstimate = null
      await dispatch('_getClaimOrderOption', { params: { orderOptionNo, claimType } })
      await commit('FORMAT_CLAIM_OPTIONS', claimType)
    },
    claimEstimate ({ state, dispatch }, claimRequest) {
      if (claimRequest.claimReasonType === 'default' || claimRequest.claimedProductOptions.length === 0) {
        state.claimEstimate = null
      } else {
        return dispatch('_claimEstimate', { data: claimRequest })
      }
    },
    async claimCancel ({ dispatch }, claimRequest) {
      await dispatch('_claimCancel', { data: claimRequest })
    },
    async claimReturn ({ dispatch }, claimRequest) {
      await dispatch('_claimReturn', { data: claimRequest })
    },
    async getMultiClaimResult ({ state, dispatch, commit, rootState }, { claimParams }) {
      const retClaimResult = await dispatch('_getMultiClaimResult', { params: { claimNo: claimParams.claimNo } })
      return retClaimResult
    }
  },
  mutations: {
    RESET_LIST (state) {
      state.orders = null
      state.totalCount = null
      state.totalHistoryCount = null
      state.loading = true
      state.fetchListParams = defaultParams
    },
    SET_PARAMS (state, params) {
      state.fetchListParams = {
        ...state.fetchListParams,
        ...params
      }
    },
    FORMAT_CLAIM_OPTIONS (state, claimType) {
      if (state.claimOrderOption) {
        let options = []
        let tempOption = {
          orderOptionNo: state.claimOrderOption.originalOption.orderOptionNo,
          productNo: state.claimOrderOption.originalOption.productNo,
          optionNo: state.claimOrderOption.originalOption.optionNo,
          imageUrl: state.claimOrderOption.originalOption.imageUrl,
          productName: state.claimOrderOption.originalOption.productName,
          optionTitle: state.claimOrderOption.originalOption.optionTitle,
          price: state.claimOrderOption.originalOption.price,
          orderCnt: state.claimOrderOption.originalOption.orderCnt
        }
        Vue.set(tempOption, 'checked', true)
        Vue.set(tempOption, 'showCnt', state.claimOrderOption.originalOption.orderCnt)
        options.push(tempOption)
        if (state.claimOrderOption.claimableOptions && state.claimOrderOption.claimableOptions.length) {
          options.push(...state.claimOrderOption.claimableOptions.map(option => {
            let tempOption = {
              orderOptionNo: option.orderOptionNo,
              productNo: option.productNo,
              optionNo: option.optionNo,
              imageUrl: option.imageUrl,
              productName: option.productName,
              optionTitle: option.optionTitle,
              price: option.price,
              orderCnt: option.orderCnt
            }
            Vue.set(tempOption, 'checked', claimType === 'CANCEL')
            Vue.set(tempOption, 'showCnt', option.orderCnt)
            return tempOption
          }))
        }
        state.claimOptions = options
      }
    }
  },
  getters: {
    productInfo (state) {
      if (state.order) {
        let products = []
        state.order.orderOptionsGroupByPartner.forEach(partner => {
          partner.orderOptionsGroupByDelivery.forEach(delivery => {
            delivery.orderOptions.forEach(option => {
              products.push({
                orderNo: option.orderNo,
                claimNo: option.claimNo,
                orderOptionNo: option.orderOptionNo,
                productNo: option.productNo,
                optionNo: option.optionNo,
                imageUrl: option.imageUrl,
                productName: option.productName,
                optionTitle: formatOptionTitle(option.optionUsed, option.optionType, option.optionName, option.optionValue, option.price.addPrice),
                orderCnt: option.orderCnt,
                price: option.price,
                exchangeYn: option.exchangeYn,
                reservation: option.reservation,
                reservationDeliveryYmdt: option.reservationDeliveryYmdt,
                nextActions: option.nextActions,
                deliverable: option.deliverable,
                delivery: option.delivery,
                orderStatusType: option.orderStatusType,
                claimStatusType: option.claimStatusType
              })
            })
          })
        })
        return products
      }
    },
    claimPrice (state) {
      let priceInfo = {
        standardPrice: 0,
        immediateDiscountAmt: 0,
        additionalDiscountAmt: 0,
        productCouponDiscountAmt: 0,
        cartCouponAmt: 0,
        refundSalesTaxAmt: 0,
        totalProductAmt: 0,
        totalDeliveryAmt: 0,
        refundRemoteDeliveryAmt: 0,
        refundPayAmt: 0,
        refundTypeLabel: ''
      }
      if (state.claimEstimate) {
        priceInfo = {
          standardPrice: state.claimEstimate.productAmtInfo.standardPrice - state.claimEstimate.refundSalesTaxAmt,
          immediateDiscountAmt: state.claimEstimate.productAmtInfo.immediateDiscountAmt,
          additionalDiscountAmt: state.claimEstimate.productAmtInfo.additionalDiscountAmt,
          productCouponDiscountAmt: state.claimEstimate.productAmtInfo.productCouponDiscountAmt,
          cartCouponAmt: state.claimEstimate.subtractionAmtInfo.cartCouponAmt,
          refundSalesTaxAmt: state.claimEstimate.refundSalesTaxAmt,
          totalProductAmt: state.claimEstimate.productAmtInfo.totalAmt - state.claimEstimate.subtractionAmtInfo.cartCouponAmt,
          totalDeliveryAmt: state.claimEstimate.deliveryAmtInfo.totalAmt,
          refundRemoteDeliveryAmt: state.claimEstimate.deliveryAmtInfo.refundRemoteDeliveryAmt,
          refundPayAmt: state.claimEstimate.refundPayAmt,
          refundTypeLabel: state.claimEstimate.refundTypeLabel
        }
      }
      return priceInfo
    }
  }
}
