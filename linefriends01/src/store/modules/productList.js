import { createNcpApiStore } from '@/api'
import cookies from 'js-cookie'
import Vue from 'vue'

/* #global NCPSearch */
const defaultParams = {
  'filter.discountedPrices': null,
  'filter.discountedComparison': null,
  'filter.saleStatus': 'RESERVATION_AND_ONSALE',
  'order.by': null,
  'order.direction': null,
  'pageNumber': 1,
  'pageSize': 20,
  'hasTotalCount': true,
  'categoryNos': null,
  'brandNos': null,
  'filter.soldout': true
}

const apiStore = createNcpApiStore([
  {
    action: 'fetchList',
    property: 'list',
    path: 'products/search',
    method: 'get',
    queryParams: true,
    beforeRequest (state) {
      state.apiLoading = true
    },
    onSuccess (state, payload) {
      state.apiLoading = false
      state.list = [...state.list || [], ...payload.data.items]
      state.totalCount = payload.data.totalCount
      state.clickUrlPrefix = payload.data.clickUrlPrefix
      state.depth1Categories = payload.data.depth1Categories
      state.depth2Categories = payload.data.depth2Categories
    },
    cacheable: false
  },
  { /* 모바일 더보기 전용 */
    action: 'fetchListMore',
    property: 'list',
    path: 'products/search',
    method: 'get',
    queryParams: true,
    onSuccess (state, payload) {
      state.list = [...state.list || [], ...payload.data.items]
      state.totalCount = payload.data.totalCount
      state.clickUrlPrefix = payload.data.clickUrlPrefix
      state.depth1Categories = payload.data.depth1Categories
      state.depth2Categories = payload.data.depth2Categories
    },
    cacheable: false
  },
  {
    action: 'resetAndFetchList', // 깜빡거리는거 방지용 fetchList
    property: 'list',
    path: 'products/search',
    method: 'get',
    queryParams: true,
    beforeRequest (state) {
      state.apiLoading = true
    },
    onSuccess (state, payload) {
      state.list = []

      Vue.nextTick(() => {
        state.apiLoading = false
        state.list = [...payload.data.items]
        state.totalCount = payload.data.totalCount
        state.clickUrlPrefix = payload.data.clickUrlPrefix
        state.depth1Categories = payload.data.depth1Categories
        state.depth2Categories = payload.data.depth2Categories
      })
    },
    cacheable: false
  },
  {
    action: 'fetchBestList',
    property: 'bestList',
    path: 'products/search',
    method: 'get'
  },
  {
    action: 'fetchCategory',
    property: 'allCategories',
    path: 'products/search',
    method: 'get',
    onSuccess (state, payload) {
      state.allCategories = {}
      state.allCategories.depth1Categories = payload.data.depth1Categories
      state.allCategories.depth2Categories = payload.data.depth2Categories
    }
  },
  {
    action: 'fetchCategoryBycategoryNo',
    property: 'categories',
    path: 'categories/{categoryNo}',
    method: 'get',
    onSuccess (state, payload) {
      state.categories = {}
      state.categories = payload.data
    }
  }
])

export default {
  namespaced: true,
  state: {
    list: [],
    fetchListParams: {},
    totalCount: 0,
    depth1Categories: null,
    depth2Categories: null,
    loading: true,
    filter: {
      label: '판매인기순'
    },
    searchHistory: JSON.parse(localStorage.getItem('search-history')) || [],
    apiLoading: false,
    currentPage: 1
  },
  actions: {
    async fetchBestByCategory ({ state, dispatch, commit, rootState }, toCategoryNo) {
      let categoryNo = toCategoryNo
      categoryNo = categoryNo || null
      commit('CLEAR_LIST')
      commit('RESET_PARAMS')
      commit('SET_PARAMS', {
        'order.by': 'POPULAR',
        'order.direction': 'DESC',
        'categoryNos': categoryNo,
        'pageSize': 33,
        'pageNumber': 1
      })
      await dispatch('fetchList', { params: state.fetchListParams })
      if (state.list && state.list.length === 0) {
        state.loading = false
      }
    },
    async fetchListByCategory ({ state, dispatch, commit, rootState, rootGetters }, to) {
      let categoryNo = to.params.depth4No || to.params.depth3No || to.params.depth2No || to.params.depth1No || null
      let brandNos = []
      const brands = rootGetters['brand/flatBrands']
      const brand = brands.filter(item => item.brandNo === to.query.brandNo)[0]
      if (brand) {
        brandNos.push(brand.brandNo)
        if (brand.brands) {
          brandNos.push(brand.brands.map(item => item.brandNo))
        }
      }

      if ((categoryNo || brandNos.length > 0) && state.fetchListParams.categoryNos === categoryNo && state.fetchListParams.brandNos === brandNos.join(',')) {
        return false
      }

      commit('CLEAR_LIST')
      commit('RESET_PARAMS')
      commit('SET_FILTER_DEFAULT')
      commit('SET_PARAMS', {
        'order.by': 'MD_RECOMMEND',
        'order.direction': 'ASC',
        'categoryNos': categoryNo,
        'pageSize': 20,
        'pageNumber': state.currentPage,
        brandNos: brandNos.join(',')
      })

      return dispatch('fetchList', { params: state.fetchListParams }).then(() => { state.loading = false })
    },
    async fetchListByBrand ({ state, dispatch, commit, rootState }, { to }) {
      let brandNo = rootState.route.params.brandNo || to.params.brandNo
      let categoryNo = to.params.depth2No || to.params.depth1No || null
      commit('CLEAR_LIST')
      commit('RESET_PARAMS')
      commit('SET_FILTER_DEFAULT')
      commit('SET_PARAMS', {
        'order.by': 'POPULAR',
        'order.direction': 'DESC',
        'brandNos': brandNo,
        'pageSize': 15,
        'pageNumber': 1,
        'categoryNos': categoryNo
      })

      await dispatch('fetchList', { params: state.fetchListParams })
      if (state.list && state.list.length === 0) {
        state.loading = false
      }
    },
    async fetchListSale ({ state, dispatch, commit, rootGetters }, to) {
      let brandNos = []
      const brands = rootGetters['brand/flatBrands']
      const brand = brands.filter(item => item.brandNo === to.query.brandNo)[0]
      if (brand) {
        if (brand.brands) {
          brandNos = brand.brands.map(item => item.brandNo)
        } else {
          brandNos.push(brand.brandNo)
        }
      }

      commit('CLEAR_LIST')
      commit('RESET_PARAMS')
      commit('SET_FILTER_DEFAULT')
      commit('SET_PARAMS', {
        'order.by': 'RECENT_PRODUCT',
        'order.direction': 'DESC',
        'onlySaleProduct': true,
        'pageSize': 20,
        'pageNumber': 1,
        'brandNos': brandNos.join(',')
      })

      return dispatch('fetchList', { params: state.fetchListParams }).then(() => { state.loading = false })
    },
    async search ({ state, dispatch, commit, rootGetters }, { to }) {
      let brandNos = []
      const brands = rootGetters['brand/flatBrands']
      const brand = brands.filter(item => item.brandNo === to.query.brandNo)[0]
      if (brand) {
        if (brand.brands) {
          brandNos = brand.brands.map(item => item.brandNo)
        } else {
          brandNos.push(brand.brandNo)
        }
      }
      let keyword = to.query.keyword
      if (!keyword) {
        return
      }

      commit('REMOVE_SEARCH_LOG', keyword)
      commit('ADD_SEARCH_LOG', keyword)

      let categoryNo = to.query.category2No || to.query.category1No || null
      commit('RESET_PARAMS')
      commit('SET_FILTER_DEFAULT')
      commit('SET_PARAMS', {
        'filter.keywords': keyword,
        'pageSize': 0,
        'hasTotalCount': false
      })
      // step1 카테고리부터 가져오고
      dispatch('fetchCategory', { params: state.fetchListParams })
      commit('RESET_PARAMS')
      commit('SET_PARAMS', {
        'order.by': to.query.sortBy ? to.query.sortBy.split(':')[0] : 'POPULAR',
        'order.direction': to.query.sortBy ? to.query.sortBy.split(':')[1] : 'DESC',
        'filter.keywords': keyword,
        'categoryNos': categoryNo,
        'pageSize': 20,
        'pageNumber': 1,
        'brandNos': brandNos.join(',')
      })

      // step 상품 정보를 가져온다
      window.NCPSearch.setSearchWordInfo(state.fetchListParams['filter.keywords'])
      await dispatch('resetAndFetchList', { params: state.fetchListParams })
      const clickUrlPrefix = state.clickUrlPrefix
      if (clickUrlPrefix) {
        window.NCPSearch.setSearchInfo({ clickUrlPrefix })
      }
    },

    changeParams ({ state, dispatch, commit, rootState }, payload) {
      // commit('CLEAR_LIST')
      payload.pageNumber = 1
      commit('SET_PARAMS', payload)
      return dispatch('resetAndFetchList', { params: state.fetchListParams })
    },

    setFilter ({ state, dispatch, commit, rootState }, label) {
      commit('SET_FILTER', label)
    },

    changeCategory ({ state, dispatch, commit, rootState }, categoryNo) {
      commit('CLEAR_LIST')

      if (categoryNo === 0) {
        commit('DELETE_CATEGORY')
      } else {
        commit('SET_PARAMS', {
          'categoryNos': categoryNo,
          'pageNumber': 1
        })
      }
      return dispatch('fetchList', { params: state.fetchListParams })
    },

    async fetchMore ({ state, dispatch, commit, rootState }, payload) {
      commit('SET_PARAMS', {
        pageNumber: state.fetchListParams.pageNumber + 1
      })
      await dispatch('fetchListMore', { params: state.fetchListParams })
    },
    async fetchPage ({ state, dispatch, commit, rootState }, page) {
      commit('CLEAR_LIST')
      commit('SET_PARAMS', {
        pageNumber: page
      })
      await dispatch('fetchList', { params: state.fetchListParams })
      if (state.list.length >= state.totalCount) {
        state.loading = false
      }
    },

    fetchMoreBest ({ state, dispatch, commit, rootState }, payload) {
      if (state.fetchListParams.pageNumber < 3) {
        commit('SET_PARAMS', {
          pageNumber: state.fetchListParams.pageNumber + 1,
          'filter.keywords': null
        })
        if (state.list && state.list.length >= state.totalCount) {
          state.loading = false
        }
        return dispatch('fetchList', { params: state.fetchListParams })
      }
      state.loading = false
      return Promise.resolve()
    },

    async fetchBestBySearch ({ state, dispatch, commit, rootState }) {
      const params = {
        'order.by': 'POPULAR',
        'order.direction': 'DESC',
        'pageSize': 15,
        'pageNumber': 1
      }
      return dispatch('fetchBestList', { params })
    },

    async fetchBestByHome ({ state, dispatch, commit, rootState }) {
      const params = {
        'order.by': 'POPULAR',
        'order.direction': 'DESC',
        'pageSize': 12,
        'pageNumber': 1
      }
      return dispatch('fetchBestList', { params })
    },

    setCurrentPageNo ({ state, dispatch, commit, rootState }, pageNo) {
      commit('SET_CUR_PAGE_NO', pageNo)
    }
  },
  mutations: {
    CLEAR_LIST (state) {
      state.list = null
      state.totalCount = 0
      state.loading = true
    },
    RESET_PARAMS (state) {
      state.fetchListParams = defaultParams
    },
    SET_PARAMS (state, params) {
      state.fetchListParams = {
        ...state.fetchListParams,
        ...params
      }
    },
    DELETE_CATEGORY (state) {
      delete state.fetchListParams.categoryNos
    },
    SET_FILTER (state, label) {
      state.filter.label = label
    },
    SET_FILTER_DEFAULT (state) {
      state.filter.label = '판매인기순'
    },
    ADD_SEARCH_LOG (state, keyword) {
      state.searchHistory.unshift(keyword)
      state.searchHistory = state.searchHistory.slice(0, 8)

      localStorage.setItem('search-history', JSON.stringify(state.searchHistory))
    },
    REMOVE_SEARCH_LOG (state, keyword) {
      const beforeIndex = state.searchHistory.indexOf(keyword)
      if (beforeIndex >= 0) {
        state.searchHistory.splice(beforeIndex, 1)
      }

      localStorage.setItem('search-history', JSON.stringify(state.searchHistory))
    },
    REMOVE_SEARCH_LOG_ALL (state) {
      state.searchHistory = []
      localStorage.setItem('search-history', JSON.stringify(state.searchHistory))
    },
    SET_CUR_PAGE_NO (state, pageNo) {
      state.currentPage = pageNo
    },
    RESET_CUR_PAGE_NO (state) {
      state.currentPage = 1
    }
  },
  getters: {
    depthCategorys (state, getters, rootState) {
      if (state.depth1Categories) {
        const checkCategory = state.fetchListParams.categoryNos
        const depthCategorys = state.depth1Categories.filter(categorie => categorie.count > 0)
        if (depthCategorys.length > 0 && state.depth2Categories && state.depth2Categories.length > 0) {
          depthCategorys.forEach(depth1 => {
            Vue.set(depth1, 'checked', depth1.categoryNo === checkCategory)
            depth1.depth2Cates = []
            state.depth2Categories.forEach(depth2 => {
              if (depth2.categoryNo === Number(rootState.route.query.categoryNo) || depth2.categoryNo === checkCategory) {
                depth1.checked = true
                depth2.checked = true
              }
              if (depth2.count > 0 && depth1.categoryNo === depth2.parentCategoryNo) {
                depth1.depth2Cates.push(depth2)
              }
            })
            depth1.noDepth = depth1.depth2Cates.length === 0
          })
        }
        return depthCategorys
      }
    }
  },
  mixins: [apiStore]
}
