import { createNcpApiStore } from '@/api'
import Vue from 'vue'

const defaultParams = {
  'pageNumber': 1,
  'pageSize': 20,
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
    action: '_featchFaqs',
    property: 'faqList',
    path: 'boards/{boardNo}/articles',
    pathParams: ['boardNo'],
    method: 'get',
    onSuccess (state, payload) {
      state.faqList = payload.data.items
      state.totalCount = payload.data.totalCount
    }
  },
  {
    action: '_faqDetail',
    property: 'faqDatail',
    path: 'boards/{boardNo}/articles/{articleNo}',
    pathParams: ['boardNo', 'articleNo'],
    method: 'get'
  },
  {
    action: '_fetchList',
    property: 'articles',
    path: 'boards/{boardNo}/articles',
    pathParams: ['boardNo'],
    method: 'get',
    onSuccess (state, payload) {
      Vue.set(state.lists, state.boardNo, [...(state.lists ? (state.lists[state.boardNo] || []) : []), ...payload.data.items])
    }
  },
  {
    action: '_fetchMainNotice',
    property: 'mainNotice',
    path: `boards/${process.env.VUE_APP_NOTICE_BOARDNO}/articles`
  },
  {
    action: '_fetchbbses',
    property: 'bbsList',
    path: `boards/${process.env.VUE_APP_NOTICE_BOARDNO}/articles`,
    pathParams: ['boardNo'],
    method: 'get',
    onSuccess (state, payload) {
      state.bbsList = payload.data.items
      state.bbsCount = payload.data.totalCount
    }
  },
  {
    action: '_bbsDetail',
    property: 'bbsDatail',
    path: `boards/${process.env.VUE_APP_NOTICE_BOARDNO}/articles/{articleNo}`,
    pathParams: ['boardNo', 'articleNo'],
    method: 'get'
  },
  {
    action: '_bbsCategory',
    property: 'bbsCategorys',
    path: 'boards/{boardNo}/categories',
    pathParams: ['boardNo'],
    method: 'get'
  }
])

export default {
  namespaced: true,
  mixins: [apiStore],
  state: {
    faqList: [],
    lists: {},
    fetchListParams: {},
    totalCount: [],
    loading: [],
    boardNo: process.env.VUE_APP_HEADER_NOTICE,
    bbsPageSize: 20,
    bbsCount: 0
  },
  actions: {
    async faqCategorys ({ state, commit, dispatch }) {
      if (state.faqCategorys) {
        return
      }
      return dispatch('_faqCategory', { params: { boardNo: process.env.VUE_APP_FAQ_BOARDNO } })
    },
    async featchFaq ({ state, commit, dispatch }, params) {
      commit('RESET_LIST')
      commit('SET_PARAMS', {
        'boardNo': process.env.VUE_APP_FAQ_BOARDNO,
        'keyword': params.keyword
      })
      if (params.categoryNo) {
        commit('SET_PARAMS', {
          'categoryNo': params.categoryNo
        })
      }
      await dispatch('_featchFaqs', { params: state.fetchListParams })
    },
    async faqDetail ({ state, commit, dispatch }, articleNo) {
      return dispatch('_faqDetail', { params: { boardNo: process.env.VUE_APP_FAQ_BOARDNO, articleNo: articleNo } })
    },
    async featchFaqMore ({ state, dispatch, commit, rootState }, payload) {
      commit('SET_PARAMS', {
        pageNumber: payload
      })
      await dispatch('_featchFaqs', { params: state.fetchListParams })
      if (state.faqList.length >= state.totalCount) {
        state.loading = false
      }
    },
    async fetchList ({ state, dispatch, commit }) {
      commit('RESET_LIST')
      commit('SET_PARAMS', {
        'boardNo': state.boardNo
      })
      await dispatch('_fetchList', { params: state.fetchListParams })
    },
    async fetchMainNotice ({ state, dispatch }) {
      if (!state.mainNotice) {
        await dispatch('_fetchMainNotice')
      }
    },
    async featchBBS ({ dispatch, state, commit }, pageNumber) {
      let params = {
        boardNo: process.env.VUE_APP_NOTICE_BOARDNO,
        hasTotalCount: true,
        pageSize: state.bbsPageSize,
        pageNumber: typeof (pageNumber) === 'number' ? pageNumber : 1,
        startYmd: '2019-01-01',
        endYmd: '2999-12-31'
      }
      await dispatch('_fetchbbses', { params })
    },
    async bbsCategorys ({ state, dispatch }) {
      return dispatch('_bbsCategory', { params: { boardNo: process.env.VUE_APP_NOTICE_BOARDNO } })
    },
    async fetchBBSDetail ({ dispatch, commit }, { to }) {
      commit('RESET_BBS')
      await dispatch('_bbsDetail', { params: { boardNo: process.env.VUE_APP_NOTICE_BOARDNO, articleNo: to.params.articleNo } })
    }
  },
  mutations: {
    RESET_LIST (state) {
      // state.faqList = null
      // state.totalCount = null
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
    mainNotice (state) {
      return state.mainNotice && state.mainNotice.items
    }
  }
}
