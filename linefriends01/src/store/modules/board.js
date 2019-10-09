import Vue from 'vue'
import { createNcpApiStore } from '@/api'
import { isPC } from '@/utils/utils'
import config from '@/config'

const defaultParams = {
  'pageNumber': 1,
  'pageSize': isPC() ? 20 : 5,
  'hasTotalCount': true,
  'startYmd': null,
  'endYmd': null
}

const apiStore = createNcpApiStore([
  {
    action: '_faqCategory',
    property: 'faqCategorys',
    path: 'boards/{boardNo}/categories',
    pathParams: ['boardNo'],
    method: 'get'
  },
  {
    action: '_faqDetail',
    property: 'faqDatail',
    path: 'boards/{boardNo}/articles/{articleNo}',
    pathParams: ['boardNo', 'articleNo'],
    method: 'get'
  },
  {
    action: '_addBoard',
    path: 'boards/{boardNo}/articles',
    pathParams: ['boardNo'],
    method: 'post'
  },
  {
    action: '_featchFaqs',
    property: 'faqList',
    path: 'boards/{boardNo}/articles',
    pathParams: ['boardNo'],
    method: 'get',
    onSuccess (state, payload) {
      state.faqList = payload.data.items
      state.totalCount = payload.data.totalCount
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
  },
  {
    action: '_fetchList',
    property: 'articles',
    path: 'boards/{boardNo}/articles',
    pathParams: ['boardNo'],
    method: 'get',
    onSuccess (state, payload) {
      Vue.set(state.lists, state.boardNo, [...(state.lists ? (state.lists[state.boardNo] || []) : []), ...payload.data.items])
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
  },
  {
    action: '_fetchbbses',
    property: 'bbsList',
    path: 'boards/{boardNo}/articles',
    pathParams: ['boardNo'],
    method: 'get',
    onSuccess (state, payload) {
      state.bbsList = payload.data.items
      state.bbsCount = payload.data.totalCount
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
  },
  {
    action: '_bbsCategory',
    property: 'bbsCategorys',
    path: 'boards/{boardNo}/categories',
    pathParams: ['boardNo'],
    method: 'get'
  },
  {
    action: '_bbsDetail',
    property: 'bbsDatail',
    path: 'boards/{boardNo}/articles/{articleNo}',
    pathParams: ['boardNo', 'articleNo'],
    method: 'get'
  },
  {
    action: '_checkBBSEditable',
    path: 'boards/{boardNo}/articles/{articleNo}/editable',
    pathParams: ['boardNo', 'articleNo'],
    method: 'put',
    onSuccess (state, payload) {
      state.bbsEditAble = payload.status === 204
    }
  },
  {
    action: '_delete',
    path: 'boards/{boardNo}/articles/{articleNo}',
    pathParams: ['boardNo', 'articleNo'],
    delData: 'data',
    method: 'delete'
  },
  {
    action: '_edit',
    path: 'boards/{boardNo}/articles/{articleNo}',
    pathParams: ['boardNo', 'articleNo'],
    method: 'put'
  },
  {
    action: 'bbsBanner',
    property: 'bbsBanners',
    path: `display/banners/${config.bbsBanner}`
  }
])

export default {
  namespaced: true,
  state: {
    lists: {},
    fetchListParams: {},
    totalCount: [],
    loading: [],
    boardNo: null,
    bbsCount: 0,
    bbsPageSize: isPC() ? 20 : 5,
    bbsList: [],
    bbsEditAble: false,
    bbsCategorys: [],
    bbsDatail: null
  },
  mixins: [apiStore],
  actions: {
    setBoard ({ state }, boardName) {
      state.boardNo = config.boardNo[boardName]
    },
    async fetchList ({ state, commit, dispatch }, params) {
      commit('RESET_LIST')
      commit('SET_PARAMS', {
        'boardNo': state.boardNo,
        'keyword': params.keyword
      })
      if (params.categoryNo) {
        commit('SET_PARAMS', {
          'categoryNo': params.categoryNo
        })
      }
      await dispatch('_fetchList', { params: state.fetchListParams })
    },
    async faqCategorys ({ state, commit, dispatch }) {
      if (state.faqCategorys) {
        return
      }
      return dispatch('_faqCategory', { params: { boardNo: config.faqBoardNo } })
    },
    async faqDetail ({ state, commit, dispatch }, articleNo) {
      return dispatch('_faqDetail', { params: { boardNo: config.faqBoardNo, articleNo: articleNo } })
    },
    addBoard ({ state, commit, dispatch }, data) {
      return dispatch('_addBoard', { data: data.paramsConnect, params: { boardNo: config.boardNo } })
    },
    async featchFaq ({ state, commit, dispatch }, params) {
      commit('RESET_LIST')
      commit('SET_PARAMS', {
        'boardNo': config.faqBoardNo,
        'keyword': params.keyword
      })
      if (params.categoryNo) {
        commit('SET_PARAMS', {
          'categoryNo': params.categoryNo
        })
      }
      state.faqList = null
      await dispatch('_featchFaqs', { params: state.fetchListParams })
    },
    async featchFaqMore ({ state, dispatch, commit, rootState }, payload) {
      commit('SET_PARAMS', {
        // pageNumber: state.fetchListParams.pageNumber + 1
        pageNumber: payload
      })
      state.faqList = null
      await dispatch('_featchFaqs', { params: state.fetchListParams })
      if (state.faqList.length >= state.totalCount) {
        state.loading = false
      }
    },
    async bbsCategorys ({ state, dispatch }) {
      return dispatch('_bbsCategory', { params: { boardNo: config.noticeBoardNo } })
    },
    async featchBBS ({ dispatch, state, commit }, pageNumber) {
      let params = {
        boardNo: config.noticeBoardNo,
        hasTotalCount: true,
        pageSize: state.bbsPageSize,
        pageNumber,
        startYmd: '2019-01-01',
        endYmd: '2999-12-31'
      }
      dispatch('bbsBanner')
      await dispatch('_fetchbbses', { params })
    },
    commitBBS ({ dispatch, state }, data) {
      if (data.articleNo) {
        return dispatch('_edit', { data, params: { boardNo: config.noticeBoardNo, articleNo: data.articleNo } })
      } else {
        return dispatch('_addBoard', { data, params: { boardNo: config.noticeBoardNo } })
      }
    },
    async fetchBBSDetail ({ dispatch, commit }, articleNo) {
      commit('RESET_BBS')
      await dispatch('_bbsDetail', { params: { boardNo: config.noticeBoardNo, articleNo: articleNo } })
      // dispatch('_checkBBSEditable', { params: { boardNo: config.noticeBoardNo, articleNo: articleNo } })
    },
    bbsDelete ({ dispatch }, articleNo) {
      return dispatch('_delete', { params: { boardNo: config.noticeBoardNo, articleNo: articleNo, data: { password: 'password' } } })
    }
  },
  mutations: {
    RESET_LIST (state) {
      state.faqList = null
      state.totalCount = null
      state.loading = true
      state.fetchListParams = defaultParams
    },
    SET_PARAMS (state, params) {
      state.fetchListParams = {
        ...state.fetchListParams,
        ...params
      }
    },
    RESET_BBS (state) {
      state.bbsEditAble = false
      state.bbsDatail = null
    }
  },
  getters: {
    list (state) {
      return state.lists[state.boardNo]
    },
    loading (state) {
      return state.loading[state.boardNo]
    },
    totalCount (state) {
      return state.totalCount ? state.totalCount[state.boardNo] : state.totalCount
    },
    _bbsBanners (state) {
      return state.bbsBanners && state.bbsBanners[0] && state.bbsBanners[0].accounts[0].banners
    }
  }
}
