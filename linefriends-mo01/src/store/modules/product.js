import { createNcpApiStore } from '@/api'
import { productPrice } from '@/utils/StringUtils'
import Vue from 'vue'
import store from '@/store'
import qs from 'qs'
import dev from '../../data/dev-brands'
import prod from '../../data/prod-brands'
import router from '@/router'
const apiStore = createNcpApiStore([

  {
    action: '_fetchProductOptions',
    property: 'options',
    path: '/products/{productNo}/options',
    pathParams: ['productNo'],
    method: 'get'
  },
  {
    action: '_asyncProductOptions',
    property: 'resOptions',
    path: 'products/{productNo}/options',
    pathParams: ['productNo'],
    method: 'get',
    onSuccess (state, payload) {
      if (state.options) {
        state.options.flatOptions = payload.data.flatOptions
      }
    }
  },
  {
    action: '_fetchProduct',
    property: 'product',
    path: '/products/{productNo}',
    pathParams: ['productNo'],
    method: 'get'
  },
  {
    action: '_asyncProduct',
    property: 'resProduct',
    path: '/products/{productNo}',
    pathParams: ['productNo'],
    method: 'get',
    onSuccess: (state, payload) => {
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
    action: '_fetchProductOptionsMainImgs',
    property: 'optionsMainImgs',
    path: '/products/{productNo}/options/images',
    pathParams: ['productNo'],
    method: 'get'
  },
  {
    action: '_getProductOptionsNoImages',
    property: 'optionSubImgs',
    path: '/products/{productNo}/options/{optionNo}/images',
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
  },
  {
    action: '_getfavoriteKeywords',
    property: 'favoriteKeywords',
    path: 'products/favoriteKeywords?size=10', // 人気検索語
    method: 'get'
  },
  {
    action: '_fetchBestProducts',
    property: 'bestProducts',
    path: 'products/main-best-products', // 메인 베스트 상품
    method: 'get',
    onSuccess: (state, payload) => {
      if (payload.data.mainBestProductInfos !== null) {
        state.bestProducts = [...state.bestProducts || [], ...payload.data.mainBestProductInfos]
      }
    }
  },
  {
    action: '_fetchMainBestProducts',
    property: 'mainBestProducts',
    path: 'products/main-best-products/brands', // 메인 베스트 상품 ブランドベスト商品（search engine）
    method: 'get',
    onSuccess: (state, payload) => {
      if (payload.data !== null) {
        state.mainBestProducts = payload.data
      }
    },
    requestConfig: {
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
    }
  }
])

export default {
  namespaced: true,
  state: {
    goodsInfo: {},
    optionsMainImgs: [],
    optionSubImgs: [],
    showLikedLayer: {
      imgLayer: false,
      navLayer: false,
      delBtnType: ''
    },
    packageNum: process.env.VUE_APP_WRAPPING_PRODUCT
  },
  actions: {
    async initProduct ({ state, dispatch, commit }, { to, from }) {
      state.product = null
      await dispatch('_fetchProduct', { params: { productNo: to.params.goodsNo } }).then(() => {
        store.dispatch('productinquiry/fetchProductInquiry', { productNo: to.params.goodsNo }, { root: true })
        store.dispatch('recent/addRecent', { productNo: to.params.goodsNo }, { root: true })
        store.dispatch('recent/fetchRecentProducts', {}, { root: true })
        store.dispatch('product/fetchProductOptions', to.params.goodsNo, { root: true })
        store.dispatch('product/fetchProductOptionsImages', to.params.goodsNo, { root: true })
        store.dispatch('common/getMalls', {}, { root: true })
        store.dispatch('profile/memberFetch', {}, { root: true })
        store.dispatch('productrecommand/fetchByProductNo', to.params.goodsNo, { root: true })
        store.dispatch('coupon/fetchProductCoupons', to.params.goodsNo, { root: true })
        store.dispatch('review/fetchProductReviews', { productNo: to.params.goodsNo, pageNo: 1, orderBy: 'RECOMMEND' }, { root: true })
      }).catch(e => {
        state.product = null
        state.options = null
        router.replace('/')
      })
    },
    async fetchProduct ({ state, dispatch, commit, rootState }, data) {
      state.product = null
      await dispatch('_fetchProduct', { params: { productNo: data.productTheNo } })
      await store.dispatch('recent/addRecent', { productNo: data.productTheNo }, { root: true })
      await store.dispatch('recent/fetchRecentProducts', {}, { root: true })
    },
    fetchProductOptions ({ state, dispatch, commit, rootState }, productNo) {
      return dispatch('_fetchProductOptions', { params: { productNo } })
    },
    asyncProductOptions ({ state, dispatch, commit, rootState }, productNo) {
      return dispatch('_asyncProductOptions', { params: { productNo } })
    },
    asyncProduct ({ state, dispatch, commit, rootState }, productNo) {
      return dispatch('_asyncProduct', { params: { productNo } })
    },
    async refreshProduct ({ state, dispatch, commit, rootState }, productNo) {
      await dispatch('_fetchProduct', { params: { productNo } })
      return dispatch('_fetchProductOptions', { params: { productNo } })
    },
    async fetchProductOptionsImages ({ state, dispatch, commit, rootState }, productNo) {
      if (state.product && state.product.baseInfo && state.product.baseInfo.optionImageViewable) {
        await dispatch('_fetchProductOptionsMainImgs', { params: { productNo } })
        if (state.optionsMainImgs) {
          state.optionsMainImgs.forEach(option => {
            dispatch('_getProductOptionsNoImages', { params: { productNo: productNo, optionNo: option.optionNo } })
          })
        }
      }
    },
    fetchFavoriteKeywords ({ state, dispatch, commit, rootState }) {
      return dispatch('_getfavoriteKeywords')
    },
    async fetchWrappingProduct ({ state, dispatch }) {
      state.product = null
      await dispatch('_fetchProduct', { params: { productNo: process.env.VUE_APP_WRAPPING_PRODUCT } })
    },
    fetchBestProducts ({ state, dispatch, commit }, { type }) {
      commit('CLEAR_LIST')
      commit('SET_PARAMS', {
        'soldout': false
      })

      if (type === 'cart') {
        commit('SET_PARAMS', {
          'excludeProductNos': process.env.VUE_APP_WRAPPING_PRODUCT
        })
      }
      return dispatch('_fetchBestProducts', { params: state.fetchListParams })
    },
    fetchMainBestProducts ({ state, dispatch, commit }, { type }) {
      commit('CLEAR_LIST')
      // commit('SET_PARAMS', {
      //   'brandNames': ['BROWN & FRIENDS', 'LINE CREATORS', 'BT21']
      // })
      let theParams = {
        'BROWN_FRIENDS': process.env.NODE_ENV === 'production' ? prod[0].brandNos : dev[0].brandNos,
        'BT21': process.env.NODE_ENV === 'production' ? prod[1].brandNos : dev[1].brandNos,
        'LINE_CREATORS': process.env.NODE_ENV === 'production' ? prod[2].brandNos : dev[2].brandNos
      }
      return dispatch('_fetchMainBestProducts', { params: theParams })
    }
  },
  mutations: {
    CLEAR_LIST (state) {
      state.bestProducts = null
      state.mainBestProducts = null
    },
    RESET_PARAMS (state) {
      state.fetchListParams = []
    },
    SET_PARAMS (state, params) {
      state.fetchListParams = {
        ...state.fetchListParams,
        ...params
      }
    },
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
        Vue.set(state.options, 'selectedOptions', [])
      }
      // 이미 선택은 또 선택이 불가
      if (option.inputsFlag || state.options.selectedOptions.filter(o => o.optionNo === option.optionNo).length === 0) {
        state.options.selectedOptions.push(option)
      }
    },
    UPOPTIONCOUNT (state, index) {
      let maxCnt = 9999
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
          state.product.baseInfo.stickerLabels.push('無料配送')
        }
      }
      return state.product
    },
    options (state) {
      if (state.options && state.options.inputs) {
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
