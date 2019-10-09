import { createNcpApiStore } from '@/api'
import { clearRepeatNum } from '@/utils/StringUtils'
import Vue from 'vue'
const apiStore = createNcpApiStore([
  {
    action: '_fetchProductCoupons',
    property: 'coupons',
    path: 'coupons/products/{productNo}/issuable/coupons',
    pathParams: ['productNo']
  },
  {
    action: '_downLoadAllCoupons',
    property: 'couponsDown',
    path: 'coupons/products/{productNo}/download',
    pathParams: ['productNo'],
    method: 'post'
  },
  {
    action: '_downLoadCoupons',
    property: 'couponsDown',
    path: 'coupons/{couponNo}/download',
    pathParams: ['couponNo'],
    method: 'post'
  },
  {
    action: '_myCoupons',
    property: 'myCoupons',
    path: 'coupons',
    method: 'get'
  }
])
export default {
  namespaced: true,
  mixins: [apiStore],
  actions: {
    fetchProductCoupons ({ state, commit, dispatch }, productNo) {
      return dispatch('_fetchProductCoupons', { params: { productNo } })
    },
    downLoadAllCoupons ({ state, commit, dispatch }, productNo) {
      return dispatch('_downLoadAllCoupons', { params: { productNo } })
    },
    downLoadCoupons ({ state, commit, dispatch }, couponNo) {
      return dispatch('_downLoadCoupons', { params: { couponNo } })
    },
    myCoupons ({ state, commit, dispatch, rootGetters }) {
      if (!rootGetters.isLogined) {
        return
      }
      return dispatch('_myCoupons', { params: { usable: true, hasTotalCount: true, pageNumber: 1, pageSize: 300 } })
    }
  },
  getters: {
    getCoupons (state, getters, rootState, rootGetters) {
      // TODO COUPON ALL VIEW
      /*
      if (rootGetters.isLogined) {
        if (state.myCoupons && state.coupons) {
          const coupon = state.coupons
          const coup = clearRepeatNum(state.myCoupons.items.map(item => {
            return item.couponNo
          }))
          coupon.forEach(coupon => {
            Vue.set(coupon, 'dis', coup.some(coupNo => {
              return coupNo === coupon.couponNo
            }))
          })
          return coupon
        }
      } else {
      */
      return state.coupons
      // }
    },
    compare (state, getters, rootState, rootGetters) {
      if (rootState.product.product) {
        // rootGetters.isLogined
        if ((state.coupons) || (state.myCoupons && state.coupons)) {
          return state.coupons.sort((obj1, obj2) => {
            const salePrice = rootState.product.product.price.salePrice - rootState.product.product.price.immediateDiscountAmt - rootState.product.product.price.additionDiscountAmt
            const disAmt1 = obj1.discountInfo.discountAmt ? obj1.discountInfo.discountAmt : obj1.discountInfo.discountRate / 100 * salePrice
            const disAmt2 = obj2.discountInfo.discountAmt ? obj2.discountInfo.discountAmt : obj2.discountInfo.discountRate / 100 * salePrice
            if (disAmt1 < disAmt2) {
              return 1
            } else if (disAmt1 > disAmt2) {
              return -1
            } else {
              if (obj1.dateInfo.issueEndYmdt > obj2.dateInfo.issueEndYmdt) {
                return 1
              } else if (obj1.dateInfo.issueEndYmdt < obj2.dateInfo.issueEndYmdt) {
                return -1
              } else {
                if (obj1.couponName > obj2.couponName) {
                  return 1
                } else {
                  return -1
                }
              }
            }
          })
        }
      }
    }
  }
}
