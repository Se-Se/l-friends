import { createNcpApiStore } from '@/api'
import qs from 'qs'
import Vue from 'vue'
import router from '@/router'
import { makeOrderProductOptionInfo } from '@/utils/orderUtils'
import { delCurrency } from '@/utils/StringUtils'

const apiStore = createNcpApiStore([
  {
    action: 'getCart',
    property: 'cart',
    path: 'cart',
    onSuccess (state, payload) {
      if (state.cart && typeof state.cart === 'object') {
        /* 새로운 테이타 및 oldCart 테이타 비교해 보고 상품 수량이 일치할때만 새로운 테이타 사용 */
        let newCart = payload.data
        let oldCart = state.cart
        /* 임시 변수 */
        let tempArr = []
        let cnt = 0

        if (oldCart && oldCart.deliveryGroups.length > 0) {
          // deliveryGroups
          oldCart.deliveryGroups.forEach((deliveryGroup) => {
            // orderProducts
            deliveryGroup.orderProducts.forEach((orderProduct) => {
              // orderProductOptions
              tempArr.push(...orderProduct.orderProductOptions)
            })
          })
        }

        if (newCart && newCart.deliveryGroups.length > 0) {
          // deliveryGroups
          newCart.deliveryGroups.forEach((deliveryGroup) => {
            // orderProducts
            deliveryGroup.orderProducts.forEach((orderProduct) => {
              // orderProductOptions
              orderProduct.orderProductOptions.forEach((orderProductOption) => {
                let temp = tempArr.find((temp) => temp.cartNo === orderProductOption.cartNo)
                if (temp && orderProductOption && orderProductOption.orderCnt !== temp.orderCnt) {
                  cnt++
                }
              })
            })
          })
        }

        if (cnt === 0) {
          state.cart = newCart
        }
      } else {
        state.cart = payload.data
      }
    }
  },
  {
    action: 'getGuestCart',
    property: 'cart',
    path: 'guest/cart',
    method: 'post',
    onSuccess (state, payload) {
      if (state.cart && typeof state.cart === 'object') {
        /* 새로운 테이타 및 oldCart 테이타 비교해 보고 상품 수량이 일치할때만 새로운 테이타 사용 */
        let newCart = payload.data
        let oldCart = state.cart
        /* 임시 변수 */
        let tempArr = []
        let cnt = 0

        if (oldCart && oldCart.deliveryGroups.length > 0) {
          // deliveryGroups
          oldCart.deliveryGroups.forEach((deliveryGroup) => {
            // orderProducts
            deliveryGroup.orderProducts.forEach((orderProduct) => {
              // orderProductOptions
              tempArr.push(...orderProduct.orderProductOptions)
            })
          })
        }

        if (newCart && newCart.deliveryGroups.length > 0) {
          // deliveryGroups
          newCart.deliveryGroups.forEach((deliveryGroup) => {
            // orderProducts
            deliveryGroup.orderProducts.forEach((orderProduct) => {
              // orderProductOptions
              orderProduct.orderProductOptions.forEach((orderProductOption) => {
                let temp = tempArr.find((temp) => temp.cartNo === orderProductOption.cartNo)
                if (temp && orderProductOption && orderProductOption.orderCnt !== temp.orderCnt) {
                  temp.orderCnt = orderProductOption.orderCnt
                  cnt++
                }
              })
            })
          })
        }

        if (cnt === 0) {
          state.cart = newCart
        }
      } else {
        state.cart = payload.data
      }
    }
  },
  {
    action: 'updateCart',
    property: 'result',
    path: 'cart',
    method: 'put'
  },
  {
    action: 'addCart',
    property: 'addcount',
    path: 'cart',
    method: 'post'
  },
  {
    action: 'countCart',
    property: 'count',
    path: 'cart/count'
  },
  {
    action: 'deleteCart',
    property: 'delcount',
    path: 'cart',
    method: 'delete',
    requestConfig: {
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
    }
  },
  {
    action: '_calculate',
    property: 'calculate',
    path: 'cart/calculate',
    method: 'get',
    requestConfig: {
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
    }
  },
  {
    action: '_calcGuestCart',
    property: 'calculate',
    path: 'guest/cart',
    method: 'post'
  }
])

export default {
  namespaced: true,
  state: {
    totalItemPrice: 0,
    totalDiscountAmount: 0,
    totalShippingCost: 0,
    paymentAmount: 0,
    checkOptions: [],
    invalidOptions: [],
    initFlg: true
  },
  mixins: [apiStore],
  actions: {
    async mergeCart ({ state, dispatch, commit }) {
      if (!state.cart) {
        return false
      }

      let carts = []

      for (const group of state.cart.deliveryGroups) {
        for (const product of group.orderProducts) {
          for (const option of product.orderProductOptions) {
            carts.push({
              productNo: product.productNo,
              optionNo: option.optionNo,
              additionalProductNo: 0,
              orderCnt: option.orderCnt
            })
          }
        }
      }

      try {
        await dispatch('addCart', {
          data: carts,
          params: { integrated: true }
        })
      } catch (e) {}

      window.localStorage.cartInfo = []
    },
    async addToCart ({ state, dispatch, commit, rootState, rootGetters }, { carts, integrated }) {
      let ret = true
      if (rootGetters.isLogined && rootGetters.ncpMemberAgree && rootGetters.memberStatus !== 'WAITING') {
        try {
          await dispatch('addCart', { data: carts, params: { integrated } })
        } catch (e) {
          if (e.data.code === 'PPE0001') {
            ret = false
            router.go(0)
          } else {
            throw e
          }
        }
      } else {
        // cartConfig
        let cartConfig = rootState.common.malls.cartConfig
        const preItems = JSON.parse(window.localStorage.cartInfo || '[]')

        let maxCartNo = 0
        if (preItems.length > 0) {
          preItems.forEach(cartItem => {
            if (cartItem.cartNo > maxCartNo) {
              maxCartNo = cartItem.cartNo
            }
          })
        }

        if (cartConfig && cartConfig.cartEquivalentOptionUnitType === 'QUANTITY') {
          let delNos = []
          preItems.forEach(item => {
            carts.forEach(addCart => {
              if (Number(item.productNo) === Number(addCart.productNo) && Number(item.optionNo) === Number(addCart.optionNo)) {
                item.orderCnt = Number(item.orderCnt) + Number(addCart.orderCnt)
                delNos.push(addCart.productNo + '-' + addCart.optionNo)
              }
            })
          })
          carts = carts.filter(item => !delNos.some(tempNo => tempNo === item.productNo + '-' + item.optionNo))
        }
        preItems.push(...carts.map((item, index) => {
          return {
            ...item,
            cartNo: maxCartNo + index + 1
          }
        }))

        window.localStorage.cartInfo = JSON.stringify(preItems)
      }
      await dispatch('fetchCartCount')
      return ret
    },
    async fetchCart ({ state, commit, dispatch, rootState, rootGetters }) {
      if (rootGetters.isLogined && rootGetters.ncpMemberAgree && rootGetters.memberStatus !== 'WAITING') {
        await dispatch('getCart')
      } else {
        const items = JSON.parse(window.localStorage.cartInfo || '[]')
        if (items.length > 0) {
          await dispatch('getGuestCart', { data: items })
        } else {
          state.cart = null
        }
      }
      await commit('FORMAT_DATAS', { isLogined: (rootGetters.isLogined && rootGetters.ncpMemberAgree && rootGetters.memberStatus !== 'WAITING') })
      if (state.initFlg) {
        state.initFlg = false
        await commit('CHECK_ALL', true)
      }
      await dispatch('calculate')
    },
    fetchCartCount ({ state, commit, dispatch, rootGetters, rootState }) {
      if (rootGetters.isLogined && rootGetters.ncpMemberAgree && rootGetters.memberStatus !== 'WAITING') {
        dispatch('countCart')
      } else {
        const items = JSON.parse(window.localStorage.cartInfo || '[]')
        if (items.length > 0) {
          state.count = { count: items.length }
        } else {
          state.count = 0
        }
      }
    },
    async deleteCartByOptions ({ state, dispatch, commit, rootState, rootGetters }, options) {
      if (rootGetters.isLogined && rootGetters.ncpMemberAgree && rootGetters.memberStatus !== 'WAITING') {
        const cartNo = options.map(option => option.cartNo)
        await dispatch('deleteCart', { params: { cartNo } })
      } else {
        const items = JSON.parse(window.localStorage.cartInfo || '[]')
        window.localStorage.cartInfo = JSON.stringify(
          items.filter(item => {
            return !options.some(option => option.cartNo === item.cartNo)
          })
        )
      }
      options.forEach(option => {
        option.checked = false
        commit('CHECK_OPTION', option)
      })

      await dispatch('fetchCart')
      await dispatch('fetchCartCount')
    },
    async deleteCartByCartNos ({ state, dispatch, commit, rootState, rootGetters }, cartNos) {
      if (rootGetters.isLogined && rootGetters.ncpMemberAgree && rootGetters.memberStatus !== 'WAITING') {
        await dispatch('deleteCart', { params: { cartNo: cartNos } })
      } else {
        const items = JSON.parse(window.localStorage.cartInfo || '[]')
        window.localStorage.cartInfo = JSON.stringify(
          items.filter(item => {
            return !cartNos.some(cartNo => cartNo === item.cartNo)
          })
        )
      }
      dispatch('fetchCart')
      dispatch('fetchCartCount')
    },
    async putCarts ({ state, dispatch, commit, rootState, rootGetters }, carts) {
      if (rootGetters.isLogined && rootGetters.ncpMemberAgree && rootGetters.memberStatus !== 'WAITING') {
        await dispatch('updateCart', { data: carts })
      } else {
        const items = JSON.parse(window.localStorage.cartInfo || '[]')
        items.forEach(item => {
          carts.forEach(option => {
            if (item.cartNo === option.cartNo) {
              item.orderCnt = option.orderCnt
            }
          })
        })

        window.localStorage.cartInfo = JSON.stringify(items)
      }
      await dispatch('fetchCart')
    },
    async calculate ({ state, commit, dispatch, rootState, rootGetters }) {
      if (state.checkOptions.length > 0) {
        if (rootGetters.isLogined && rootGetters.ncpMemberAgree && rootGetters.memberStatus !== 'WAITING') {
          const cartNo = state.checkOptions.map(option => option.cartNo)
          await dispatch('_calculate', { params: { cartNo } })
          if (state.calculate) {
            state.totalItemPrice = state.calculate.standardAmt
            state.totalDiscountAmount = state.calculate.discountAmt
            state.totalShippingCost = state.calculate.totalPrePaidDeliveryAmt
            state.paymentAmount = state.calculate.totalAmt
          }
        } else {
          await dispatch('_calcGuestCart', { data: state.checkOptions })
          if (state.calculate) {
            state.totalItemPrice = state.calculate.price.standardAmt
            state.totalDiscountAmount = state.calculate.price.discountAmt
            state.totalShippingCost = state.calculate.price.totalPrePaidDeliveryAmt
            state.paymentAmount = state.calculate.price.totalAmt
          }
        }
      } else {
        state.totalItemPrice = 0
        state.totalDiscountAmount = 0
        state.totalShippingCost = 0
        state.paymentAmount = 0
      }
    }
  },
  getters: {
    allChecked (state) {
      // 구입 불가상품에 대한 예외상황이 필요한다
      let allChecked = false
      if (state.count) {
        if ((state.count.count - state.invalidOptions.length) === state.checkOptions.length) {
          allChecked = true
        }
      }
      return allChecked
    },
    isDeliveryGroups (state) {
      return state.cart && state.cart.deliveryGroups && state.cart.deliveryGroups.length > 0
    },
    isInvalidProducts (state) {
      return state.cart && state.cart.invalidProducts && state.cart.invalidProducts.length > 0
    },
    havePayOnDelivery (state) {
      let have = false
      if (state.checkOptions) {
        have = state.checkOptions.some(item => item.payOnDelivery)
      }
      return have
    }
  },
  mutations: {
    CHECK_OPTION (state, option) {
      if (option.checked) {
        state.checkOptions.push(option)
      } else {
        state.checkOptions = state.checkOptions.filter(item => {
          let filterFlg = true
          if (item.cartNo === 0) {
            if (item.optionNo === option.optionNo) {
              filterFlg = false
              if (option.optionInputs && option.optionInputs.length > 0) {
                option.optionInputs.forEach((optionInput, inputIndex) => {
                  if (!(optionInput.inputLabel === item.optionInputs[inputIndex].inputLabel && optionInput.inputValue === item.optionInputs[inputIndex].inputValue)) {
                    filterFlg = true
                  }
                })
              }
            }
          } else {
            if (item.cartNo === option.cartNo) {
              filterFlg = false
            }
          }

          return filterFlg
        })
      }
    },
    CHECK_ALL (state, flg) {
      state.checkOptions = []
      if (flg && state.cart && state.cart.deliveryGroups) {
        // deliveryGroups
        state.cart.deliveryGroups.forEach(deliveryGroup => {
          // orderProducts
          deliveryGroup.orderProducts.forEach(orderProduct => {
            // orderProductOptions
            orderProduct.orderProductOptions.forEach(option => {
              if (!option.isInValid) {
                const checkOption = {
                  checked: flg,
                  cartNo: option.cartNo,
                  productNo: option.productNo,
                  optionNo: option.optionNo,
                  orderCnt: option.orderCnt,
                  optionInputs: option.optionInputs,
                  payOnDelivery: option.deliveryPayType === 'PAY_ON_DELIVERY'
                }
                state.checkOptions.push(checkOption)
              }
            })
          })
        })
      }
    },
    FORMAT_DATAS (state, { isLogined }) {
      state.invalidOptions = []
      if (state.cart && state.cart.deliveryGroups.length > 0) {
        // deliveryGroups
        state.cart.deliveryGroups.forEach((deliveryGroup, groupIdx) => {
          // orderProducts
          deliveryGroup.orderProducts.forEach((orderProduct, productIdx) => {
            // orderProductOptions
            orderProduct.orderProductOptions.forEach((orderProductOption, optionIdx) => {
              Vue.set(orderProductOption, 'idx', 'check_' + groupIdx + '_' + productIdx + '_' + optionIdx)
              makeOrderProductOptionInfo(orderProduct, orderProductOption, productIdx, optionIdx, deliveryGroup)
              orderProductOption.isInValid = false
            })
          })
        })
      }

      if (state.cart && state.cart.invalidProducts && state.cart.invalidProducts.length > 0) {
        state.cart.invalidProducts.forEach((orderProduct, productIdx) => {
          orderProduct.orderProductOptions.forEach((orderProductOption, optionIdx) => {
            Vue.set(orderProductOption, 'idx', 'check_' + productIdx + '_' + optionIdx)
            makeOrderProductOptionInfo(orderProduct, orderProductOption, productIdx, optionIdx)
            orderProductOption.isInValid = true
            state.invalidOptions.push({
              cartNo: orderProductOption.cartNo,
              productNo: orderProductOption.productNo,
              optionNo: orderProductOption.optionNo,
              orderCnt: orderProductOption.orderCnt,
              optionInputs: orderProductOption.optionInputs
            })
          })
        })
      }
    },
    SET_INIT (state) {
      state.initFlg = true
    },
    REFRESH_SHOW_AMT (state) {
      let totalShowStandardAmt = 0
      let totalShowDiscountAmt = 0
      if (state.cart && state.cart.deliveryGroups.length > 0) {
        // deliveryGroups
        state.cart.deliveryGroups.forEach((deliveryGroup, groupIdx) => {
          // orderProducts
          deliveryGroup.orderProducts.forEach((orderProduct, productIdx) => {
            // orderProductOptions
            orderProduct.orderProductOptions.forEach((orderProductOption, optionIdx) => {
              if (state.checkOptions.some((opt) => opt.cartNo === orderProductOption.cartNo)) {
                totalShowStandardAmt += Number(delCurrency(orderProductOption.showStandardAmt))
                totalShowDiscountAmt += Number(delCurrency(orderProductOption.showDiscountAmt))
              }
            })
          })
        })
      }
      state.totalItemPrice = totalShowStandardAmt
      state.totalDiscountAmount = totalShowDiscountAmt
      state.paymentAmount = state.totalItemPrice - state.totalDiscountAmount + Number(delCurrency(state.totalShippingCost))
    }
  }
}
