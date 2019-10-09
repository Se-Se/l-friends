import { createNcpApiStore } from '@/api'
import { productPrice } from '@/utils/StringUtils'
import Vue from 'vue'
import store from '@/store'
const apiStore = createNcpApiStore([

  {
    action: '_fetchPackageOptions',
    property: 'packageOptions',
    path: '/products/{productNo}/options',
    pathParams: ['productNo'],
    method: 'get'
  },
  {
    action: '_asyncPackageOptions',
    property: 'resPackageOptions',
    path: 'products/{productNo}/options',
    pathParams: ['productNo'],
    method: 'get',
    onSuccess (state, payload) {
      if (state.packageOptions) {
        state.packageOptions.flatOptions = payload.data.flatOptions
      }
    }
  },
  {
    action: '_fetchPackage',
    property: 'package',
    path: '/products/{productNo}',
    pathParams: ['productNo'],
    method: 'get'
  },
  {
    action: '_asyncPackage',
    property: 'resPackage',
    path: '/products/{productNo}',
    pathParams: ['productNo'],
    method: 'get',
    onSuccess: (state, payload) => {
      if (state.package) {
        state.package.baseInfo.saleEndYmdt = payload.data.baseInfo.saleEndYmdt
        state.package.baseInfo.salePeriodType = payload.data.baseInfo.salePeriodType
        state.package.baseInfo.saleStartYmdt = payload.data.baseInfo.saleStartYmdt
        state.package.baseInfo.saleEndYmdt = payload.data.baseInfo.saleEndYmdt
        state.package.baseInfo.saleEndYmdt = payload.data.baseInfo.saleEndYmdt
        state.package.status = payload.data.status
        state.package.stock = payload.data.stock
        state.package.price = payload.data.price
        state.package.limitations = payload.data.limitations
      }
    }
  },
  {
    action: '_fetchPackageOptionsMainImgs',
    property: 'packageOptionsMainImgs',
    path: '/products/{productNo}/options/images',
    pathParams: ['productNo'],
    method: 'get'
  },
  {
    action: '_getPackageOptionsNoImages',
    property: 'packageOptionSubImgs',
    path: '/products/{productNo}/options/{optionNo}/images',
    pathParams: ['productNo', 'optionNo'],
    method: 'get',
    onSuccess (state, payload) {
      if (payload.data && payload.data.length > 0) {
        const item = {
          optionNo: payload.data[0].optionNo,
          imgs: payload.data.map(imgTemp => imgTemp.imageUrl)
        }
        state.packageOptionSubImgs.push(item)
      }
    }
  }
])

export default {
  namespaced: true,
  state: {
    packageOptionsMainImgs: [],
    packageOptionSubImgs: [],
    showLikedLayer: {
      imgLayer: false,
      navLayer: false,
      delBtnType: ''
    },
    storePackageNo: process.env.VUE_APP_WRAPPING_PRODUCT
  },
  actions: {
    async fetchPackage ({ state, dispatch, commit, rootState }, data) {
      state.package = null
      await dispatch('_fetchPackage', { params: { productNo: data.productTheNo } })
      await store.dispatch('recent/addRecent', { productNo: data.productTheNo }, { root: true })
    },
    fetchPackageOptions ({ state, dispatch, commit, rootState }, productNo) {
      return dispatch('_fetchPackageOptions', { params: { productNo } })
    },
    asyncPackageOptions ({ state, dispatch, commit, rootState }, productNo) {
      return dispatch('_asyncPackageOptions', { params: { productNo } })
    },
    asyncPackage ({ state, dispatch, commit, rootState }, productNo) {
      return dispatch('_asyncPackage', { params: { productNo } })
    },
    async refreshPackage ({ state, dispatch, commit, rootState }, productNo) {
      await dispatch('_fetchPackage', { params: { productNo } })
      dispatch('_fetchPackageOptions', { params: { productNo } })
    },
    async fetchPackageOptionsImages ({ state, dispatch, commit, rootState }, productNo) {
      if (state.package && state.package.baseInfo && state.package.baseInfo.optionImageViewable) {
        await dispatch('_fetchPackageOptionsMainImgs', { params: { productNo } })
        if (state.packageOptionsMainImgs) {
          state.packageOptionsMainImgs.forEach(option => {
            dispatch('_getPackageOptionsNoImages', { params: { productNo: productNo, optionNo: option.optionNo } })
          })
        }
      }
    }
  },
  mutations: {
    SET_PARAMS (state, params) {
      state.fetchListParams = {
        ...state.fetchListParams,
        ...params
      }
    },
    CLEARPRODUCT (state) {
      state.package = null
    },
    SELECTOPTION (state, option) {
      if (state.packageOptions.selectedOptions === undefined) {
        Vue.set(state.packageOptions, 'selectedOptions', [])
        // state.packageOptions.selectedOptions[0].viewValue = []
      }
      // 이미 선택은 또 선택이 불가
      if (option.inputsFlag || state.packageOptions.selectedOptions.filter(o => o.optionNo === option.optionNo).length === 0) {
        state.packageOptions.selectedOptions.push(option)
      }
    },
    UPOPTIONCOUNT (state, index) {
      let maxCnt = 9999
      if (state.packageOptions.selectedOptions[index].orderCnt < maxCnt) {
        state.packageOptions.selectedOptions[index].orderCnt++
      }
    },
    DOWNOPTIONCOUNT (state, index) {
      if (Number(state.packageOptions.selectedOptions[index].orderCnt <= 1)) {
        return
      }
      state.packageOptions.selectedOptions[index].orderCnt--
    },
    REFRESH (state, payload) {
      state.packageOptions.selectedOptions[payload.index].orderCnt = payload.orderCnt
    },
    DELETEOPTION (state, { index, btnType }) {
      state.delBtnType = btnType
      Vue.delete(state.packageOptions.selectedOptions, index)
    },
    DELETEOPTIONS (state) { // TODO 옵션을 모두 지우는건데 아직은 미사용
      if (state.packageOptions.selectedOptions.length > 0) {
        for (let i = 0; i < state.packageOptions.selectedOptions.length; i++) {
          Vue.delete(state.packageOptions.selectedOptions, i)
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
      state.packageOptionsMainImgs.forEach(mainItem => {
        if (!mainItem.soldout) {
          tempImgs.push(...state.packageOptionSubImgs.filter(item => item.optionNo === mainItem.optionNo))
        }
      })
      let optionNo = tempImgs[nextSlide].optionNo
      state.currentIndex = state.packageOptionsMainImgs.findIndex((item) => item.optionNo === optionNo)
    },
    CLEAR_SUB_IMGS (state) {
      state.packageOptionSubImgs = []
    }
  },
  getters: {
    displayOptions (state) {
      const dispOpt = []
      if (state.packageOptions && state.packageOptions.flatOptions && (state.packageOptions.type === 'COMBINATION' || state.packageOptions.type === 'MAPPING')) {
        const flatOpts = state.packageOptions.flatOptions
        const values = flatOpts.map(item => item.value)

        state.packageOptions.labels.forEach((lab, idx, arr) => {
          let optval = values.map(item => item.split('|')[idx])
          optval = Array.from(new Set(optval))
          const obj = { label: lab, value: optval }
          dispOpt.push(obj)
        })
      }
      if (state.packageOptions && state.packageOptions.flatOptions && (state.packageOptions.type === 'STANDARD' || state.packageOptions.type === 'DEFAULT')) {
        state.packageOptions.labels.forEach((lab, idx, arr) => {
          const obj = { label: lab, value: state.packageOptions.flatOptions }
          dispOpt.push(obj)
        })
      }
      return dispOpt
    },
    optionInputsGetters (state) {
      let arr = []
      if (state.packageOptions && state.packageOptions.inputs) {
        arr = state.packageOptions.inputs.filter((optItem) => optItem.inputMatchingType === 'OPTION')
      }
      return arr
    },
    optionsTypeCOMBINATION (state) {
      if (state.packageOptions) {
        return state.packageOptions.type === 'COMBINATION'
      }
    },
    optionsTypeDEFAULT (state) {
      if (state.packageOptions) {
        return state.packageOptions.type === 'DEFAULT'
      }
    },
    productInputsGetters (state) {
      let arr = []
      if (state.packageOptions && state.packageOptions.inputs) {
        arr = state.packageOptions.inputs.filter((optItem) => optItem.inputMatchingType === 'PRODUCT')
      }
      return arr
    },
    productPackage (state) {
      if (state.package && state.package.baseInfo) {
        let p = productPrice(state.package.price.salePrice,
          state.package.price.additionDiscountAmt,
          state.package.price.immediateDiscountAmt
        )

        // 할인율
        state.package.price.discountRate = p.discountRate
        // 최종할인가
        state.package.price.finalSalePrice = p.finalSalePrice

        let endDate = new Date(state.package.baseInfo.saleEndYmdt.replace(' ', 'T'))
        let currentDate = new Date()

        // 남은 시간
        state.package.baseInfo.remainingSalesTime = endDate.getTime() - currentDate.getTime()
        state.package.baseInfo.remainingSalesDay = Math.floor((endDate.getTime() - currentDate.getTime()) / 1000 / 24 / 60 / 60)

        // 상품정보 제공고시
        state.package.baseInfo.baseInfoByJSON = JSON.parse(state.package.baseInfo.dutyInfo)

        // 스티커
        if (state.package.deliveryFee && state.package.deliveryFee.deliveryConditionType === 'FREE') {
          state.package.baseInfo.stickerLabels.push('無料配送')
        }
      }
      return state.package
    },
    optionsPack (state) {
      if (state.packageOptions && state.packageOptions.inputs) {
        state.packageOptions.optionInputs = state.packageOptions.inputs.filter(o => o.inputMatchingType === 'OPTION')
        state.packageOptions.productInputs = state.packageOptions.inputs.filter(o => o.inputMatchingType === 'PRODUCT')
        Vue.set(state.packageOptions, 'enteredProductInputs', [])
        for (let i = 0; i < state.packageOptions.productInputs.length; i++) {
          Vue.set(state.packageOptions.enteredProductInputs, i, {
            inputValue: ''
          })
        }
      }
      return state.packageOptions
    },
    productOptionsImgs (state) {
      if (state.packageOptionSubImgs && state.packageOptionsMainImgs && state.packageOptionsMainImgs.length === state.packageOptionSubImgs.length) {
        const productOptionsImgs = []
        state.packageOptionsMainImgs.forEach(mainItem => {
          if (!mainItem.soldout) {
            productOptionsImgs.push(...state.packageOptionSubImgs.filter(item => item.optionNo === mainItem.optionNo))
          }
        })
        return productOptionsImgs
      }
    },
    optionNoIndex (state) {
      if (!state.packageOptions) return []
    }
  },
  mixins: [apiStore]
}
