import { createNcpApiStore } from '@/api'
import { isLogin, refreshCartStoragePeriod, formatOptionTitle, checkCartStoragePeriod, uniqueArr } from '@/utils/utils'
import router from '@/router'
import qs from 'qs'
import { Alert } from '@/components/common/modal'

const apiStore = createNcpApiStore([
  {
    action: '_fetchCount',
    property: 'count',
    path: 'cart/count',
    onSuccess (state, payload) {
      state.count = payload.data.count
    }
  },
  {
    action: '_getCart',
    property: 'cart',
    path: 'cart'
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
    action: '_calculateRvt',
    path: 'cart/calculate',
    method: 'get',
    requestConfig: {
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
    }
  },
  {
    action: '_addCart',
    path: 'cart',
    method: 'post'
  },
  {
    action: '_updateCart',
    property: 'result',
    path: 'cart',
    method: 'put'
  },
  {
    action: '_deleteCart',
    path: 'cart',
    method: 'delete',
    requestConfig: {
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
    }
  },
  {
    action: '_getGuestCart',
    property: 'cart',
    path: 'guest/cart',
    method: 'post'
  },
  {
    action: '_calcGuestCart',
    property: 'calculate',
    path: 'guest/cart',
    method: 'post',
    onSuccess (state, payload) {
      state.calculate = payload.data.price
    }
  },
  {
    action: '_calcGuestCartRvt',
    path: 'guest/cart',
    method: 'post'
  },
  {
    action: '_checkGuestCart',
    property: 'guestCartValidate',
    path: 'guest/cart',
    method: 'post'
  }
])

export default {
  namespaced: true,
  state: {
    showItems: [],
    showReservationItems: [],
    checkedItems: [],
    reservationCheckedItems: [],
    generalCart: [],
    reservationCart: [],
    calculate: {
      accumulationAmtWhenBuyConfirm: 0,
      buyAmt: 0,
      discountAmt: 0,
      paymentAmt: 0,
      salesTaxAmt: 0,
      standardAmt: 0,
      totalAmt: 0,
      totalDeliveryAmt: 0,
      totalPayOnDeliveryAmt: 0,
      totalPrePaidDeliveryAmt: 0
    }
  },
  mixins: [apiStore],
  actions: {
    async mergeCart ({ state, dispatch, commit }) {
      const items = JSON.parse(window.localStorage.cartInfo || '[]')
      if (!items.length) {
        return false
      }

      let carts = []
      for (const option of items) {
        carts.push({
          productNo: option.productNo,
          optionNo: option.optionNo,
          orderCnt: option.orderCnt
        })
      }

      try {
        await dispatch('_addCart', {
          data: carts,
          params: { integrated: true }
        })
      } catch (e) {
      }

      delete window.localStorage.cartInfo
      delete window.localStorage.lastUpdateCartDay
    },
    fetchCount ({ state, dispatch }) {
      if (isLogin()) {
        dispatch('_fetchCount')
      } else {
        checkCartStoragePeriod()
        const items = JSON.parse(window.localStorage.cartInfo || '[]')
        state.count = items.length
      }
    },
    async cartInit ({ state, dispatch, commit }) {
      await dispatch('fetchCart')
      dispatch('checkItem', { type: 'checkAll', checked: true })
      commit('CHECK_ALL_ALLRVT')
    },
    async fetchCart ({ state, dispatch, commit }) {
      if (isLogin()) {
        await dispatch('_getCart')
      } else {
        const items = JSON.parse(window.localStorage.cartInfo || '[]')
        if (items.length > 0) {
          await dispatch('_getGuestCart', { data: items })
        } else {
          state.cart = {}
        }
      }
      commit('FORMAT_CART')
      await dispatch('calculate')
    },
    async calculate ({ state, dispatch }) {
      let cartNos = []
      let guestItem = []
      state.checkedItems.forEach(item => {
        cartNos.push(item.cartNo)
        guestItem.push({
          cartNo: item.cartNo,
          orderCnt: item.orderCnt,
          productNo: item.productNo,
          optionNo: item.optionNo
        })
      })
      if (cartNos.length > 0) {
        if (isLogin()) {
          await dispatch('_calculate', { params: { cartNo: cartNos } })
        } else {
          await dispatch('_calcGuestCart', { data: guestItem })
        }
      } else {
        state.calculate = {
          accumulationAmtWhenBuyConfirm: 0,
          buyAmt: 0,
          discountAmt: 0,
          paymentAmt: 0,
          salesTaxAmt: 0,
          standardAmt: 0,
          totalAmt: 0,
          totalDeliveryAmt: 0,
          totalPayOnDeliveryAmt: 0,
          totalPrePaidDeliveryAmt: 0
        }
      }
    },
    async addToCart ({ dispatch }, { carts }) {
      let okFlg = true
      let msg = ''
      if (isLogin()) {
        await dispatch('_addCart', { data: carts }).catch(e => {
          if (router.app._route.name === 'ProductDetail') {
            if (e.data.code === 'PPE0001' || e.data.code === 'PPE0011' || e.data.code === 'PPE0013') {
              router.go(0)
            }
          }
          okFlg = false
        })
      } else {
        await dispatch('guestCartCheck', { guestCarts: carts }).then(res => {
          if (res) {
            // cartConfig
            let mallInfo = JSON.parse(window.localStorage.mallInfo || {})
            let cartConfig = mallInfo.cartConfig
            if (cartConfig) {
              // old carts
              const preItems = JSON.parse(window.localStorage.cartInfo || '[]')

              // add cartNo
              let maxCartNo = preItems.reduce((maxCartNo, cartInfo) => {
                return Math.max(maxCartNo, cartInfo.cartNo)
              }, 0)
              carts.forEach((cartInfo) => {
                cartInfo.cartNo = ++maxCartNo
              })

              // QUANTITY
              if (cartConfig.cartEquivalentOptionUnitType === 'QUANTITY') {
                let delNos = []
                preItems.forEach(item => {
                  carts.forEach(addCart => {
                    if (Number(item.productNo) === Number(addCart.productNo) && Number(item.optionNo) === Number(addCart.optionNo)) {
                      item.orderCnt = Number(item.orderCnt) + Number(addCart.orderCnt)
                      delNos.push(addCart.cartNo)
                    }
                  })
                })
                carts = carts.filter(item => !delNos.some(tempNo => tempNo === item.cartNo))
              }
              preItems.push(...carts)

              if (preItems.length > cartConfig.storageMaxQuantity) {
                msg = 'カート内に入れられる最大数を超えています。 カートに入れた商品を調整してください。'
                okFlg = false
              } else {
                window.localStorage.cartInfo = JSON.stringify(preItems)
                refreshCartStoragePeriod()
              }
            }
          } else {
            okFlg = false
          }
        })
      }
      if (msg) {
        return Alert(msg).then(() => {
          return okFlg
        })
      }
      if (okFlg) {
        dispatch('fetchCount')
      }
      return okFlg
    },
    async updateCnt ({ dispatch, commit }, { cartInfos }) {
      let okFlg = true
      let updateCart = cartInfos.map(cartInfo => {
        return {
          cartNo: cartInfo.cartNo,
          orderCnt: cartInfo.orderCnt
        }
      })

      if (updateCart) {
        if (isLogin()) {
          await dispatch('_updateCart', { data: updateCart }).catch(() => {
            okFlg = false
          })
        } else {
          await dispatch('guestCartCheck', { guestCarts: cartInfos }).then(res => {
            if (res) {
              const items = JSON.parse(window.localStorage.cartInfo || '[]')
              items.forEach(item => {
                cartInfos.forEach(cartInfo => {
                  if (item.cartNo === cartInfo.cartNo) {
                    item.orderCnt = cartInfo.orderCnt
                  }
                })
              })
              window.localStorage.cartInfo = JSON.stringify(items)
              refreshCartStoragePeriod()
            } else {
              okFlg = false
            }
          })
        }
      }
      if (okFlg && router.app._route.name === 'Cart') {
        commit('UPDATE_CHECKED', updateCart)
        await dispatch('fetchCart')
      }
      return okFlg
    },
    async deleteCartByCartNos ({ dispatch, commit }, { cartNos }) {
      if (isLogin()) {
        await dispatch('_deleteCart', { params: { cartNo: cartNos } })
      } else {
        const items = JSON.parse(window.localStorage.cartInfo || '[]')
        window.localStorage.cartInfo = JSON.stringify(
          items.filter(item => {
            return !cartNos.some(cartNo => cartNo === item.cartNo)
          })
        )
      }
      dispatch('fetchCount')
      if (router.app._route.name === 'Cart') {
        commit('DELETE_CHECKED', { cartNos })
        await dispatch('fetchCart')
      }
    },
    async guestCartCheck ({ state, dispatch }, { guestCarts }) {
      let okFlg = true
      let valid = null
      await dispatch('_checkGuestCart', { data: guestCarts })
      try {
        state.guestCartValidate.deliveryGroups.forEach(group => {
          group.orderProducts.forEach(product => {
            product.orderProductOptions.forEach(option => {
              if (!option.validInfo.valid) {
                throw option.validInfo
              }
            })
          })
        })
        state.guestCartValidate.invalidProducts.forEach(product => {
          product.orderProductOptions.forEach(option => {
            if (!option.validInfo.valid) {
              throw option.validInfo
            }
          })
        })
      } catch (validInfo) {
        okFlg = false
        valid = validInfo
      }
      if (valid) {
        return Alert(valid.message).then(() => {
          if (router.app._route.name === 'ProductDetail') {
            if (valid.errorCode === 'ERROR_NOT_ONSALE_STATUS' || valid.errorCode === 'ERROR_NOT_FRONT_DISPLAY_PRODUCT' || valid.errorCode === 'ERROR_EMPTY_STOCK') {
              router.go(0)
            }
          }
          return okFlg
        })
      }
      return okFlg
    },
    async checkItem ({ dispatch, commit }, { type, checked, cartNo }) {
      if (type === 'checkAll') {
        commit('CHECK_ALL', { checked })
      } else if (type === 'checkOption') {
        commit('CHECK_OPTION', { checked, cartNo })
      }
      await dispatch('calculate')
    },
    getCalculateRvt ({ dispatch }, { cartNos }) {
      return dispatch('_calculateRvt', { params: { cartNo: cartNos } })
    },
    async deleteCartByCartNosRvt ({ dispatch, commit }, { cartNos }) {
      if (isLogin()) {
        await dispatch('_deleteCart', { params: { cartNo: cartNos } })
      } else {
        const items = JSON.parse(window.localStorage.cartInfo || '[]')
        window.localStorage.cartInfo = JSON.stringify(
          items.filter(item => {
            return !cartNos.some(cartNo => cartNo === item.cartNo)
          })
        )
      }
      dispatch('fetchCount')
      if (router.app._route.name === 'Cart') {
        await dispatch('fetchCart')
      }
    },
    async updateCntRvt ({ dispatch, commit }, { cartInfos }) {
      let okFlg = true
      let updateCart = cartInfos.map(cartInfo => {
        return {
          cartNo: cartInfo.cartNo,
          orderCnt: cartInfo.orderCnt
        }
      })

      if (updateCart) {
        if (isLogin()) {
          await dispatch('_updateCart', { data: updateCart }).catch(() => {
            okFlg = false
          })
        } else {
          await dispatch('guestCartCheck', { guestCarts: cartInfos }).then(res => {
            if (res) {
              const items = JSON.parse(window.localStorage.cartInfo || '[]')
              items.forEach(item => {
                cartInfos.forEach(cartInfo => {
                  if (item.cartNo === cartInfo.cartNo) {
                    item.orderCnt = cartInfo.orderCnt
                  }
                })
              })
              window.localStorage.cartInfo = JSON.stringify(items)
              refreshCartStoragePeriod()
            } else {
              okFlg = false
            }
          })
        }
      }
      if (okFlg && router.app._route.name === 'Cart') {
        // commit('UPDATE_CHECKED', updateCart)
        await dispatch('fetchCart')
      }
      return okFlg
    }

  },
  getters: {
    haveWrappingProduct (state) {
      if (state.cart) {
        let haveFlg = false
        state.cart.deliveryGroups && state.cart.deliveryGroups.forEach(delivery => {
          delivery.orderProducts.forEach(product => {
            if (product.productNo === Number(process.env.VUE_APP_WRAPPING_PRODUCT)) {
              haveFlg = true
            }
          })
        })
        state.cart.invalidProducts && state.cart.invalidProducts.forEach(product => {
          if (product.productNo === Number(process.env.VUE_APP_WRAPPING_PRODUCT)) {
            haveFlg = true
          }
        })

        return haveFlg
      }
    },
    totalCount (state) {
      if (state.cart) {
        let product = state.cart.deliveryGroups ? state.cart.deliveryGroups.length : 0
        let invalidPrdCnt = state.cart.invalidProducts ? state.cart.invalidProducts.length : 0
        return product + invalidPrdCnt
      } else {
        return null
      }
    }
  },
  mutations: {
    FORMAT_CART (state) {
      if (state.cart) {
        state.showItems = []
        state.showReservationItems = []
        let tempCart = state.cart
        state.reservationCart.deliveryGroups = tempCart.deliveryGroups && tempCart.deliveryGroups.filter(delivery => {
          return delivery.orderProducts.filter(product => {
            return product.orderProductOptions.filter((option) => {
              return option.reservation === true
            }).length > 0
          }).length > 0
        })
        state.generalCart.deliveryGroups = tempCart.deliveryGroups && tempCart.deliveryGroups.filter(delivery => {
          return delivery.orderProducts.filter(product => {
            return product.orderProductOptions.filter((option) => {
              return option.reservation === false
            }).length > 0
          }).length > 0
        })
        /** 일반 상품 카트 */
        state.generalCart.deliveryGroups && state.generalCart.deliveryGroups.forEach(delivery => {
          let rowsCnt = 0
          let firstItem = null
          delivery.orderProducts.forEach(product => {
            product.orderProductOptions.forEach(option => {
              let tempItem = {
                isInvalid: false,
                cartNo: option.cartNo,
                productNo: product.productNo,
                optionNo: option.optionNo,
                productName: product.productName,
                optionTitle: formatOptionTitle(product.optionUsed, option.optionType, option.optionName, option.optionValue, option.price.addPrice),
                orderCnt: option.orderCnt,
                price: option.price,
                reservation: option.reservation,
                reservationDeliveryYmdt: option.reservationDeliveryYmdt,
                imageUrl: product.imageUrl,
                rowFirst: rowsCnt === 0
              }
              if (rowsCnt === 0) {
                firstItem = tempItem
              }
              state.showItems.push(tempItem)
              rowsCnt++
            })
          })
          firstItem.rowsCnt = rowsCnt
          firstItem.deliveryCondition = delivery.deliveryCondition
          firstItem.deliveryPayType = delivery.deliveryPayType
        })
        /** 예약 상품 카트 */
        if (state.reservationCart && state.reservationCart.deliveryGroups) {
          let reservationYmdtArr = []
          state.reservationCart.deliveryGroups.forEach(delivery => {
            delivery.orderProducts.forEach(product => {
              product.orderProductOptions.forEach(option => {
                reservationYmdtArr.push(option.reservationDeliveryYmdt)
              })
            })
          })
          reservationYmdtArr = uniqueArr(reservationYmdtArr)
          let ymdAllDeliverys = []
          reservationYmdtArr.forEach((ymd) => {
            let temp = state.reservationCart.deliveryGroups.filter(delivery => {
              return delivery.orderProducts.filter(product => {
                return product.orderProductOptions.filter((option) => {
                  return option.reservationDeliveryYmdt === ymd
                }).length > 0
              }).length > 0
            })
            ymdAllDeliverys.push(temp)
          })

          ymdAllDeliverys.forEach((ymdDeliveryGroup) => {
            let ymdItem = []
            ymdDeliveryGroup.forEach(delivery => {
              let rowsCnt = 0
              let firstItem = null
              delivery.orderProducts.forEach(product => {
                product.orderProductOptions.forEach(option => {
                  let tempItem = {
                    isInvalid: option.validInfo && option.validInfo.valid === false,
                    cartNo: option.cartNo,
                    productNo: product.productNo,
                    optionNo: option.optionNo,
                    productName: product.productName,
                    optionTitle: formatOptionTitle(product.optionUsed, option.optionType, option.optionName, option.optionValue, option.price.addPrice),
                    orderCnt: option.orderCnt,
                    price: option.price,
                    reservation: option.reservation,
                    reservationDeliveryYmdt: option.reservationDeliveryYmdt,
                    imageUrl: product.imageUrl,
                    rowFirst: rowsCnt === 0
                  }
                  if (rowsCnt === 0) {
                    firstItem = tempItem
                  }
                  ymdItem.push(tempItem)
                  rowsCnt++
                })
              })
              firstItem.rowsCnt = rowsCnt
              firstItem.deliveryCondition = delivery.deliveryCondition
              firstItem.deliveryPayType = delivery.deliveryPayType
            })
            state.showReservationItems.push(ymdItem)
          })
        }
        state.cart.invalidProducts && state.cart.invalidProducts.forEach(product => {
          product.orderProductOptions.forEach(option => {
            state.showItems.push({
              isInvalid: true,
              cartNo: option.cartNo,
              productNo: product.productNo,
              optionNo: option.optionNo,
              productName: product.productName,
              optionTitle: formatOptionTitle(product.optionUsed, option.optionType, option.optionName, option.optionValue, option.price.addPrice),
              orderCnt: option.orderCnt,
              price: option.price,
              reservation: option.reservation,
              reservationDeliveryYmdt: option.reservationDeliveryYmdt,
              imageUrl: product.imageUrl,
              rowFirst: true
            })
          })
        })
      }
    },
    CHECK_ALL (state, { checked }) {
      state.checkedItems = []
      if (checked) {
        state.showItems.forEach(item => {
          if (!item.isInvalid) {
            state.checkedItems.push({
              cartNo: item.cartNo,
              orderCnt: item.orderCnt,
              productNo: item.productNo,
              optionNo: item.optionNo
            })
          }
        })
      }
    },
    CHECK_OPTION (state, { checked, cartNo }) {
      if (state.showItems) {
        if (checked) {
          let item = state.showItems.find(option => Number(option.cartNo) === Number(cartNo))
          state.checkedItems.push({
            cartNo: item.cartNo,
            orderCnt: item.orderCnt,
            productNo: item.productNo,
            optionNo: item.optionNo
          })
        } else {
          state.checkedItems = state.checkedItems.filter(option => Number(option.cartNo) !== Number(cartNo))
        }
      }
    },
    UPDATE_CHECKED (state, updateCart) {
      if (state.checkedItems && state.checkedItems.length > 0) {
        state.checkedItems.forEach(item => {
          let tempOption = updateCart.find(option => Number(option.cartNo) === Number(item.cartNo))
          if (tempOption) {
            item.orderCnt = tempOption.orderCnt
          }
        })
      }
    },
    DELETE_CHECKED (state, { cartNos }) {
      state.checkedItems = state.checkedItems.filter(option => !cartNos.some(cartNo => Number(cartNo) === Number(option.cartNo)))
    },
    CHECK_ALL_ALLRVT (state) {
      state.reservationCheckedItems = []
      state.showReservationItems.forEach((items, index) => {
        let temp = []
        items.forEach(item => {
          if (!item.isInvalid) {
            temp.push(item.cartNo)
          }
        })
        state.reservationCheckedItems[index] = temp
      })
    },
    CHECK_ALL_RVT (state, { index, checked }) {
      state.reservationCheckedItems[index] = []
      if (checked) {
        state.showReservationItems[index].forEach(item => {
          if (!item.isInvalid) {
            state.reservationCheckedItems[index].push(item.cartNo)
          }
        })
      }
      state.reservationCheckedItems = JSON.parse(JSON.stringify(state.reservationCheckedItems))
    },
    CHECK_OPTION_RVT (state, { index, checked, cartNo }) {
      if (checked) {
        state.reservationCheckedItems[index].push(cartNo)
      } else {
        state.reservationCheckedItems[index] = state.reservationCheckedItems[index].filter(option => Number(option) !== Number(cartNo))
      }
      state.reservationCheckedItems = JSON.parse(JSON.stringify(state.reservationCheckedItems))
    },
    DELETE_CHECKED_RVT (state, { index, cartNos }) {
      state.reservationCheckedItems[index] = state.reservationCheckedItems[index].filter(option => !cartNos.some(cartNo => Number(cartNo) === Number(option)))
      state.reservationCheckedItems = state.reservationCheckedItems.filter(item => item.length > 0)
    }
  }
}
