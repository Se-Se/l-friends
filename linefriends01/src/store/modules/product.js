import { createNcpApiStore } from '@/api'
// import { getDateFormat } from '@/utils/dateUtils'
import { productPrice } from '@/utils/StringUtils'
import { Alert } from '@/utils/event-bus'
import router from '@/router'
import Vue from 'vue'
import store from '@/store'
import { gaEventViewItem } from '@/utils/gaEventUtils'
const apiStore = createNcpApiStore([
  {
    action: '_fetchProduct',
    property: 'product',
    path: 'products/{mallProductNo}',
    pathParams: ['mallProductNo'],
    method: 'get'
  },
  {
    action: '_asyncProduct',
    property: 'resProduct',
    path: 'products/{mallProductNo}',
    pathParams: ['mallProductNo'],
    method: 'get',
    onSuccess (state, payload) {
      if (state.product) {
        state.product.baseInfo.saleEndYmdt = payload.data.baseInfo.saleEndYmdt
        state.product.baseInfo.salePeriodType = payload.data.baseInfo.salePeriodType
        state.product.baseInfo.saleStartYmdt = payload.data.baseInfo.saleStartYmdt
        state.product.baseInfo.saleEndYmdt = payload.data.baseInfo.saleEndYmdt
        state.product.baseInfo.saleEndYmdt = payload.data.baseInfo.saleEndYmdt
        state.product.status = payload.data.status
        state.product.stock = payload.data.stock
        state.product.price = payload.data.price
        state.product.limitations = payload.data.limitations
      }
    }
  },
  {
    action: '_fetchProductOptions',
    property: 'options',
    path: 'products/{mallProductNo}/options',
    pathParams: ['mallProductNo'],
    method: 'get'
  },
  {
    action: '_asyncProductOptions',
    property: 'resOptions',
    path: 'products/{mallProductNo}/options',
    pathParams: ['mallProductNo'],
    method: 'get',
    onSuccess (state, payload) {
      if (state.options) {
        state.options.flatOptions = payload.data.flatOptions
      }
    }
  },
  {

    action: '_getFavoriteKeywords',
    property: 'favoriteKeywords',
    path: 'products/favoriteKeywords?size=10',
    method: 'get'
  },
  {
    action: '_getInputFavoriteKeywords',
    property: 'inputFavoriteKeywords',
    path: 'products/favoriteKeywords?size=100',
    method: 'get'
  },
  {
    action: '_fetchProductOptionsMainImgs',
    property: 'optionsMainImgs',
    path: 'products/{mallProductNo}/options/images',
    pathParams: ['mallProductNo'],
    method: 'get'
  },
  {
    action: '_fetchOptionSubImgs',
    property: 'optionSubImgs',
    path: 'products/{productNo}/options/{optionNo}/images',
    pathParams: ['productNo', 'optionNo'],
    method: 'get',
    onSuccess (state, payload) {
      if (payload.data && payload.data.length > 0) {
        const item = {
          optionNo: payload.data[0].optionNo,
          imgs: payload.data.map(imgTemp => imgTemp.imageUrl)
        }
        state.optionSubImgs.push(item)
      }
    }
  }
])

export default {
  namespaced: true,
  state: {
    showLikedLayer: {
      imgLayer: false,
      navLayer: false,
      delBtnType: ''
    },
    optionSubImgs: [],
    selectedOption: '',
    currentIndex: 0,
    preview: false
  },
  actions: {
    fetchProduct ({ state, dispatch, commit, rootState }, product) {
      state.product = null
      const mallProductNo = product.productNo
      const preview = product.preview === 'true'
      state.preview = preview
      return dispatch('_fetchProduct', { params: { mallProductNo, preview } }).then(() => {
        document.title = state.product.baseInfo.productName + '- LINE FRIENDS'
        store.dispatch('recent/addRecent', { productNo: product.productNo }, { root: true })
        /** gtag.js */
        gaEventViewItem(state.product)
      }).catch((e) => {
        if (e.data.code === 'E0005') {
          Alert({
            message: e.data.message,
            callback: () => {
              router.replace('/')
            }
          })
        }
      })
    },
    fetchProductOptions ({ state, dispatch, commit, rootState }, mallProductNo) {
      return dispatch('_fetchProductOptions', { params: { mallProductNo } })
    },
    asyncProductOptions ({ state, dispatch, commit, rootState }, mallProductNo) {
      return dispatch('_asyncProductOptions', { params: { mallProductNo } })
    },
    asyncProduct ({ state, dispatch, commit, rootState }, mallProductNo) {
      return dispatch('_asyncProduct', { params: { mallProductNo } })
    },
    async refreshProduct ({ state, dispatch, commit, rootState }, mallProductNo) {
      await dispatch('_fetchProduct', { params: { mallProductNo } })
      return dispatch('_fetchProductOptions', { params: { mallProductNo } })
    },
    async fetchProductOptionsImages ({ state, dispatch, commit, rootState }, mallProductNo) {
      if (state.product && state.product.baseInfo && state.product.baseInfo.optionImageViewable) {
        await dispatch('_fetchProductOptionsMainImgs', { params: { mallProductNo } })
        if (state.optionsMainImgs) {
          state.optionsMainImgs.forEach(option => {
            dispatch('_fetchOptionSubImgs', { params: { productNo: mallProductNo, optionNo: option.optionNo } })
          })
        }
      }
    }
  },
  mutations: {
    CLEARPRODUCT (state) {
      state.product = null
    },
    CHANGELIKED (state) {
      if (state.product) {
        state.product.liked = !state.product.liked
      }
    },
    SELECTOPTION (state, option) {
      if (state.options.selectedOptions === undefined) {
        // state.options.selectedOptions = []
        Vue.set(state.options, 'selectedOptions', [])
      }
      // 이미 선택은 또 선택이 불가
      if (option.inputsFlag || state.options.selectedOptions.filter(o => o.optionNo === option.optionNo).length === 0) {
        state.options.selectedOptions.push(option)
      }
    },
    UPOPTIONCOUNT (state, index) {
      let maxCnt = 9999
      // if (state.product.limitations.maxBuyPersonCnt > maxCnt) {
      //   maxCnt = state.product.limitations.maxBuyPersonCnt
      // } else if (state.product.limitations.maxBuyPeriodCnt > maxCnt) {
      //   maxCnt = state.product.limitations.maxBuyPeriodCnt
      // } else if (state.product.limitations.maxBuyTimeCnt > maxCnt) {
      //   maxCnt = state.product.limitations.maxBuyTimeCnt
      // }

      if (state.options.selectedOptions[index].orderCnt < maxCnt) {
        state.options.selectedOptions[index].orderCnt++
      }
    },
    DOWNOPTIONCOUNT (state, index) {
      if (Number(state.options.selectedOptions[index].orderCnt <= 1)) {
        return
      }
      state.options.selectedOptions[index].orderCnt--
    },
    REFRESH (state, payload) {
      state.options.selectedOptions[payload.index].orderCnt = payload.orderCnt
    },
    DELETEOPTION (state, { index, btnType }) {
      state.delBtnType = btnType
      Vue.delete(state.options.selectedOptions, index)
    },
    DELETEOPTIONS (state) { // TODO 옵션을 모두 지우는건데 아직은 미사용
      if (state.options.selectedOptions.length > 0) {
        for (let i = 0; i < state.options.selectedOptions.length; i++) {
          Vue.delete(state.options.selectedOptions, i)
        }
      }
    },
    INIT_SHOW_LAYER (state) {
      state.showLikedLayer = {
        imgLayer: false,
        navLayer: false
      }
    },
    SELECT_OPTION (state, optionNo) {
      state.selectedOption = optionNo
    },
    GET_POP_IMG_INDEX (state, nextSlide) {
      const tempImgs = []
      state.optionsMainImgs.forEach(mainItem => {
        if (!mainItem.soldout) {
          tempImgs.push(...state.optionSubImgs.filter(item => item.optionNo === mainItem.optionNo))
        }
      })
      let optionNo = tempImgs[nextSlide].optionNo
      state.currentIndex = state.optionsMainImgs.findIndex((item) => item.optionNo === optionNo)
    },
    CLEAR_SUB_IMGS (state) {
      state.optionSubImgs = []
    }
  },
  getters: {
    displayOptions (state) {
      const dispOpt = []
      if (state.options && state.options.flatOptions && (state.options.type === 'COMBINATION' || state.options.type === 'MAPPING')) {
        const flatOpts = state.options.flatOptions
        const values = flatOpts.map(item => item.value)

        state.options.labels.forEach((lab, idx, arr) => {
          let optval = values.map(item => item.split('|')[idx])
          optval = Array.from(new Set(optval))
          const obj = { label: lab, value: optval }
          dispOpt.push(obj)
        })
      }
      if (state.options && state.options.flatOptions && (state.options.type === 'STANDARD' || state.options.type === 'DEFAULT')) {
        state.options.labels.forEach((lab, idx, arr) => {
          const obj = { label: lab, value: state.options.flatOptions }
          dispOpt.push(obj)
        })
      }
      return dispOpt
    },
    optionInputsGetters (state) {
      let arr = []
      if (state.options && state.options.inputs) {
        arr = state.options.inputs.filter((optItem) => optItem.inputMatchingType === 'OPTION')
      }
      return arr
    },
    optionsTypeCOMBINATION (state) {
      if (state.options) {
        return state.options.type === 'COMBINATION'
      }
    },
    optionsTypeDEFAULT (state) {
      if (state.options) {
        return state.options.type === 'DEFAULT'
      }
    },
    productInputsGetters (state) {
      let arr = []
      if (state.options && state.options.inputs) {
        arr = state.options.inputs.filter((optItem) => optItem.inputMatchingType === 'PRODUCT')
      }
      return arr
    },
    product (state) {
      if (state.product && state.product.baseInfo) {
        let p = productPrice(state.product.price.salePrice,
          state.product.price.additionDiscountAmt,
          state.product.price.immediateDiscountAmt
        )

        // 할인율
        state.product.price.discountRate = p.discountRate
        // 최종할인가
        state.product.price.finalSalePrice = p.finalSalePrice

        let endDate = new Date(state.product.baseInfo.saleEndYmdt.replace(' ', 'T'))
        let currentDate = new Date()

        // 남은 시간
        state.product.baseInfo.remainingSalesTime = endDate.getTime() - currentDate.getTime()
        state.product.baseInfo.remainingSalesDay = Math.floor((endDate.getTime() - currentDate.getTime()) / 1000 / 24 / 60 / 60)

        // 상품정보 제공고시
        state.product.baseInfo.baseInfoByJSON = JSON.parse(state.product.baseInfo.dutyInfo)

        // 스티커
        if (state.product.deliveryFee && state.product.deliveryFee.deliveryConditionType === 'FREE') {
          state.product.baseInfo.stickerLabels.push('무료배송')
        }
      }
      return state.product
    },
    options (state) {
      if (state.options) {
        state.options.optionInputs = state.options.inputs.filter(o => o.inputMatchingType === 'OPTION')
        state.options.productInputs = state.options.inputs.filter(o => o.inputMatchingType === 'PRODUCT')
        Vue.set(state.options, 'enteredProductInputs', [])
        for (let i = 0; i < state.options.productInputs.length; i++) {
          Vue.set(state.options.enteredProductInputs, i, {
            inputValue: ''
          })
        }
      }
      return state.options
    },
    productOptionsImgs (state) {
      if (state.optionSubImgs && state.optionsMainImgs && state.optionsMainImgs.length === state.optionSubImgs.length) {
        const productOptionsImgs = []
        state.optionsMainImgs.forEach(mainItem => {
          if (!mainItem.soldout) {
            productOptionsImgs.push(...state.optionSubImgs.filter(item => item.optionNo === mainItem.optionNo))
          }
        })
        return productOptionsImgs
      }
    },
    optionNoIndex (state) {
      if (!state.options) return []
    }
  },
  mixins: [apiStore]
}
