import { createNcpApiStore } from '@/api'
import { getToday } from '@/utils/dateUtils'

const apiStore = createNcpApiStore([
  {
    action: '_malls',
    property: 'malls',
    path: 'malls'
  },
  {
    action: '_uploadImages',
    property: 'uploadImagesData',
    path: 'files',
    method: 'post'
  },
  {
    action: '_categories',
    property: 'categories',
    path: 'categories',
    onSuccess (state, res) {
      state.categories = res.data.multiLevelCategories.filter((multiLevelCategorie) => !!multiLevelCategorie.children)
    }
  },
  {
    action: '_newCategories',
    property: 'news',
    path: 'categories/new-product-categories'
  }
])

export default {
  namespaced: true,
  state: {
    malls: null,
    categories: null
  },
  mixins: [apiStore],
  actions: {
    uploadImages ({ state, dispatch, commit }, data) {
      return dispatch('_uploadImages', { data })
    },
    async fetchMalls ({ state, dispatch }) {
      let mallInfo = JSON.parse(window.localStorage.mallInfo || null)
      let mallExpired = JSON.parse(window.localStorage.mallExpired || null)
      if (mallInfo && mallExpired && mallExpired === getToday()) {
        state.malls = mallInfo
      } else {
        await dispatch('_malls')
        window.localStorage.mallInfo = JSON.stringify(state.malls)
        window.localStorage.mallExpired = JSON.stringify(getToday())
      }
      return state.malls
    },
    async fetchCategories ({ state, dispatch }) {
      let categories = JSON.parse(window.localStorage.categories || null)
      let categoryExpired = JSON.parse(window.localStorage.categoryExpired || null)
      if (categories && categoryExpired && categoryExpired === getToday()) {
        state.categories = categories
      } else {
        await dispatch('_categories')
        window.localStorage.categories = JSON.stringify(state.categories)
        window.localStorage.categoryExpired = JSON.stringify(getToday())
      }
      return state.categories
    },
    async fetchNewCategories ({ state, dispatch }) {
      await dispatch('_newCategories')
      return state.newCategories
    },
    async getMalls ({ state, commit, dispatch }) {
      await dispatch('_malls')
    }
  },
  getters: {
    categorieDepth1 (state, getters, rootState) {
      if (state.categories) {
        // console.log(rootState.route.params.categoryNo)
        const depth1 = state.categories.find(item => item.categoryNo === Number(rootState.route.params.categoryNo))
        return depth1
      }
    },
    categorieDepth2 (state, getters, rootState) {
      // console.log(rootState.route.params.subCategoryNo)
      if (state.categories && rootState.route.params.subCategoryNo) {
        const depth1 = state.categories.find(item => item.categoryNo === Number(rootState.route.params.categoryNo))
        const depth2 = depth1 && depth1.children.find(item => item.categoryNo === Number(rootState.route.params.subCategoryNo))
        return depth2
      }
    },
    inquiryType  (state) {
      if (state.malls) {
        return state.malls.inquiryType
      }
      return null
    },
    productInquiryTypes (state) {
      if (state.malls) {
        return state.malls.productInquiryType
      }
      return null
    },
    claimReasonTypes (state) {
      if (state.malls) {
        return state.malls.claimReasonType
      }
      return null
    }
  },
  mutations: {
  }
}
