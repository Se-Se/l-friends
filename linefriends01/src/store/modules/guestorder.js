import { createNcpApiStore } from '@/api'
import Vue from 'vue'
import { formatCurrency, telnoFormat } from '@/utils/StringUtils'
import { getStrDate } from '@/utils/dateUtils'
import { makeOrderProductOptionName } from '@/utils/orderUtils'
import cookies from 'js-cookie'
import ncpApi from '@/api/ncpApi'

const apiStore = createNcpApiStore([
  {
    action: '_getGuestOrder',
    property: 'guestOrder',
    path: 'guest/orders/{orderNo}',
    pathParams: ['orderNo'],
    method: 'post'
  },
  {
    action: '_getGuestOrderWithToken',
    property: 'guestOrder',
    path: 'guest/orders/{orderNo}',
    pathParams: ['orderNo'],
    method: 'get'
  },
  {
    action: '_getPassword',
    path: 'guest/orders/{orderNo}/forgot-password',
    pathParams: ['orderNo'],
    method: 'get',
    queryParams: true
  },
  {
    action: '_editDeliveries',
    property: 'deliverie',
    path: 'guest/orders/{orderNo}/deliveries',
    pathParams: ['orderNo'],
    method: 'put'
  },
  {
    action: '_getGuestClaim',
    property: 'guestClaim',
    path: 'guest/order-options/{orderOptionNo}/claim',
    pathParams: ['orderOptionNo'],
    method: 'get',
    queryParams: true
  },
  {
    action: '_postGuestClaimCancel',
    path: 'guest/order-options/{orderOptionNo}/claim/cancel',
    pathParams: ['orderOptionNo'],
    method: 'post'
  },
  {
    action: '_postGuestClaimReturn',
    path: 'guest/order-options/{orderOptionNo}/claim/return',
    pathParams: ['orderOptionNo'],
    method: 'post'
  },
  {
    action: '_getClaimResult',
    property: 'claimResult',
    path: 'guest/order-options/{orderOptionNo}/claim/result',
    pathParams: ['orderOptionNo']
  },
  {
    action: '_putGuestClaimWithdraw',
    path: 'guest/order-options/{orderOptionNo}/claim/withdraw',
    pathParams: ['orderOptionNo'],
    method: 'put'
  },
  {
    action: '_getGuestClaimEstimate',
    property: 'guestClaimEstimate',
    path: 'guest/order-options/{orderOptionNo}/claim/estimate',
    pathParams: ['orderOptionNo']
  },
  {
    action: '_postGuestMultiClaimEstimate',
    property: 'guestMultiClaimEstimate',
    path: 'guest/claim/estimate',
    method: 'post'
  },
  {
    action: '_postGuestMultiClaimReturn',
    property: 'guestMultiClaimReturn',
    path: 'guest/claim/return',
    method: 'post'
  },
  {
    action: '_getGuestMultiClaimResult',
    property: 'guestMultiClaimResult',
    path: 'guest/claims/{claimNo}/result',
    pathParams: ['claimNo']
  },
  {
    action: '_putGuestMultiClaimWithdraw',
    path: 'guest/claims/{claimNo}/withdraw',
    pathParams: ['claimNo'],
    method: 'put'
  }
])

export default {
  namespaced: true,
  state: {
    guestClaimPriceInfo: {
      buyAmt: 0,
      discountAmt: 0,
      discountCountAmt: 0,
      standardPrice: 0,
      standardAmt: 0
    }
  },
  mixins: [apiStore],
  actions: {
    async getGuestOrder ({ state, commit, dispatch }, { orderNo, password }) {
      await dispatch('_getGuestOrder', { data: { orderRequestType: 'ALL', password }, params: { orderNo } })
      cookies.set('guestToken', state.guestOrder.guestToken)
      ncpApi.defaults.headers.guestToken = state.guestOrder.guestToken
      return state.guestOrder.orderNo
    },
    async getGuestOrderDetail ({ state, commit, dispatch }, orderNo) {
      await dispatch('_getGuestOrderWithToken', { data: { orderRequestType: 'ALL' }, params: { orderNo } })
      commit('FORMAT_ORDER', commit)
    },
    async getPassword ({ commit, dispatch, rootState }, noneMeberParams) {
      await dispatch('_getPassword', { params: noneMeberParams })
    },
    async editDeliveries ({ state, dispatch, commit, rootState }, deliveriesParam) {
      await dispatch('_editDeliveries', { data: deliveriesParam.addressRequest, params: { add: false, orderNo: deliveriesParam.orderNo } })
    },
    async getGuestClaim ({ state, commit, dispatch }, { claimParams }) {
      await dispatch('_getGuestClaim', { params: { orderOptionNo: claimParams.orderOptionNo, claimType: claimParams.claimType } })
      commit('CALCULATE_ORDER_OPTION')
    },
    postGuestClaimCancel ({ state, dispatch, commit, rootState }, cancelparam) {
      return dispatch('_postGuestClaimCancel', { data: cancelparam, params: { orderOptionNo: cancelparam.orderOptionNo } })
    },
    postGuestClaimReturn ({ state, dispatch, commit, rootState }, returntparam) {
      return dispatch('_postGuestClaimReturn', { data: returntparam, params: { orderOptionNo: returntparam.orderOptionNo } })
    },
    async getGuestClaimResult ({ state, dispatch, commit, rootState }, { claimParams }) {
      await dispatch('_getClaimResult', { params: { orderOptionNo: claimParams.orderOptionNo } })
      commit('FORMAT_CLAIM_RESULT')
    },
    async putGuestClaimWithdraw ({ state, dispatch, commit, rootState }, withdrawparam) {
      await dispatch('_putGuestClaimWithdraw', { data: withdrawparam, params: { orderOptionNo: withdrawparam.orderOptionNo } })
    },
    async getGuestCancelEstimate ({ state, commit, dispatch }, claimParams) {
      if (claimParams.claimReasonType !== '') {
        await dispatch('_getGuestClaimEstimate', { params: { orderOptionNo: claimParams.orderOptionNo, claimType: claimParams.claimType, productCnt: claimParams.productCnt, claimReasonType: claimParams.claimReasonType } })
      }
    },
    async getGuestReturnEstimate ({ state, commit, dispatch }, claimParams) {
      if (claimParams.claimReasonType !== '') {
        await dispatch('_getGuestClaimEstimate', { params: { orderOptionNo: claimParams.orderOptionNo, claimType: claimParams.claimType, productCnt: claimParams.productCnt, claimReasonType: claimParams.claimReasonType, returnWayType: 'SELLER_COLLECT' } })
      }
    },
    async putGuestMultiClaimWithdraw ({ state, dispatch, commit, rootState }, withdrawparam) {
      await dispatch('_putGuestMultiClaimWithdraw', { data: withdrawparam, params: { claimNo: withdrawparam.claimNo } })
    }
  },
  mutations: {
    FORMAT_CLAIM_RESULT (state) {
      if (state.claimResult) {
        makeOrderProductOptionName(state.claimResult.claimedOption, state.claimResult.claimedOption.optionUsed, state.claimResult.claimedOption.brandName, state.claimResult.claimedOption.productName)
        if (state.claimResult.returnAddress) {
          const showReturnAddress = state.claimResult.returnAddress
          let contacts = telnoFormat(state.claimResult.returnAddress.contact1)
          Vue.set(showReturnAddress, 'contact1_1', contacts[0])
          Vue.set(showReturnAddress, 'contact1_2', contacts[1])
          Vue.set(showReturnAddress, 'contact1_3', contacts[2])
          contacts = telnoFormat(state.claimResult.returnAddress.contact2)
          Vue.set(showReturnAddress, 'contact2_1', contacts[0])
          Vue.set(showReturnAddress, 'contact2_2', contacts[1])
          Vue.set(showReturnAddress, 'contact2_3', contacts[2])
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
    FORMAT_ORDER (state, commit) {
      if (state.guestOrder) {
        Vue.set(state.guestOrder, 'showYmd', getStrDate(state.guestOrder.orderYmdt, '.'))

        if (state.guestOrder.payInfo && state.guestOrder.payInfo.cardInfo) {
          const cardInfo = state.guestOrder.payInfo.cardInfo
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

        state.guestOrder.orderOptions = []
        state.guestOrder.orderOptionsGroupByPartner.forEach(partner => {
          partner.orderOptionsGroupByDelivery.forEach(delivery => {
            delivery.orderOptions.forEach(option => {
              commit('FORMAT_OPTION', option)
              state.guestOrder.orderOptions.push(option)

              if (!option.claimStatusType && (option.orderStatusType === 'PRODUCT_PREPARE' || option.orderStatusType === 'DELIVERY_PREPARE')) {
                showLabelFlg = true
              }
              if (option.claimStatusType || option.orderStatusType !== 'PAY_DONE') {
                showButtonFlg = false
              }
            })
          })
        })

        const firstamt = state.guestOrder.firstOrderAmount
        const showPriceInfo = {}
        showPriceInfo.showStandardAmt = formatCurrency(firstamt.standardAmt)
        showPriceInfo.totalDisAmt = formatCurrency(firstamt.additionalDiscountAmt + firstamt.immediateDiscountAmt + firstamt.cartCouponDiscountAmt + firstamt.productCouponDiscountAmt)
        showPriceInfo.immDisAmt = formatCurrency(firstamt.immediateDiscountAmt)
        showPriceInfo.addDisAmt = formatCurrency(firstamt.additionalDiscountAmt)
        showPriceInfo.proCouDisAmt = formatCurrency(firstamt.productCouponDiscountAmt)
        showPriceInfo.cartCouDisAmt = formatCurrency(firstamt.cartCouponDiscountAmt)
        showPriceInfo.totalDeliveryAmt = formatCurrency((firstamt.deliveryAmt - firstamt.deliveryCouponDiscountAmt) + firstamt.remoteDeliveryAmt)
        showPriceInfo.deliveryAmt = formatCurrency(firstamt.deliveryAmt)
        showPriceInfo.delCouDisAmt = formatCurrency(firstamt.deliveryCouponDiscountAmt)
        showPriceInfo.remDelAmt = formatCurrency(firstamt.remoteDeliveryAmt)
        showPriceInfo.payAmt = formatCurrency(firstamt.payAmt)

        if (state.guestOrder.refundInfos) {
          const refundInfos = state.guestOrder.refundInfos
          let claimProductAmt = 0
          let claimSubtractionAmt = 0
          let claimDeliveryAmt = 0
          let refundPayAmt = 0
          refundInfos.forEach(refundInfo => {
            claimProductAmt += refundInfo.productAmtInfo.totalAmt
            claimSubtractionAmt += refundInfo.subtractionAmtInfo.totalAmt
            claimDeliveryAmt += refundInfo.deliveryAmtInfo.totalAmt
            refundPayAmt += refundInfo.refundPayAmt
          })
          showPriceInfo.claimProductAmt = formatCurrency(claimProductAmt)
          showPriceInfo.claimSubtractionAmt = formatCurrency(claimSubtractionAmt)
          showPriceInfo.claimDeliveryAmt = formatCurrency(claimDeliveryAmt)
          showPriceInfo.refundPayAmt = formatCurrency(refundPayAmt)
        }

        state.guestOrder.showPriceInfo = showPriceInfo

        state.guestOrder.showPriceInfo = showPriceInfo
        const orderAddress = state.guestOrder.shippingAddress
        let contacts = telnoFormat(orderAddress.receiverContact1)
        Vue.set(orderAddress, 'receiverContact1One', contacts[0])
        Vue.set(orderAddress, 'receiverContact1Two', contacts[1])
        Vue.set(orderAddress, 'receiverContact1Three', contacts[2])
        contacts = telnoFormat(orderAddress.receiverContact2)
        Vue.set(orderAddress, 'receiverContact2One', contacts[0])
        Vue.set(orderAddress, 'receiverContact2Two', contacts[1])
        Vue.set(orderAddress, 'receiverContact2Three', contacts[2])
        orderAddress.deliveryMemo = state.guestOrder.deliveryMemo
        orderAddress.orderNo = state.guestOrder.orderNo
        orderAddress.showLabelFlg = showLabelFlg
        orderAddress.showButtonFlg = showButtonFlg

        state.guestOrder.orderAddress = orderAddress
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
          option.buttonCount = 1
          if (option.nextActions.length === 1) {
            option.buttons.push('WRITE_REVIEW')
          }
        }
      }

      const orderBy = ['CANCEL', 'VIEW_DELIVERY', 'WRITE_REVIEW', 'CANCEL_VIEW_CLAIM_ING', 'CANCEL_VIEW_CLAIM', 'RETURN_VIEW_CLAIM_ING', 'RETURN_VIEW_CLAIM', 'RETURN', 'WITHDRAW_CANCEL', 'WITHDRAW_RETURN', 'NOT_REFUNDABLE']
      const sortArray = []
      option.buttons.forEach((button, index) => {
        sortArray.push(orderBy.indexOf(button))
      })
      option.buttons = []
      sortArray.sort()
      sortArray.forEach((value) => {
        option.buttons.push(orderBy[value])
      })
      Vue.set(option, 'showPrice', formatCurrency(price.buyAmt))
    },
    CALCULATE_ORDER_OPTION (state) {
      if (state.guestClaim) {
        makeOrderProductOptionName(state.guestClaim.originalOption, state.guestClaim.originalOption.optionUsed, state.guestClaim.originalOption.brandName, state.guestClaim.originalOption.productName)
        if (state.guestClaim.returnAddress) {
          const showReturnAddress = state.guestClaim.returnAddress
          let contacts = telnoFormat(state.guestClaim.returnAddress.receiverContact1)
          Vue.set(showReturnAddress, 'contact1_1', contacts[0])
          Vue.set(showReturnAddress, 'contact1_2', contacts[1])
          Vue.set(showReturnAddress, 'contact1_3', contacts[2])
          contacts = telnoFormat(state.guestClaim.returnAddress.receiverContact2)
          Vue.set(showReturnAddress, 'contact2_1', contacts[0])
          Vue.set(showReturnAddress, 'contact2_2', contacts[1])
          Vue.set(showReturnAddress, 'contact2_3', contacts[2])
          state.guestClaim.showReturnAddress = showReturnAddress
        }
      }
    },
    GUESTCLAIM_PRICE_OPTION (state) {
      state.guestClaimPriceInfo.standardAmt = state.guestClaim.originalOption.price.standardAmt
      state.guestClaimPriceInfo.discountCountAmt = (state.guestClaim.originalOption.price.immediateDiscountAmt + state.guestClaim.originalOption.price.additionalDiscountAmt) * state.guestClaim.originalOption.orderCnt
      state.guestClaimPriceInfo.standardPrice = state.guestClaim.originalOption.price.standardPrice
      state.guestClaimPriceInfo.buyAmt = state.guestClaim.originalOption.price.buyAmt
      state.guestClaimPriceInfo.discountAmt = state.guestClaim.originalOption.price.immediateDiscountAmt + state.guestClaim.originalOption.price.additionalDiscountAmt
      state.guestClaim.showOptions = []
      if (state.guestClaim.originalOption.optionUsed) {
        const optionNames = state.guestClaim.originalOption.optionName.split('|')
        const optionValues = state.guestClaim.originalOption.optionValue.split('|')
        optionNames.forEach((tempName, index) => {
          state.guestClaim.showOptions.push(tempName + ':' + optionValues[index])
        })
        if (state.guestClaim.originalOption.inputs && state.guestClaim.originalOption.inputs.length > 0) {
          state.guestClaim.originalOption.inputs.forEach(optionInput => {
            state.guestClaim.showOptions.push(optionInput.inputLabel + ':' + optionInput.inputValue)
          })
        }
        if (state.guestClaim.originalOption.price.addPrice > 0) {
          let last = state.guestClaim.showOptions.pop()
          let lastoption = last + ' (+' + formatCurrency(state.guestClaim.originalOption.price.addPrice) + '원)'
          state.guestClaim.showOptions.push(lastoption)
        }
      } else {
        state.guestClaim.showOptions.push('본품')
      }
      state.guestClaim.showOptions.push(state.guestClaim.originalOption.orderCnt + '개')
    },
    RESET_AMT (state, returnBuyAmt) {
      state.guestClaimPriceInfo.buyAmt = returnBuyAmt
    },
    RESET_CLAIM_ESTIMATE (state) {
      state.claimEstimate = null
    }
  }
}
