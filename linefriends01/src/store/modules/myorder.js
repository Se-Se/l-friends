import { createNcpApiStore } from '@/api'
import { isPC } from '@/utils/utils'
import { formatCurrency, telnoFormat } from '@/utils/StringUtils'
import { getToday, getFirstAndEndDay, addMonth, getStrDate, getSixMonths } from '@/utils/dateUtils'
import { makeOrderProductOptionName } from '@/utils/orderUtils'
import qs from 'qs'
import Vue from 'vue'
import { gaEventPurchase } from '@/utils/gaEventUtils'
const defaultParams = {
  'orderRequestTypes': null,
  'pageNumber': 1,
  'pageSize': isPC() ? 20 : 5,
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
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
  },
  {
    action: '_getOrderListNew',
    property: 'orders',
    path: 'profile/orders',
    method: 'get',
    queryParams: true,
    onSuccess (state, payload) {
      state.orders = [...payload.data.items]
      state.totalCount = payload.data.totalCount
    },
    requestConfig: {
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
  },
  {
    action: '_getWelfareAddList',
    property: 'welfareAddList',
    path: 'profile/accumulations',
    method: 'get',
    // queryParams: true,
    onSuccess (state, payload) {
      state.welfareAddList = [...payload.data.items]
      state.totalPoint = payload.data.totalAmt ? payload.data.totalAmt : 0
    },
    requestConfig: {
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
  },
  {
    action: '_getWelfareHistoryList',
    property: 'welfareHistoryList',
    path: 'profile/accumulations',
    method: 'get',
    // queryParams: true,
    onSuccess (state, payload) {
      state.welfareHistoryList = [...payload.data.items]
      state.totalCount = payload.data.totalCount
      state.totalAmt = payload.data.totalAmt ? payload.data.totalAmt : 0
    },
    requestConfig: {
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
  },
  {
    action: '_getWelfareHistoryListMore',
    property: 'welfareHistoryList',
    path: 'profile/accumulations',
    method: 'get',
    // queryParams: true,
    onSuccess (state, payload) {
      state.welfareHistoryList = [...(state.welfareHistoryList || []), ...payload.data.items]
      state.totalCount = payload.data.totalCount
      state.totalAmt = payload.data.totalAmt ? payload.data.totalAmt : 0
    },
    requestConfig: {
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
  },
  {
    action: '_getWelfareTotal',
    property: 'welfareTotal',
    path: 'profile/accumulations/summary'
  },
  {
    action: '_getClaimOrderOption',
    property: 'claimOrderOption',
    path: 'profile/order-options/{orderOptionNo}/claim',
    pathParams: ['orderOptionNo']
  },
  {
    action: '_getClaimEstimate',
    property: 'claimEstimate',
    path: 'profile/order-options/{orderOptionNo}/claim/estimate',
    pathParams: ['orderOptionNo']
  },
  {
    action: '_putOrderOptionClaimWithdraw',
    path: 'profile/order-options/{orderOptionNo}/claim/withdraw',
    pathParams: ['orderOptionNo'],
    method: 'put'
  },
  {
    action: '_getClaimResult',
    property: 'claimResult',
    path: 'profile/order-options/{orderOptionNo}/claim/result',
    pathParams: ['orderOptionNo']
  },
  {
    action: '_editDeliveries',
    property: 'deliverie',
    path: 'profile/orders/{orderNo}/deliveries',
    pathParams: ['orderNo'],
    method: 'put'
  },
  {
    action: '_postMultiClaimEstimate',
    property: 'multiClaimEstimate',
    path: 'profile/claim/estimate',
    method: 'post'
  },
  {
    action: '_postMultiClaimReturn',
    property: 'multiClaimReturn',
    path: 'profile/claim/return',
    method: 'post'
  },
  {
    action: '_postMultiClaimCancel',
    property: 'multiClaimCancel',
    path: 'profile/claim/cancel',
    method: 'post'
  },
  {
    action: '_getMultiClaimResult',
    property: 'multiClaimResult',
    path: 'profile/claims/{claimNo}/result',
    pathParams: ['claimNo']
  },
  {
    action: '_putMultiClaimWithdraw',
    path: 'profile/claims/{claimNo}/withdraw',
    pathParams: ['claimNo'],
    method: 'put'
  },
  {
    action: '_postOrderClaimCancel',
    path: 'profile/orders/{orderNo}/claim/cancel',
    pathParams: ['orderNo'],
    method: 'post'
  },
  {
    action: '_getPointName',
    property: 'pointName',
    path: 'malls',
    method: 'get',
    onSuccess (state, res) {
      state.pointName = res.data.accumulationConfig.accumulationName
    },
    cacheable: true,
    cacheMaxAge: 60e3 * 60
  }
])

export default {
  namespaced: true,
  state: {
    sixMonths: [],
    fetchListParams: {},
    totalPoint: null,
    totalAmt: null,
    totalCount: null,
    totalHistoryCount: null,
    loading: true,
    selectTypeFlg: 'one_month',
    startYmd: '2018-01-01',
    endYmd: getToday(),
    returnInfo: []
  },
  mixins: [apiStore],
  actions: {
    getOrder ({ state, commit, dispatch, rootState, rootGetters }, orderNo) {
      if (!rootGetters.memberIsLogin || !orderNo) {
        return
      }
      dispatch('_getOrder', { params: { orderNo } }).then(() => {
        gaEventPurchase(state.order)
      })
    },
    async getOrderList ({ state, commit, dispatch }, { type, to }) {
      type = to.query.type || type
      const month = to.query.month
      const period = to.query.period
      state.selectTypeFlg = 'one_month'
      if (month || month === 0) {
        state.selectTypeFlg = month
      }
      if (period) {
        state.selectTypeFlg = period
      }
      commit('RESET_LIST')
      if (month === undefined || month === '' || month === null) {
        if (period === 'all') {
          commit('SET_PARAMS', {
            startYmd: '2018-01-01',
            endYmd: getToday()
          })
        } else if (period === 'six_month') {
          commit('SET_PARAMS', {
            startYmd: addMonth(new Date(), -6),
            endYmd: getToday()
          })
        } else if (period === 'three_month') {
          commit('SET_PARAMS', {
            startYmd: addMonth(new Date(), -3),
            endYmd: getToday()
          })
        } else {
          // period === 'one_month'
          commit('SET_PARAMS', {
            startYmd: addMonth(new Date(), -1),
            endYmd: getToday()
          })
        }
      } else {
        commit('SET_PARAMS', {
          ...getFirstAndEndDay(month)
        })
      }

      if (type === 'ORDER') {
        commit('SET_PARAMS', {
          orderRequestTypes: [
            'DEPOSIT_WAIT',
            'PAY_DONE',
            'PRODUCT_PREPARE',
            'DELIVERY_PREPARE',
            'DELIVERY_ING',
            'DELIVERY_DONE',
            'BUY_CONFIRM'
          ]
        })
      } else {
        commit('SET_PARAMS', {
          orderRequestTypes: [
            'CANCEL_DONE',
            'RETURN_DONE',
            'EXCHANGE_DONE',
            'CANCEL_PROCESSING',
            'RETURN_PROCESSING',
            'EXCHANGE_PROCESSING'
          ]
        })
      }

      await dispatch('_getOrderList', { params: state.fetchListParams })
      commit('FORMAT_ORDERLIST', commit)
    },
    async getWelfareAddList ({ state, commit, dispatch }, data) {
      commit('RESET_LIST')
      if (data.startYmd === undefined || data.startYmd === null) {
        data.startYmd = new Date().getFullYear() + '-01-01'
      }
      if (data.endYmd === undefined || data.endYmd === null) {
        data.endYmd = new Date().getFullYear() + '-12-31'
      }
      await dispatch('_getWelfareAddList', { params: { accumulationReason: 'ADD', startYmd: data.startYmd, endYmd: data.endYmd, hasTotalCount: true, pageNumber: 1, pageSize: 500 } })
    },
    async getWelfareList ({ state, commit, dispatch }, data) {
      commit('RESET_LIST')
      if (data.startYmd === undefined || data.startYmd === null) {
        data.startYmd = addMonth(new Date(), -1)
      }
      if (data.endYmd === undefined || data.endYmd === null) {
        data.endYmd = getToday()
      }
      if (data.pageNumber === undefined || data.pageNumber === null) {
        data.pageNumber = state.pageNumber
      }
      await dispatch('_getWelfareHistoryList', { params: { startYmd: data.startYmd, endYmd: data.endYmd, pageNumber: data.pageNumber, pageSize: isPC() ? 20 : 5, hasTotalCount: true } })
    },
    async getWelfareListMore ({ state, commit, dispatch }, data) {
      if (data.startYmd === undefined || data.startYmd === null) {
        data.startYmd = addMonth(new Date(), -1)
      }
      if (data.endYmd === undefined || data.endYmd === null) {
        data.endYmd = getToday()
      }
      if (data.pageNumber === undefined || data.pageNumber === null) {
        data.pageNumber = state.pageNumber
      }
      await dispatch('_getWelfareHistoryListMore', { params: { startYmd: data.startYmd, endYmd: data.endYmd, pageNumber: data.pageNumber, pageSize: isPC() ? 20 : 5, hasTotalCount: true } })
    },
    async getWelfareHistoryList ({ state, commit, dispatch }, data) {
      commit('RESET_LIST')
      if (data.startYmd === undefined || data.startYmd === null) {
        data.startYmd = addMonth(new Date(), -1)
      }
      if (data.endYmd === undefined || data.endYmd === null) {
        data.endYmd = getToday()
      }
      if (data.pageNumber === undefined || data.pageNumber === null) {
        data.pageNumber = state.pageNumber
      }
      await dispatch('_getWelfareHistoryList', { params: { accumulationReason: 'SUB', startYmd: data.startYmd, endYmd: data.endYmd, pageNumber: data.pageNumber, pageSize: isPC() ? 20 : 5, hasTotalCount: true } })
    },
    async fetchMore ({ state, dispatch, commit, rootState }, payload) {
      commit('SET_PARAMS', {
        pageNumber: state.fetchListParams.pageNumber + 1
      })
      await dispatch('_getOrderList', { params: state.fetchListParams })
      if (state.orders.length >= state.totalCount) {
        state.loading = false
      }
      commit('FORMAT_ORDERLIST', commit)
    },
    async fetchMoreNew ({ state, dispatch, commit, rootState }, payload) {
      commit('SET_PARAMS', {
        pageNumber: payload
      })
      state.orders = []
      await dispatch('_getOrderListNew', { params: state.fetchListParams })
      commit('FORMAT_ORDERLIST', commit)
    },
    async getClaimOrderOption ({ state, commit, dispatch }, { claimParams }) {
      await dispatch('_getClaimOrderOption', { params: { orderOptionNo: claimParams.orderOptionNo, claimType: claimParams.claimType } })
      commit('CALCULATE_ORDER_OPTION')
      commit('SET_RETURN_INFO')
    },
    getCancelEstimate ({ state, commit, dispatch }, claimParams) {
      return dispatch('_getClaimEstimate', { params: { orderOptionNo: claimParams.orderOptionNo, claimType: claimParams.claimType, productCnt: claimParams.productCnt, claimReasonType: claimParams.claimReasonType } })
    },
    async getReturnEstimate ({ state, commit, dispatch }, claimRequest) {
      await dispatch('_postMultiClaimEstimate', { data: claimRequest })
    },
    postOrderOptionClaimReturn ({ state, dispatch, commit, rootState }, claimRequest) {
      return dispatch('_postMultiClaimReturn', { data: claimRequest })
    },
    postOrderOptionClaimCancel ({ state, dispatch, commit, rootState }, claimRequest) {
      return dispatch('_postMultiClaimCancel', { data: claimRequest })
    },
    postOrderClaimCancel ({ state, dispatch, commit, rootState }, orderNo) {
      return dispatch('_postOrderClaimCancel', { params: { orderNo } })
    },
    async getOrderDetail ({ state, commit, dispatch }, orderNo) {
      await dispatch('_getOrder', { params: { orderNo } })
      commit('FORMAT_ORDER', commit)
    },
    // async putOrderOptionClaimWithdraw ({ state, dispatch, commit, rootState }, withdrawparam) {
    //   await dispatch('_putOrderOptionClaimWithdraw', { data: withdrawparam, params: { orderOptionNo: withdrawparam.orderOptionNo } })
    // },
    async getClaimResult ({ state, dispatch, commit, rootState }, { claimParams }) {
      const retClaimResult = await dispatch('_getClaimResult', { params: { orderOptionNo: claimParams.orderOptionNo } })
      await commit('FORMAT_CLAIM_RESULT')
      return retClaimResult
    },
    async getMultiClaimResult ({ state, dispatch, commit, rootState }, { claimParams }) {
      const retClaimResult = await dispatch('_getMultiClaimResult', { params: { claimNo: claimParams.claimNo } })
      await commit('FORMAT_MULTI_CLAIM_RESULT')
      return retClaimResult
    },
    async editDeliveries ({ state, dispatch, commit, rootState }, deliveriesParam) {
      await dispatch('_editDeliveries', { data: deliveriesParam.addressRequest, params: { add: false, orderNo: deliveriesParam.orderNo } })
    },
    async putMultiClaimWithdraw ({ state, dispatch, commit, rootState }, withdrawparam) {
      await dispatch('_putMultiClaimWithdraw', { data: withdrawparam, params: { claimNo: withdrawparam.claimNo } })
    },
    async getWelfareTotal ({ state, dispatch, commit, rootState }, data) {
      await dispatch('_getWelfareTotal', { data: data })
    },
    async getPointName ({ state, dispatch, commit, rootState }) {
      await dispatch('_getPointName')
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
    CALCULATE_ORDER_OPTION (state) {
      if (state.claimOrderOption) {
        makeOrderProductOptionName(state.claimOrderOption.originalOption, state.claimOrderOption.originalOption.optionUsed, state.claimOrderOption.originalOption.brandName, state.claimOrderOption.originalOption.productName)
        Vue.set(state.claimOrderOption.originalOption, 'checkYn', true)
        const multiple = state.claimOrderOption.claimableOptions
        multiple.forEach((opt, index) => {
          makeOrderProductOptionName(opt, opt.optionUsed, opt.brandName, opt.productName)
        })
        if (state.claimOrderOption.returnAddress) {
          const showReturnAddress = state.claimOrderOption.returnAddress
          state.claimOrderOption.showReturnAddress = showReturnAddress
        }
      }
    },
    SET_RETURN_INFO (state) {
      if (state.claimOrderOption) {
        const option = state.claimOrderOption.originalOption
        let param = {}
        if (option.orderStatusType !== 'BUY_CONFIRM' && option.refundable) {
          param.orderStatusType = option.orderStatusType
          param.orderProductOptionNo = option.orderOptionNo
          Vue.set(param, 'productCnt', option.orderCnt)
          Vue.set(param, 'checkYn', option.checkYn)
        }
        const claimParams = []
        claimParams.push(param)
        const multiple = state.claimOrderOption.claimableOptions
        multiple.forEach((opt, index) => {
          if (opt.orderStatusType !== 'BUY_CONFIRM' && opt.refundable) {
            param = {}
            param.orderStatusType = option.orderStatusType
            param.orderProductOptionNo = opt.orderOptionNo
            Vue.set(param, 'productCnt', 0)
            Vue.set(param, 'checkYn', opt.checkYn)
            claimParams.push(param)
          }
        })
        state.returnInfo = claimParams
      }
    },
    CLEAR_RETURN_INFO (state) {
      state.returnInfo = []
    },
    FORMAT_CLAIM_RESULT (state) {
      if (state.claimResult) {
        makeOrderProductOptionName(state.claimResult.claimedOption, state.claimResult.claimedOption.optionUsed, state.claimResult.claimedOption.brandName, state.claimResult.claimedOption.productName)
        if (state.claimResult.returnAddress) {
          const showReturnAddress = state.claimResult.returnAddress
          state.claimResult.showReturnAddress = showReturnAddress
        }

        if (state.claimResult.claimedOption.claimStatusType) {
          if (state.claimResult.claimedOption.claimStatusType === 'CANCEL_REQUEST' || state.claimResult.claimedOption.claimStatusType === 'CANCEL_PROC_REQUEST_REFUND' || state.claimResult.claimedOption.claimStatusType === 'CANCEL_PROC_WAITING_REFUND') {
            state.claimResult.claimedOption.statusLabel = '취소처리중'
          } else if (state.claimResult.claimedOption.claimStatusType === 'CANCEL_NO_REFUND' || state.claimResult.claimedOption.claimStatusType === 'CANCEL_DONE') {
            state.claimResult.claimedOption.statusLabel = '취소완료'
          } else if (state.claimResult.claimedOption.claimStatusType === 'RETURN_REQUEST' || state.claimResult.claimedOption.claimStatusType === 'RETURN_REJECT_REQUEST' || state.claimResult.claimedOption.claimStatusType === 'RETURN_PROC_BEFORE_RECEIVE' || state.claimResult.claimedOption.claimStatusType === 'RETURN_PROC_REQUEST_REFUND' || state.claimResult.claimedOption.claimStatusType === 'RETURN_PROC_WAITING_REFUND') {
            state.claimResult.claimedOption.statusLabel = '반품처리중'
          } else if (state.claimResult.claimedOption.claimStatusType === 'RETURN_DONE') {
            state.claimResult.claimedOption.statusLabel = '반품완료'
          }
        } else {
          if (state.claimResult.claimedOption.orderStatusType === 'PAY_DONE') {
            state.claimResult.claimedOption.statusLabel = '결제완료'
          } else if (state.claimResult.claimedOption.orderStatusType === 'PRODUCT_PREPARE') {
            state.claimResult.claimedOption.statusLabel = '상품준비중'
          } else if (state.claimResult.claimedOption.orderStatusType === 'DELIVERY_PREPARE') {
            state.claimResult.claimedOption.statusLabel = '배송준비중'
          } else if (state.claimResult.claimedOption.orderStatusType === 'DELIVERY_ING') {
            state.claimResult.claimedOption.statusLabel = '배송중'
          } else if (state.claimResult.claimedOption.orderStatusType === 'DELIVERY_DONE') {
            state.claimResult.claimedOption.statusLabel = '배송완료'
          } else if (state.claimResult.claimedOption.orderStatusType === 'BUY_CONFIRM') {
            state.claimResult.claimedOption.statusLabel = '구매완료'
          }
        }
      }
    },
    FORMAT_MULTI_CLAIM_RESULT (state) {
      if (state.multiClaimResult) {
        // makeOrderProductOptionName(state.multiClaimResult.claimedOption, state.multiClaimResult.claimedOption.optionUsed, state.multiClaimResult.claimedOption.brandName, state.multiClaimResult.claimedOption.productName)
        state.multiClaimResult.claimedOptions.forEach(option => {
          makeOrderProductOptionName(option, option.optionUsed, option.brandName, option.productName)
          if (option.claimStatusType) {
            if (option.claimStatusType === 'CANCEL_REQUEST' || option.claimStatusType === 'CANCEL_PROC_REQUEST_REFUND' || option.claimStatusType === 'CANCEL_PROC_WAITING_REFUND') {
              option.statusLabel = '취소처리중'
            } else if (option.claimStatusType === 'CANCEL_NO_REFUND' || option.claimStatusType === 'CANCEL_DONE') {
              option.statusLabel = '취소완료'
            } else if (option.claimStatusType === 'RETURN_REQUEST' || option.claimStatusType === 'RETURN_REJECT_REQUEST' || option.claimStatusType === 'RETURN_PROC_BEFORE_RECEIVE' || option.claimStatusType === 'RETURN_PROC_REQUEST_REFUND' || option.claimStatusType === 'RETURN_PROC_WAITING_REFUND') {
              option.statusLabel = '반품처리중'
            } else if (option.claimStatusType === 'RETURN_DONE') {
              option.statusLabel = '반품완료'
            }
          } else {
            if (option.orderStatusType === 'PAY_DONE') {
              option.statusLabel = '결제완료'
            } else if (option.orderStatusType === 'PRODUCT_PREPARE') {
              option.statusLabel = '상품준비중'
            } else if (option.orderStatusType === 'DELIVERY_PREPARE') {
              option.statusLabel = '배송준비중'
            } else if (option.orderStatusType === 'DELIVERY_ING') {
              option.statusLabel = '배송중'
            } else if (option.orderStatusType === 'DELIVERY_DONE') {
              option.statusLabel = '배송완료'
            } else if (option.orderStatusType === 'BUY_CONFIRM') {
              option.statusLabel = '구매완료'
            }
          }
        })

        if (state.multiClaimResult.returnAddress) {
          const showReturnAddress = state.multiClaimResult.returnAddress
          state.multiClaimResult.showReturnAddress = showReturnAddress
        }
      }
    },
    FORMAT_ORDER (state, commit) {
      if (state.order) {
        Vue.set(state.order, 'showYmd', getStrDate(state.order.orderYmdt, '.'))

        if (state.order.payInfo && state.order.payInfo.cardInfo) {
          const cardInfo = state.order.payInfo.cardInfo
          if (cardInfo.installmentPeriod > 0) {
            if (cardInfo.noInterest) {
              cardInfo.installmentLabel = cardInfo.installmentPeriod + '개월 무이자'
            } else {
              cardInfo.installmentLabel = cardInfo.installmentPeriod + '개월'
            }
          } else {
            cardInfo.installmentLabel = '일시불'
          }
        }

        let showLabelFlg = false
        let showButtonFlg = true

        state.order.orderOptions = []
        state.order.orderOptionsGroupByPartner.forEach(partner => {
          partner.orderOptionsGroupByDelivery.forEach(delivery => {
            delivery.orderOptions.forEach(option => {
              commit('FORMAT_OPTION', option)
              state.order.orderOptions.push(option)

              if (!option.claimStatusType && (option.orderStatusType === 'PRODUCT_PREPARE' || option.orderStatusType === 'DELIVERY_PREPARE')) {
                showLabelFlg = true
              }
              if (option.claimStatusType || option.orderStatusType !== 'PAY_DONE') {
                showButtonFlg = false
              }
            })
          })
        })

        const firstamt = state.order.firstOrderAmount
        const showPriceInfo = {}
        showPriceInfo.standardAmt = firstamt.standardAmt
        showPriceInfo.totalDisAmt = firstamt.additionalDiscountAmt + firstamt.immediateDiscountAmt + firstamt.cartCouponDiscountAmt + firstamt.productCouponDiscountAmt
        showPriceInfo.immediateDiscountAmt = firstamt.immediateDiscountAmt
        showPriceInfo.additionalDiscountAmt = firstamt.additionalDiscountAmt
        showPriceInfo.productCouponDiscountAmt = firstamt.productCouponDiscountAmt
        showPriceInfo.cartCouponDiscountAmt = firstamt.cartCouponDiscountAmt
        showPriceInfo.totalDeliveryAmt = (firstamt.deliveryAmt - firstamt.deliveryCouponDiscountAmt) + firstamt.remoteDeliveryAmt
        showPriceInfo.deliveryAmt = firstamt.deliveryAmt
        showPriceInfo.deliveryCouponDiscountAmt = firstamt.deliveryCouponDiscountAmt
        showPriceInfo.remoteDeliveryAmt = firstamt.remoteDeliveryAmt
        showPriceInfo.payAmt = firstamt.standardAmt + (firstamt.deliveryAmt - firstamt.deliveryCouponDiscountAmt) + firstamt.remoteDeliveryAmt
        showPriceInfo.subPayAmt = firstamt.subPayAmt
        showPriceInfo.chargeAmt = firstamt.chargeAmt

        if (state.order.refundInfos) {
          const refundInfos = state.order.refundInfos
          let refundPayAmt = 0
          refundInfos.forEach(refundInfo => {
            refundPayAmt += refundInfo.refundPayAmt
          })
          showPriceInfo.refundPayAmt = formatCurrency(refundPayAmt)
        }

        state.order.showPriceInfo = showPriceInfo
        const orderAddress = state.order.shippingAddress
        let contacts = telnoFormat(orderAddress.receiverContact1)
        Vue.set(orderAddress, 'receiverContact1One', contacts[0])
        Vue.set(orderAddress, 'receiverContact1Two', contacts[1])
        Vue.set(orderAddress, 'receiverContact1Three', contacts[2])
        contacts = telnoFormat(orderAddress.receiverContact2)
        Vue.set(orderAddress, 'receiverContact2One', contacts[0])
        Vue.set(orderAddress, 'receiverContact2Two', contacts[1])
        Vue.set(orderAddress, 'receiverContact2Three', contacts[2])
        Vue.set(orderAddress, 'deliveryMemo', state.order.deliveryMemo)
        orderAddress.orderNo = state.order.orderNo
        orderAddress.showLabelFlg = showLabelFlg
        orderAddress.showButtonFlg = showButtonFlg

        state.order.orderAddress = orderAddress
      }
    },
    FORMAT_ORDERLIST (state, commit) {
      state.sixMonths = getSixMonths()

      if (state.orders && state.orders.length > 0) {
        state.orders.forEach(order => {
          Vue.set(order, 'showYmd', getStrDate(order.orderYmdt, '.'))

          order.orderOptions.forEach(option => {
            commit('FORMAT_OPTION', option)
          })
        })
      }
    },
    FORMAT_OPTION (state, option) {
      option.showOptions = []
      makeOrderProductOptionName(option, option.optionUsed, option.brandName, option.productName)
      let price = option.price
      option.buttons = []
      if (option.claimStatusType) {
        if (option.claimStatusType === 'CANCEL_REQUEST' || option.claimStatusType === 'CANCEL_PROC_REQUEST_REFUND' || option.claimStatusType === 'CANCEL_PROC_WAITING_REFUND') {
          option.statusLabel = '취소처리중'
          option.buttonCount = 0
          option.nextActions.forEach(nextAction => {
            if (nextAction.nextActionType === 'VIEW_CLAIM') {
              option.buttonCount += 1
              option.buttons.push('CANCEL_VIEW_CLAIM_ING')
            } else if (nextAction.nextActionType === 'WITHDRAW_CANCEL') {
              option.buttonCount += 1
              option.buttons.push('WITHDRAW_CANCEL')
            }
          })
        } else if (option.claimStatusType === 'CANCEL_NO_REFUND' || option.claimStatusType === 'CANCEL_DONE') {
          option.statusLabel = '취소완료'
          option.buttonCount = 1
          option.buttons.push('CANCEL_VIEW_CLAIM')
        } else if (option.claimStatusType === 'RETURN_REQUEST' || option.claimStatusType === 'RETURN_REJECT_REQUEST' || option.claimStatusType === 'RETURN_PROC_BEFORE_RECEIVE' || option.claimStatusType === 'RETURN_PROC_REQUEST_REFUND' || option.claimStatusType === 'RETURN_PROC_WAITING_REFUND') {
          option.statusLabel = '반품처리중'
          option.buttonCount = 0
          option.nextActions.forEach(nextAction => {
            if (nextAction.nextActionType === 'VIEW_CLAIM') {
              option.buttonCount += 1
              option.buttons.push('RETURN_VIEW_CLAIM_ING')
            } else if (nextAction.nextActionType === 'WITHDRAW_RETURN') {
              option.buttonCount += 1
              option.buttons.push('WITHDRAW_RETURN')
            }
          })
        } else if (option.claimStatusType === 'RETURN_DONE') {
          option.statusLabel = '반품완료'
          option.buttonCount = 1
          option.buttons.push('RETURN_VIEW_CLAIM')
        }
      } else {
        if (option.orderStatusType === 'PAY_DONE') {
          option.statusLabel = '결제완료'
          if (option.deliverable) {
            option.buttonCount = 1
            if (option.refundable) {
              option.buttons.push('CANCEL')
            } else {
              option.buttons.push('NOT_REFUNDABLE')
            }
          }
        } else if (option.orderStatusType === 'PRODUCT_PREPARE') {
          option.statusLabel = '상품준비중'
          if (option.deliverable) {
            option.buttonCount = 1
            if (option.refundable) {
              option.buttons.push('CANCEL')
            } else {
              option.buttons.push('NOT_REFUNDABLE')
            }
          }
        } else if (option.orderStatusType === 'DELIVERY_PREPARE') {
          option.statusLabel = '배송준비중'
          if (option.deliverable) {
            option.buttonCount = 1
            if (option.refundable) {
              option.buttons.push('CANCEL')
            } else {
              option.buttons.push('NOT_REFUNDABLE')
            }
          }
        } else if (option.orderStatusType === 'DELIVERY_ING') {
          option.statusLabel = '배송중'
          option.buttonCount = 0
          option.nextActions.forEach(nextAction => {
            if (nextAction.nextActionType === 'VIEW_DELIVERY') {
              option.buttonCount += 1
              option.buttons.push('VIEW_DELIVERY')
            } else if (nextAction.nextActionType === 'WRITE_REVIEW') {
              option.buttonCount += 1
              option.buttons.push('WRITE_REVIEW')
            } else if (nextAction.nextActionType === 'RETURN') {
              if (option.deliverable && option.refundable) {
                option.buttonCount += 1
                option.buttons.push('RETURN')
              }
            }
          })
          if (option.deliverable && !option.refundable) {
            option.buttonCount += 1
            option.buttons.push('NOT_REFUNDABLE')
          }
        } else if (option.orderStatusType === 'DELIVERY_DONE') {
          option.statusLabel = '배송완료'
          option.buttonCount = 0
          option.nextActions.forEach(nextAction => {
            if (nextAction.nextActionType === 'VIEW_DELIVERY') {
              option.buttonCount += 1
              option.buttons.push('VIEW_DELIVERY')
            } else if (nextAction.nextActionType === 'WRITE_REVIEW') {
              option.buttonCount += 1
              option.buttons.push('WRITE_REVIEW')
            } else if (nextAction.nextActionType === 'RETURN') {
              if (option.deliverable && option.refundable) {
                option.buttonCount += 1
                option.buttons.push('RETURN')
              }
            }
          })
          if (option.deliverable && !option.refundable) {
            option.buttonCount += 1
            option.buttons.push('NOT_REFUNDABLE')
          }
        } else if (option.orderStatusType === 'BUY_CONFIRM') {
          option.statusLabel = '구매완료'
          option.buttonCount = 0
          option.nextActions.forEach(nextAction => {
            if (nextAction.nextActionType === 'WRITE_REVIEW') {
              option.buttonCount += 1
              option.buttons.push('WRITE_REVIEW')
            }
          })
        } else if (option.orderStatusType === 'DEPOSIT_WAIT') {
          option.statusLabel = '입금대기'
          option.buttonCount = 1
          option.buttons.push('DEPOSIT_WAIT')
        }
      }

      const orderBy = ['CANCEL', 'VIEW_DELIVERY', 'WRITE_REVIEW', 'CANCEL_VIEW_CLAIM_ING', 'CANCEL_VIEW_CLAIM', 'RETURN_VIEW_CLAIM_ING', 'RETURN_VIEW_CLAIM', 'RETURN', 'WITHDRAW_CANCEL', 'WITHDRAW_RETURN', 'NOT_REFUNDABLE', 'DEPOSIT_WAIT']
      const sortArray = []
      option.buttons.forEach((button, index) => {
        sortArray.push(orderBy.indexOf(button))
      })
      option.buttons = []
      sortArray.sort((i, j) => { return i > j ? 1 : -1 })
      sortArray.forEach((value) => {
        option.buttons.push(orderBy[value])
      })
      Vue.set(option, 'showPrice', formatCurrency(price.buyAmt))
    },
    RESET_CLAIM_ESTIMATE (state) {
      state.claimEstimate = null
    }
  },
  getters: {
    orderOptions (state, getters, rootState) {
      if (state.order) {
        let orderOptions = []
        state.order.orderOptionsGroupByPartner.forEach(partner => {
          partner.orderOptionsGroupByDelivery.forEach(delivery => {
            orderOptions.push(...delivery.orderOptions)
          })
        })
        return orderOptions
      }
    },
    viewableClaimOptions (state) {
      if (state.claimOrderOption) {
        const claimParams = []
        const multiple = state.claimOrderOption.claimableOptions
        multiple.forEach((opt, index) => {
          if (opt.orderStatusType !== 'BUY_CONFIRM' && opt.refundable) {
            Vue.set(opt, 'checkYn', false)
            claimParams.push(opt)
          }
        })
        return claimParams
      }
    }
  }
}
