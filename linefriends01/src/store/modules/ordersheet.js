import { createNcpApiStore } from '@/api'
import { makeOrderProductOptionInfo, setPrevOrderInfoInStoreage, getCalculationRequest } from '@/utils/orderUtils'
import router from '@/router'

const apiStore = createNcpApiStore([
  {
    action: '_postOrderSheets',
    property: 'ordersheetno',
    path: 'order-sheets',
    method: 'post'
  },
  {
    action: '_getOrderSheets',
    property: 'ordersheet',
    path: 'order-sheets/{orderSheetNo}',
    pathParams: ['orderSheetNo']
  },
  {
    action: '_orderCoupons',
    property: 'orderCoupons',
    path: 'order-sheets/{orderSheetNo}/coupons',
    pathParams: ['orderSheetNo']
  },
  {
    action: '_calculate',
    property: 'orderCoupons',
    path: 'order-sheets/{orderSheetNo}/coupons/calculate',
    pathParams: ['orderSheetNo'],
    method: 'post'
  },
  {
    action: '_maxCalculateOrder',
    property: 'orderCoupons',
    path: 'order-sheets/{orderSheetNo}/coupons/maximum',
    pathParams: ['orderSheetNo'],
    method: 'post'
  },
  {
    action: '_maxCoupons',
    property: 'maxCoupons',
    path: 'order-sheets/{orderSheetNo}/coupons/maximum',
    pathParams: ['orderSheetNo'],
    method: 'post'
  },
  {
    action: '_calculateOrder',
    property: 'orderCaResult',
    path: 'order-sheets/{orderSheetNo}/calculate',
    pathParams: ['orderSheetNo'],
    method: 'post'
  },
  {
    action: '_applyCouponOrder',
    property: 'orderCouponsApplyResult',
    path: 'order-sheets/{orderSheetNo}/coupons/apply',
    pathParams: ['orderSheetNo'],
    method: 'post'
  }
])

export default {
  namespaced: true,
  mixins: [apiStore],
  state: {
    couponAmt: 0,
    couponRequestCopy: null,
    couponRequest: {
      cartCouponIssueNo: 0,
      deliveryCouponIssueNo: 0,
      promotionCode: '',
      productCoupons: []
    },
    usePaycoCoupon: false,
    newAddress: false,
    currRecent: null,
    deliveryMemo: '',
    payType: 'PAYCO',
    pgType: 'PAYCO',
    otherCouponUsable: true,
    addressRequestCopy: null,
    accumulationUseAmtCopy: null
  },
  actions: {
    async getSheetNoInit ({ state, dispatch, commit, rootState, rootGetters }, to) {
      await dispatch('getSheetNo', { searchProductID: to.query.searchProductID, productNo: to.query.productNo, replaceFlg: true })
    },
    async getSheetNo ({ state, dispatch, commit, rootState, rootGetters }, { searchProductID, productNo, replaceFlg }) {
      const orderInfo = JSON.parse(window.localStorage.orderInfo)
      const option = decodeURIComponent(orderInfo.option)
      if (option && option.length > 0) {
        const products = JSON.parse(option)
        let errFlg = false
        let urlParams = ''
        const cartNos = []
        products.forEach(item => {
          if (item.cartNo) {
            cartNos.push(item.cartNo)
          }
        })
        let paramsFlg = false
        if (cartNos.length > 0) {
          urlParams += '?cartNos=' + encodeURIComponent(JSON.stringify(cartNos))
          paramsFlg = true
        }
        if (productNo) {
          if (paramsFlg) {
            urlParams += '&productNo=' + productNo
          } else {
            urlParams += '?productNo=' + productNo
            paramsFlg = true
          }
        }
        if (searchProductID) {
          if (paramsFlg) {
            urlParams += '&searchProductID=' + searchProductID
          } else {
            urlParams += '?searchProductID=' + searchProductID
          }
        }
        const res = await dispatch('_postOrderSheets', { data: { products, cartNos } }).catch(e => {
          errFlg = true
          switch (e.data.code) {
            case 'PPE0006':
              router.push({
                path: `/member/login?redirect=${encodeURIComponent(`/order/getsheetno${urlParams}`)}`
              })
              break
            case 'O3336':
              break
            case 'PPE0001':
            case 'PPE0008':
              const urlInfo = orderInfo.fromUrl.split('#')
              const path = urlInfo[0]
              const param = urlInfo[1]
              router.replace({
                path: path + '#' + (param && !isNaN(Number(param)) ? Number(param) + 1 : 0)
              })
              break
            default:
              if (replaceFlg) {
                router.replace({
                  path: orderInfo.fromUrl
                })
              }
              break
          }
        })
        if (errFlg) {
          return
        }

        let url = '/order/' + res.data.orderSheetNo + urlParams

        if (!rootGetters.isLogined) {
          const redirectUrl = `${location.protocol}//${location.host}${url}`
          router.push({
            path: `/member/login?redirect=${encodeURIComponent(redirectUrl)}&guest=true`
          })
          return
        }
        setPrevOrderInfoInStoreage(res.data.orderSheetNo)
        if (replaceFlg) {
          router.replace({
            path: url
          })
        } else {
          router.push({
            path: url
          })
        }
      } else {
        router.push({
          path: '/etc/dataerror'
        })
      }
    },
    async fetchOrder ({ state, dispatch, commit, rootGetters }, orderSheetNo) {
      await dispatch('_getOrderSheets', { params: { orderSheetNo } })

      if (rootGetters.isLogined) {
        await dispatch('_maxCoupons', { params: { orderSheetNo } })
        await dispatch('_orderCoupons', { params: { orderSheetNo } })
        commit('CLEAR_REPEAT_COUPON')
        commit('INIT_COUPONREQUEST', state.couponRequest)
        commit('SUM_APPLYED_COUPONAMT', commit)
        commit('COPY_COUPONREQUEST')
        commit('SET_USE_PAYCOCOUPON')
      }
    },
    async resetConpons ({ dispatch, commit }, { orderSheetNo, couponRequest }) {
      let couponRequestCopy = JSON.parse(JSON.stringify(couponRequest))
      couponRequestCopy.cartCouponIssueNo = 0
      couponRequestCopy.deliveryCouponIssueNo = 0
      const tempProductCoupons = []
      couponRequest.productCoupons.forEach(item => {
        let tempProduct = JSON.parse(JSON.stringify(item))
        tempProduct.couponIssueNo = 0
        tempProduct.plusCouponIssueNo = 0
        tempProduct.couponDisable.forEach(tempCoupon => {
          tempCoupon.disable = false
          tempCoupon.usable = true
        })
        tempProduct.couponPlusDisable.forEach(tempCoupon => {
          tempCoupon.disable = false
          tempCoupon.usable = true
        })
        tempProductCoupons.push(tempProduct)
      })
      couponRequestCopy.productCoupons = tempProductCoupons
      commit('SET_COUPONREQUEST_COPY', couponRequestCopy)
      await dispatch('calculateConpons', { orderSheetNo, couponRequest: couponRequestCopy })
    },
    async calculateConpons ({ state, dispatch, commit }, { orderSheetNo, couponRequest }) {
      const couponRequestCopy = JSON.parse(JSON.stringify(couponRequest))
      if (couponRequestCopy.productCoupons.length > 0) {
        couponRequestCopy.productCoupons = couponRequestCopy.productCoupons.filter((item) => item.couponIssueNo !== 0 || item.plusCouponIssueNo !== 0)
      }
      await dispatch('_calculate', { params: { orderSheetNo }, data: couponRequestCopy })
      commit('CLEAR_REPEAT_COUPON')
      commit('INIT_COUPONREQUEST', couponRequest)
      commit('SET_COUPON_SELECTED', { couponRequest })
    },
    async maxCalculateConpons ({ state, dispatch, commit, rootGetters }, { orderSheetNo, couponRequest }) {
      await dispatch('_maxCalculateOrder', { params: { orderSheetNo } })
      commit('CLEAR_REPEAT_COUPON')
      commit('INIT_COUPONREQUEST', couponRequest)
      commit('SET_COUPON_SELECTED', { couponRequest })
    },
    async calculateOrderConpons ({ state, dispatch, commit, rootGetters }, { orderSheetNo, addressRequest }) {
      addressRequest.couponRequest = state.couponRequest
      state.addressRequestCopy = addressRequest
      addressRequest.accumulationUseAmt = 0
      await dispatch('_calculateOrder', { params: { orderSheetNo }, data: getCalculationRequest(addressRequest) })
      commit('UPDATE_ORDERSHEET_PAYMENTS')
    },
    async calculateOrderAccumulation ({ state, dispatch, commit, rootState }, { orderSheetNo, accumulationAmt }) {
      let tempCalculateRequest = {}
      if (state.addressRequestCopy) {
        state.addressRequestCopy.couponRequest = state.couponRequestCopy
        state.addressRequestCopy.accumulationUseAmt = accumulationAmt
      } else {
        let recentAddresses = rootState.shippingaddresses.recentAddresses
        tempCalculateRequest.addressRequest = recentAddresses && recentAddresses.length > 0 ? recentAddresses[0] : {}
        tempCalculateRequest.couponRequest = state.couponRequestCopy
        tempCalculateRequest.accumulationUseAmt = accumulationAmt
      }
      state.addressRequestCopy = state.addressRequestCopy ? state.addressRequestCopy : tempCalculateRequest
      state.accumulationUseAmtCopy = accumulationAmt
      await dispatch('_calculateOrder', { params: { orderSheetNo }, data: getCalculationRequest(state.addressRequestCopy) })
      commit('UPDATE_ORDERSHEET_PAYMENTS')
    },
    async applyCouponOrder ({ state, dispatch, commit, rootGetters, rootState }, { orderSheetNo }) {
      const couponReq = JSON.parse(JSON.stringify(state.couponRequestCopy))
      if (couponReq.productCoupons.length > 0) {
        couponReq.productCoupons = couponReq.productCoupons.filter((item) => item.couponIssueNo !== 0 || item.plusCouponIssueNo !== 0)
      }
      await dispatch('_applyCouponOrder', { params: { orderSheetNo }, data: couponReq })
      // commit('UPDATE_ORDERSHEET_PAYMENTS_COUPON')
      await dispatch('_getOrderSheets', { params: { orderSheetNo } })
      commit('SUM_APPLYED_COUPONAMT', commit)

      let tempCalculateRequest = {}
      if (state.addressRequestCopy) {
        state.addressRequestCopy.couponRequest = couponReq
        if (state.accumulationUseAmtCopy) {
          state.addressRequestCopy.accumulationUseAmt = state.accumulationUseAmtCopy
        }
      } else {
        let recentAddresses = rootState.shippingaddresses.recentAddresses
        tempCalculateRequest.addressRequest = recentAddresses && recentAddresses.length > 0 ? recentAddresses[0] : {}
        tempCalculateRequest.couponRequest = couponReq
        if (state.accumulationUseAmtCopy) {
          tempCalculateRequest.accumulationUseAmt = state.accumulationUseAmtCopy
        }
      }
      state.addressRequestCopy = state.addressRequestCopy === null ? tempCalculateRequest : state.addressRequestCopy
      await dispatch('_calculateOrder', { params: { orderSheetNo }, data: getCalculationRequest(state.addressRequestCopy) })
      commit('UPDATE_ORDERSHEET_PAYMENTS')
    },
    async applyCouponOrderReset ({ state, dispatch, commit, rootGetters, rootState }, { orderSheetNo }) {
      const couponReq = {
        cartCouponIssueNo: 0,
        deliveryCouponIssueNo: 0,
        productCoupons: [],
        promotionCode: ''

      }
      await dispatch('_applyCouponOrder', { params: { orderSheetNo }, data: couponReq })
      // commit('UPDATE_ORDERSHEET_PAYMENTS_COUPON')
      await dispatch('_getOrderSheets', { params: { orderSheetNo } })
      commit('SUM_APPLYED_COUPONAMT', commit)

      let tempCalculateRequest = {}
      if (state.addressRequestCopy) {
        state.addressRequestCopy.couponRequest = couponReq
        if (state.accumulationUseAmtCopy) {
          state.addressRequestCopy.accumulationUseAmt = state.accumulationUseAmtCopy
        }
      } else {
        let recentAddresses = rootState.shippingaddresses.recentAddresses
        tempCalculateRequest.addressRequest = recentAddresses && recentAddresses.length > 0 ? recentAddresses[0] : {}
        tempCalculateRequest.couponRequest = couponReq
        if (state.accumulationUseAmtCopy) {
          tempCalculateRequest.accumulationUseAmt = state.accumulationUseAmtCopy
        }
      }
      state.addressRequestCopy = state.addressRequestCopy === null ? tempCalculateRequest : state.addressRequestCopy
      await dispatch('_calculateOrder', { params: { orderSheetNo }, data: getCalculationRequest(state.addressRequestCopy) })
      commit('UPDATE_ORDERSHEET_PAYMENTS')
    }
  },
  mutations: {
    SUM_APPLYED_COUPONAMT (state, commit) {
      const paymentInfo = state.ordersheet.paymentInfo
      state.couponAmt = paymentInfo.cartCouponAmt + paymentInfo.deliveryCouponAmt + paymentInfo.productCouponAmt

      const appliedCoupons = state.ordersheet.appliedCoupons
      if (appliedCoupons) {
        state.couponRequest.cartCouponIssueNo = appliedCoupons.cartCouponIssueNo
        state.couponRequest.deliveryCouponIssueNo = appliedCoupons.deliveryCouponIssueNo
        if (appliedCoupons.productCoupons && appliedCoupons.productCoupons.length > 0) {
          appliedCoupons.productCoupons.forEach((pdCoupon) => {
            commit('SET_COUPONREQUEST_COUPONISS', { productNo: pdCoupon.productNo, couponIssueNo: pdCoupon.couponIssueNo, isCopy: false })
            commit('SET_COUPONREQUEST_PLUSCOUPONISS', { productNo: pdCoupon.productNo, plusCouponIssueNo: pdCoupon.plusCouponIssueNo, isCopy: false })
          })
        }
        state.orderCoupons.cartCouponDiscountAmt = paymentInfo.cartCouponAmt
        state.orderCoupons.deliveryCouponDiscountAmt = paymentInfo.deliveryCouponAmt
        state.orderCoupons.productCouponDiscountAmt = paymentInfo.productCouponAmt

        commit('CART_COUPON_USE')
      }
    },
    CART_COUPON_USE (state) {
      if (state.orderCoupons) {
        const otherCouponUsable = state.orderCoupons.cartCoupons ? state.orderCoupons.cartCoupons.some(item => item.couponIssueNo === state.couponRequest.cartCouponIssueNo && !item.otherCouponUsable) : false
        if (otherCouponUsable) {
          state.otherCouponUsable = !otherCouponUsable
          state.couponRequest.productCoupons.forEach(item => {
            item.couponIssueNo = 0
            item.plusCouponIssueNo = 0
            item.couponDisable.forEach(si => {
              si.usable = false
              si.disable = false
            })
            item.couponPlusDisable.forEach(si => {
              si.usable = false
              si.disable = false
            })
          })
        }
      }
    },
    SET_COUPON_SELECTED (state, { couponRequest }) {
      if (state.orderCoupons) {
        let otherUsedable = true
        const cartCoupon = state.orderCoupons.cartCoupons ? state.orderCoupons.cartCoupons.filter(item => item.selected) : []
        if (cartCoupon.length > 0) {
          couponRequest.cartCouponIssueNo = cartCoupon[0].couponIssueNo
          otherUsedable = cartCoupon[0].otherCouponUsable
        }
        const deliveryCoupon = state.orderCoupons.deliveryCoupons ? state.orderCoupons.deliveryCoupons.filter(item => item.selected) : []
        if (deliveryCoupon.length > 0) {
          couponRequest.deliveryCouponIssueNo = deliveryCoupon[0].couponIssueNo
        }
        if (otherUsedable) {
          state.orderCoupons.products.forEach(pdCoupon => {
            couponRequest.productCoupons.forEach(pdcItem => {
              if (pdcItem.productNo === pdCoupon.productNo) {
                const coupon = pdCoupon.productCoupons.filter(pdc => pdc.selected)
                if (coupon.length > 0) {
                  pdcItem.couponIssueNo = coupon[0].couponIssueNo
                }

                const ngCoupon = pdCoupon.productCoupons.filter(pdc => pdc.selected === false && pdc.used === true)
                if (ngCoupon.length > 0) {
                  ngCoupon.forEach(ngc => {
                    const disableCoupn = pdcItem.couponDisable.filter(disCoupon => disCoupon.couponIssueNo === ngc.couponIssueNo)
                    if (disableCoupn.length > 0) {
                      disableCoupn[0].disable = true
                    }
                  })
                }

                const couponPlus = pdCoupon.productPlusCoupons.filter(pdc => pdc.selected)
                if (couponPlus.length > 0) {
                  pdcItem.plusCouponIssueNo = couponPlus[0].couponIssueNo
                }

                const ngCouponPlus = pdCoupon.productPlusCoupons.filter(pdc => pdc.selected === false && pdc.used === true)
                if (ngCouponPlus.length > 0) {
                  ngCouponPlus.forEach(ngcp => {
                    const disableCoupn = pdcItem.couponPlusDisable.filter(disCoupon => disCoupon.couponIssueNo === ngcp.couponIssueNo)
                    if (disableCoupn.length > 0) {
                      disableCoupn[0].disable = true
                    }
                  })
                }
              }
            })
          })
        } else {
          state.otherCouponUsable = false
          couponRequest.productCoupons.forEach(coupon => {
            coupon.couponIssueNo = 0
            coupon.plusCouponIssueNo = 0
            coupon.couponDisable.forEach(dis => {
              dis.usable = false
              dis.disable = false
            })
            coupon.couponPlusDisable.forEach(dis => {
              dis.usable = false
              dis.disable = false
            })
          })
        }
      }
    },
    CHANGE_CURRRECENT (state, recent) {
      state.currRecent = recent
    },
    CHANGE_COUPONAMT (state, amt) {
      state.couponAmt = amt
    },
    CHANGE_NEWADDRESS (state, newAddress) {
      state.newAddress = newAddress
    },
    CHANGE_DEVLI_MEMO (state, memo) {
      state.deliveryMemo = memo
    },
    CHANGE_COUPONREQUEST (state) {
      state.couponRequest = state.couponRequestCopy
    },
    SET_COUPONREQUEST_COUPONISS (state, { productNo, couponIssueNo, isCopy }) {
      let couponRequest = []
      if (!isCopy) {
        couponRequest = state.couponRequest
      } else {
        couponRequest = state.couponRequestCopy
      }
      const productCoupon = couponRequest.productCoupons.filter(item => item.productNo === productNo)
      if (productCoupon.length > 0) {
        productCoupon[0].couponIssueNo = couponIssueNo
        /** 정률일 경우 10원 이하 절상으로 표시 */
        const otherProduct = couponRequest.productCoupons.filter(item => item.productNo !== productNo)
        if (otherProduct.length > 0) {
          otherProduct.forEach((elem) => {
            // elem.couponIssueNo = 0
            elem.couponDisable.forEach((elem) => {
              if (couponIssueNo === 0) {
                elem.disable = false
              }
              if (elem.couponIssueNo === couponIssueNo) {
                elem.disable = true
              } else {
                elem.disable = false
              }
            })
          })
        }
      }
    },
    SET_COUPONREQUEST_PLUSCOUPONISS (state, { productNo, plusCouponIssueNo, isCopy }) {
      let couponRequest = []
      if (!isCopy) {
        couponRequest = state.couponRequest
      } else {
        couponRequest = state.couponRequestCopy
      }
      const productCoupon = couponRequest.productCoupons.filter(item => item.productNo === productNo)
      if (productCoupon.length > 0) {
        productCoupon[0].plusCouponIssueNo = plusCouponIssueNo
        /** 정률일 경우 10원 이하 절상으로 표시 */
        const otherProduct = couponRequest.productCoupons.filter(item => item.productNo !== productNo)
        if (otherProduct.length > 0) {
          otherProduct.forEach((elem) => {
            elem.couponPlusDisable.forEach((elem) => {
              if (plusCouponIssueNo === 0) {
                elem.disable = false
              }
              if (elem.couponIssueNo === plusCouponIssueNo) {
                elem.disable = true
              } else {
                elem.disable = false
              }
            })
          })
        }
      }
    },
    COPY_COUPONREQUEST (state) {
      state.couponRequestCopy = JSON.parse(JSON.stringify(state.couponRequest))
    },
    SET_USE_PAYCOCOUPON (state) {
      state.usePaycoCoupon = false
      if (state.orderCoupons.cartCoupons) {
        state.orderCoupons.cartCoupons.forEach((item) => {
          if (item.selected === true) {
            if (item.limitPayType === 'PAYCO') {
              state.usePaycoCoupon = true
            }
          }
        })
      }
      if (state.orderCoupons.deliveryCoupons) {
        state.orderCoupons.deliveryCoupons.forEach((item) => {
          if (item.selected === true) {
            if (item.limitPayType === 'PAYCO') {
              state.usePaycoCoupon = true
            }
          }
        })
      }
      if (state.usePaycoCoupon === false) {
        if (state.orderCoupons.products) {
          state.orderCoupons.products.forEach((product) => {
            if (product.productCoupons) {
              product.productCoupons.forEach((item) => {
                if (item.selected === true) {
                  if (item.limitPayType === 'PAYCO') {
                    state.usePaycoCoupon = true
                  }
                }
              })
            }
            if (product.productPlusCoupons) {
              product.productPlusCoupons.forEach((item) => {
                if (item.selected === true) {
                  if (item.limitPayType === 'PAYCO') {
                    state.usePaycoCoupon = true
                  }
                }
              })
            }
          })
        }
      }
    },
    SET_COUPONREQUEST_COPY (state, req) {
      state.couponRequestCopy = req
    },
    INIT_COUPONREQUEST (state, couponRequest) {
      if (!couponRequest) {
        couponRequest = state.couponRequest
      }
      state.otherCouponUsable = true
      couponRequest.cartCouponIssueNo = 0
      couponRequest.deliveryCouponIssueNo = 0
      couponRequest.productCoupons = state.orderCoupons.products.map(item => {
        const productCoupons = item.productCoupons
        const productPlusCoupons = item.productPlusCoupons
        const couponDisable = productCoupons.map((elem) => {
          return { couponIssueNo: elem.couponIssueNo, disable: false, usable: true }
        })

        const couponPlusDisable = productPlusCoupons.map((elem) => {
          return { couponIssueNo: elem.couponIssueNo, disable: false, usable: true }
        })

        return {
          couponIssueNo: 0,
          plusCouponIssueNo: 0,
          plusPromotionCode: '',
          productNo: item.productNo,
          promotionCode: '',
          couponDisable: couponDisable,
          couponPlusDisable: couponPlusDisable
        }
      })
    },
    UPDATE_ORDERSHEET_PAYMENTS (state) {
      if (state.ordersheet && state.orderCaResult) {
        state.ordersheet.paymentInfo = state.orderCaResult.paymentInfo
      }
    },
    UPDATE_ORDERSHEET_PAYMENTS_COUPON (state) {
      if (state.ordersheet && state.orderCouponsApplyResult) {
        state.ordersheet.paymentInfo = state.orderCouponsApplyResult.paymentInfo
      }
    },
    CLEAR_REPEAT_COUPON (state) {
      const sortFn = (item1, item2) => {
        const amt1 = item1.couponDiscountAmt
        const maxAmt1 = item1.maxDiscountAmt ? item1.maxDiscountAmt : 0
        const amtA = (amt1 <= maxAmt1 || maxAmt1 === 0) ? amt1 : maxAmt1

        const amt2 = item2.couponDiscountAmt
        const maxAmt2 = item2.maxDiscountAmt ? item2.maxDiscountAmt : 0
        const amtB = (amt2 <= maxAmt2 || maxAmt2 === 0) ? amt2 : maxAmt2
        const timeA = item1.useEndYmdt ? new Date(item1.useEndYmdt.replace(/-/g, '/')) : 0
        const timeB = item2.useEndYmdt ? new Date(item2.useEndYmdt.replace(/-/g, '/')) : 0

        if (amtA > amtB) {
          return -1
        } else if (amtA < amtB) {
          return 1
        } else {
          if (timeA === 0 && timeB === 0) {
            return 0
          } else if (timeA === 0 && timeB !== 0) {
            return 1
          } else if (timeA !== 0 && timeB === 0) {
            return -1
          } else if (timeA > timeB) {
            return 1
          } else {
            return -1
          }
        }
      }
      /** clear and sort */
      if (state.orderCoupons.cartCoupons && state.orderCoupons.cartCoupons.length > 0) {
        state.orderCoupons.cartCoupons = (state.orderCoupons.cartCoupons).sort(sortFn)
      }
      if (state.orderCoupons.deliveryCoupons && state.orderCoupons.deliveryCoupons.length > 0) {
        state.orderCoupons.deliveryCoupons = (state.orderCoupons.deliveryCoupons).sort(sortFn)
      }
      if (state.orderCoupons.products && state.orderCoupons.products.length > 0) {
        state.orderCoupons.products.forEach((item) => {
          if (item.productCoupons && item.productCoupons.length > 0) {
            item.productCoupons = (item.productCoupons).sort(sortFn)
          }
          if (item.productPlusCoupons && item.productPlusCoupons.length > 0) {
            item.productPlusCoupons = (item.productPlusCoupons).sort(sortFn)
          }
        })
      }
      if (!state.orderCoupons.cartCouponDiscountAmt) {
        state.orderCoupons.cartCouponDiscountAmt = 0
      }
    },
    CHANGE_OTHER_COUPON_USABLE (state, otherCouponUsable) {
      state.otherCouponUsable = otherCouponUsable
    }
  },
  getters: {
    resetBtnFlg (state) {
      let showFlg = true
      if (state.maxCoupons && state.orderCoupons) {
        // cartCoupons
        if (state.maxCoupons.cartCoupons) {
          state.maxCoupons.cartCoupons.forEach(maxItem => {
            // return forEach
            if (showFlg) {
              state.orderCoupons.cartCoupons.forEach(showItem => {
                // return forEach
                if (showFlg) {
                  if (maxItem.couponIssueNo === showItem.couponIssueNo) {
                    if (maxItem.selected !== showItem.selected) {
                      showFlg = false
                    }
                  }
                }
              })
            }
          })
        }

        // deliveryCoupons
        if (showFlg && state.maxCoupons.deliveryCoupons) {
          state.maxCoupons.deliveryCoupons.forEach(maxItem => {
            // return forEach
            if (showFlg) {
              state.orderCoupons.deliveryCoupons.forEach(showItem => {
                // return forEach
                if (showFlg) {
                  if (maxItem.couponIssueNo === showItem.couponIssueNo) {
                    if (maxItem.selected !== showItem.selected) {
                      showFlg = false
                    }
                  }
                }
              })
            }
          })
        }

        // products
        if (showFlg) {
          state.maxCoupons.products.forEach(maxProduct => {
            // return forEach
            if (showFlg) {
              state.orderCoupons.products.forEach(showProduct => {
                // return forEach
                if (showFlg) {
                  if (maxProduct.productNo === showProduct.productNo) {
                    maxProduct.productCoupons.forEach(maxItem => {
                      // return forEach
                      if (showFlg) {
                        showProduct.productCoupons.forEach(showItem => {
                          // return forEach
                          if (showFlg) {
                            if (maxItem.couponIssueNo === showItem.couponIssueNo) {
                              if (maxItem.selected !== showItem.selected) {
                                showFlg = false
                              }
                            }
                          }
                        })
                      }
                    })

                    if (showFlg) {
                      maxProduct.productPlusCoupons.forEach(maxItem => {
                        // return forEach
                        if (showFlg) {
                          showProduct.productPlusCoupons.forEach(showItem => {
                            // return forEach
                            if (showFlg) {
                              if (maxItem.couponIssueNo === showItem.couponIssueNo) {
                                if (maxItem.selected !== showItem.selected) {
                                  showFlg = false
                                }
                              }
                            }
                          })
                        }
                      })
                    }
                  }
                }
              })
            }
          })
        }
      }
      return showFlg
    },
    orderProductOptions (state) {
      if (state.ordersheet) {
        const ordersheet = state.ordersheet.deliveryGroups
        const orderProductOptions = []
        ordersheet.forEach((deliveryGroup, groupIdx) => {
          deliveryGroup.orderProducts.forEach((orderProduct, productIdx) => {
            orderProduct.orderProductOptions.forEach((orderProductOption, optionIdx) => {
              makeOrderProductOptionInfo(orderProduct, orderProductOption, productIdx, optionIdx, deliveryGroup)
              orderProductOptions.push(orderProductOption)
            })
          })
        })
        return orderProductOptions
      }
    },
    orderCouponsOptionCnt: (state) => {
      // 재계산 필요.
      if (state.orderCoupons) {
        let productCnt = 0
        state.orderCoupons.products.forEach((item) => {
          productCnt += item.optionCnt
        })
        return productCnt
      }
    },
    orderCouponCnt: (state) => {
      if (state.orderCoupons) {
        let count = 0
        if (state.orderCoupons.products) {
          state.orderCoupons.products.forEach(product => {
            count += product.productCoupons.length
            count += product.productPlusCoupons.length
          })
        }
        if (state.orderCoupons.cartCoupons) {
          count += state.orderCoupons.cartCoupons.length
        }
        if (state.orderCoupons.deliveryCoupons) {
          count += state.orderCoupons.deliveryCoupons.length
        }
        return count
      }
    },
    orderCouponDisplayModel: (state) => {
      if (state.orderCoupons) {
        const ret = {
          showPaycoArea: 0,
          showCartAtPayco: 0,
          showDeliveryAtPayco: 0,
          showPaycoCartAndDelivery: 0,
          showProducts: 0,
          showPaycoProducts: 0,
          // -1 not show; 0 showAtNormal; > 0 showAtPayco
          showProduct: [],
          hasCommonCartCoupon: false,
          hasCommonDeliveryCoupon: false
        }
        if (state.orderCoupons.cartCoupons) {
          state.orderCoupons.cartCoupons.forEach((item) => {
            ret.hasCommonCartCoupon = true
          })
        }
        if (state.orderCoupons.deliveryCoupons) {
          state.orderCoupons.deliveryCoupons.forEach((item) => {
            ret.hasCommonDeliveryCoupon = true
          })
        }
        let flg = ret.showCartAtPayco + ret.showDeliveryAtPayco
        if (flg > 0) {
          ret.showPaycoCartAndDelivery = 1
        } else {
          ret.showPaycoCartAndDelivery = 0
        }
        let count = 0
        if (state.orderCoupons.products) {
          for (let i = 0; i < state.orderCoupons.products.length; i++) {
            const item = state.orderCoupons.products[i]
            let couponCnt = item.productCoupons.length
            let plusCouponCnt = item.productPlusCoupons.length
            if ((couponCnt + plusCouponCnt) > 0) {
              ret.showProduct[i] = 0
            } else {
              // do not have coupon, product not display
              ret.showProduct[i] = -1
            }
            if (item.productCoupons) {
              for (let j = 0; j < item.productCoupons.length; j++) {
                const sub = item.productCoupons[j]
                if (sub.limitPayType === 'PAYCO') {
                  ret.showProduct[i] = 1
                  count = count + 1
                  break
                }
              }
            }
            if (item.productPlusCoupons) {
              for (let j = 0; j < item.productPlusCoupons.length; j++) {
                const sub = item.productPlusCoupons[j]
                if (sub.limitPayType === 'PAYCO') {
                  ret.showProduct[i] = 1
                  count = count + 1
                  break
                }
              }
            }
          }
        }

        if (count === 0) {
          ret.showProducts = 1
          ret.showPaycoProducts = 0
        } else if (count === state.orderCoupons.products.length) {
          ret.showProducts = 0
          ret.showPaycoProducts = 1
        } else {
          ret.showProducts = 1
          ret.showPaycoProducts = 1
        }

        ret.showPaycoArea = ret.showPaycoCartAndDelivery + ret.showPaycoProducts
        return ret
      }
    }
  }
}
