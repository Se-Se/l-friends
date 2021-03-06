import { createNcpApiStore } from '@/api'
import qs from 'qs'

const defaultParams = {
  'hasTotalCount': true,
  'filter.soldout': true,
  'filter.saleStatus': 'RESERVATION_AND_ONSALE',
  'pageNumber': 1,
  'pageSize': 20,
  'order.by': 'RECENT_PRODUCT',
  'order.direction': 'DESC'
}

const apiStore = createNcpApiStore([
  {
    action: '_fetchList',
    property: 'list',
    path: 'products/search',
    method: 'get',
    requestConfig: {
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
    },
    onSuccess (state, payload) {
      state.list = [...state.list || [], ...payload.data.items]
      state.totalCount = payload.data.totalCount
    }
  }
])

export default {
  namespaced: true,
  mixins: [apiStore],
  state: {
    fetchListParams: {},
    list: null,
    totalCount: null,
    getNew: false,
    defaultKeyword: null,
    moLocalKeywordArr: []
  },
  actions: {
    async initFetchList ({ state, commit, dispatch }, { to }) {
      commit('RESET_PARAMS')
      let categoryNo = to.params.subCategoryNo || to.params.categoryNo || null
      let tempParams = {}
      if (categoryNo) {
        tempParams.categoryNos = categoryNo
      }
      if (to && to.query) {
        let param = to.query
        if (param.sale) {
          tempParams.onlySaleProduct = true
        }

        if (param.brandNos) {
          let brandNos = param.brandNos.split(',')
          tempParams.brandNos = brandNos
        }

        if (param.by && param.direction) {
          tempParams['order.by'] = param.by
          tempParams['order.direction'] = param.direction
        } else {
          tempParams['order.by'] = 'RECENT_PRODUCT'
          tempParams['order.direction'] = 'DESC'
        }

        if (param.keyword) {
          tempParams['filter.keywords'] = param.keyword

          state.defaultKeyword = param.keyword

          // 최근 검색어 보존
          let keywordArr = JSON.parse(window.localStorage.RecentSearchWord || '[]')
          if (!keywordArr) { keywordArr = [] }
          keywordArr.unshift(param.keyword)
          let set = new Set(keywordArr)
          keywordArr = Array.from(set)
          if (keywordArr.length > 10) {
            keywordArr.pop()
          }
          window.localStorage.RecentSearchWord = JSON.stringify(keywordArr)
        }
      }
      commit('SET_PARAMS', tempParams)

      let isShowBk = false
      let oldParams = null
      oldParams = history.state && history.state.listState && history.state.listState.params
      if (oldParams) {
        isShowBk = true
      }
      if (!isShowBk || state.getNew) {
        commit('CLEAR_LIST')
        await dispatch('fetchList')
      } else {
        state.list = history.state.listState.list
        state.totalCount = history.state.listState.totalCount
        state.fetchListParams = history.state.listState.params
      }
      state.getNew = false
    },

    async fetchMore ({ state, dispatch, commit }) {
      commit('SET_PARAMS', {
        pageNumber: state.fetchListParams.pageNumber + 1
      })
      await dispatch('fetchList')
    },

    async fetchList ({ state, dispatch }) {
      await dispatch('_fetchList', { params: state.fetchListParams })
      let tempState = JSON.parse(JSON.stringify(history.state))
      let listState = {
        params: state.fetchListParams,
        list: state.list,
        totalCount: state.totalCount
      }
      tempState.listState = listState
      history.replaceState(tempState, null, document.URL)
    },
    async getList ({ commit, state, dispatch }, params) {
      commit('CLEAR_LIST')
      await dispatch('_fetchList', { params })
      return {
        list: state.list,
        totalCount: state.totalCount
      }
    },
    setDefaultKeyword ({ state }, keyword) {
      state.defaultKeyword = keyword
    },
    fetchLocalKeyword ({ state }) {
      let arr = JSON.parse(window.localStorage.RecentSearchWord || '[]')
      if (arr && arr.length > 0) {
        state.moLocalKeywordArr = arr
      } else {
        state.moLocalKeywordArr = null
      }
    }
  },
  mutations: {
    GET_NEW (state) {
      state.getNew = true
    },
    CLEAR_LIST (state) {
      state.list = null
      state.totalCount = null
    },
    RESET_PARAMS (state) {
      state.fetchListParams = defaultParams
      state.defaultKeyword = null
    },
    SET_PARAMS (state, params) {
      state.fetchListParams = {
        ...state.fetchListParams,
        ...params
      }
    }
  }
}
