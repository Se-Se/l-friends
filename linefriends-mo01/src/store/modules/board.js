import { createNcpApiStore } from '@/api'

const defaultParams = {
  'pageNumber': 1,
  'pageSize': 5,
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
    action: '_featchMoreFaqs',
    property: 'faqList',
    path: 'boards/{boardNo}/articles',
    pathParams: ['boardNo'],
    method: 'get',
    onSuccess (state, payload) {
      state.faqList = [...state.faqList || [], ...payload.data.items]
      state.totalCount = payload.data.totalCount
    }
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
    action: '_bbsCategory',
    property: 'bbsCategorys',
    path: 'boards/{boardNo}/categories',
    pathParams: ['boardNo'],
    method: 'get'
  },
  {
    action: '_fetchbbses',
    property: 'bbsList',
    path: 'boards/{boardNo}/articles',
    pathParams: ['boardNo'],
    method: 'get',
    onSuccess (state, payload) {
      state.bbsList = [...state.bbsList || [], ...payload.data.items]
      state.bbsCount = payload.data.totalCount
    }
  },
  {
    action: '_bbsDetail',
    property: 'bbsDatail',
    path: 'boards/{boardNo}/articles/{articleNo}',
    pathParams: ['boardNo', 'articleNo'],
    method: 'get'
  },
  {
    action: '_fetchMainNotice',
    property: 'mainNotice',
    path: `boards/${process.env.VUE_APP_NOTICE_BOARDNO}/articles`
  }
])

export default {
  namespaced: true,
  state: {
    faqList: null,
    totalCount: 0,
    bbsCount: null,
    bbsList: null
  },
  mixins: [apiStore],
  actions: {
    async faqCategorys ({ state, commit, dispatch }) {
      if (state.faqCategorys) {
        return
      }
      return dispatch('_faqCategory', { params: { boardNo: process.env.VUE_APP_FAQ_BOARDNO } })
    },
    async featchFaq ({ state, commit, dispatch }, params) {
      commit('RESET_FAQ_LIST')
      commit('SET_FAQ_PARAMS', {
        'boardNo': process.env.VUE_APP_FAQ_BOARDNO,
        'keyword': params.keyword
      })
      if (params.categoryNo) {
        commit('SET_FAQ_PARAMS', {
          'categoryNo': params.categoryNo
        })
      }
      await dispatch('_featchFaqs', { params: state.fetchFaqListParams })
    },
    async faqDetail ({ state, commit, dispatch }, articleNo) {
      return dispatch('_faqDetail', { params: { boardNo: process.env.VUE_APP_FAQ_BOARDNO, articleNo: articleNo } })
    },
    async featchFaqMore ({ state, dispatch, commit, rootState }) {
      commit('SET_FAQ_PARAMS', {
        pageNumber: state.fetchFaqListParams.pageNumber + 1
      })
      await dispatch('_featchMoreFaqs', { params: state.fetchFaqListParams })
    },
    async bbsCategorys ({ state, dispatch }) {
      return dispatch('_bbsCategory', { params: { boardNo: process.env.VUE_APP_NOTICE_BOARDNO } })
    },
    async featchBBS ({ dispatch, state, commit }) {
      commit('RESET_BBS_LIST')
      commit('SET_BBS_PARAMS', {
        boardNo: process.env.VUE_APP_NOTICE_BOARDNO
      })
      await dispatch('_fetchbbses', { params: state.fetchBbsListParams })
    },
    async featchBBSMore ({ dispatch, state, commit }) {
      commit('SET_BBS_PARAMS', {
        pageNumber: state.fetchBbsListParams.pageNumber + 1
      })
      await dispatch('_fetchbbses', { params: state.fetchBbsListParams })
    },
    async fetchBBSDetail ({ dispatch, commit }, { to }) {
      commit('RESET_BBSDetail')
      await dispatch('_bbsDetail', { params: { boardNo: process.env.VUE_APP_NOTICE_BOARDNO, articleNo: to.params.articleNo } })
    },
    async fetchMainNotice ({ state, dispatch }) {
      if (!state.mainNotice) {
        await dispatch('_fetchMainNotice')
      }
    }
  },
  mutations: {
    RESET_FAQ_LIST (state) {
      state.fetchFaqListParams = defaultParams
    },
    SET_FAQ_PARAMS (state, params) {
      state.fetchFaqListParams = {
        ...state.fetchFaqListParams,
        ...params
      }
    },
    RESET_BBS_LIST (state) {
      state.bbsDatail = null
      state.bbsCount = null
      state.bbsList = null
      state.fetchBbsListParams = defaultParams
    },
    SET_BBS_PARAMS (state, params) {
      state.fetchBbsListParams = {
        ...state.fetchBbsListParams,
        ...params
      }
    },
    RESET_BBSDetail (state) {
      state.bbsEditAble = false
      state.bbsDatail = null
    }
  },
  getters: {
    mainNotice (state) {
      return state.mainNotice && state.mainNotice.items
    }
  }
}
