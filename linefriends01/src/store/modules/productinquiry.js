import { createNcpApiStore } from '@/api'
import cookies from 'js-cookie'
import { isPC } from '@/utils/utils'
import { getStrYMDHM } from '@/utils/dateUtils'
import { maskingMemberId } from '@/utils/StringUtils'
import Vue from 'vue'

const defaultParams = {
  'productNo': null,
  'pageNumber': 1,
  'pageSize': isPC() ? 20 : 5,
  'isMyInquiries': false,
  'hasTotalCount': true,
  'startYmd': null,
  'endYmd': null
}

const defaultMemberParams = {
  'productNo': null,
  'pageNumber': 1,
  'pageSize': isPC() ? 20 : 5,
  'isMyInquiries': true,
  'hasTotalCount': true,
  'startYmd': null,
  'endYmd': null
}

const defaultMyInquiryParams = {
  'pageNumber': 1,
  'pageSize': isPC() ? 20 : 5,
  'hasTotalCount': true,
  'startYmd': null,
  'endYmd': null
}

const apiStore = createNcpApiStore([
  {
    action: '_fetchProductInquiry',
    property: 'inquiryList',
    path: 'products/{productNo}/inquiries',
    pathParams: ['productNo'],
    method: 'get',
    queryParams: true,
    onSuccess (state, payload) {
      state.inquiryList = {}
      Vue.set(state.inquiryList, 'item', payload.data.items)
      Vue.set(state.inquiryList, 'totalCount', payload.data.totalCount)
    },
    onError () {
      // debugger
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
  },
  {
    action: '_fetchProductInquiryDetail',
    property: 'inquiry',
    path: 'products/{productNo}/inquiries/{inquiryNo}',
    pathParams: ['productNo', 'inquiryNo'],
    method: 'get',
    queryParams: true
  },
  {
    action: '_fetchMemberInquiry',
    property: 'memberInquiry',
    path: 'products/{productNo}/inquiries',
    pathParams: ['productNo'],
    method: 'get',
    queryParams: true,
    onSuccess (state, payload) {
      state.memberInquiry = [...state.memberInquiry || [], ...payload.data.items]
      state.memberTotalCount = payload.data.totalCount
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
  },
  {
    action: '_postProductInquiry',
    path: 'products/{productNo}/inquiries',
    pathParams: ['productNo'],
    method: 'post'
  },
  {
    action: '_putProductInquiry',
    path: 'products/inquiries/{inquiryNo}',
    pathParams: ['inquiryNo'],
    method: 'put'
  },
  {
    action: '_deleteProductInquiry',
    path: 'products/inquiries/{inquiryNo}',
    pathParams: ['inquiryNo'],
    method: 'delete'
  },
  {
    action: '_fetchProductInquiries',
    property: 'productInquiries',
    path: 'profile/product-inquiries',
    method: 'get',
    onSuccess (state, payload) {
      state.productInquiries = [...state.productInquiries || [], ...payload.data.items]
      state.totalCount = payload.data.totalCount
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
  }
])

export default {
  namespaced: true,
  state: {
    fetchListParams: {},
    fetchMemberListParams: {},
    totalCount: null,
    memberTotalCount: null,
    loading: true,
    memberLoading: true,
    inquiry: null
  },
  actions: {
    async fetchProductInquiry ({ state, dispatch, commit, rootState }, payload) {
      commit('RESET_LIST')
      commit('SET_PARAMS', {
        productNo: payload.productNo,
        pageNumber: payload.pageNo
      })
      await dispatch('_fetchProductInquiry', { params: state.fetchListParams })
      await commit('FORMAT_INQUIRY_DATAS', state.inquiryList)
    },
    async fetchProductInquiryDetail ({ state, dispatch, commit, rootState }, { productNo, inquiryNo }) {
      await dispatch('_fetchProductInquiryDetail', {
        params: { productNo, inquiryNo }
      })
    },
    async postProductInquiry ({ state, dispatch, commit }, inquiry) {
      await dispatch('_postProductInquiry', { data: inquiry, params: { productNo: inquiry.productNo } })
      await dispatch('fetchProductInquiry', {
        productNo: inquiry.productNo,
        pageNo: inquiry.pageNo
      })
    },
    async putProductInquiry ({ state, dispatch, commit, rootState }, updateparams) {
      await dispatch('_putProductInquiry', { data: updateparams, params: { inquiryNo: updateparams.inquiryNo } })
      await dispatch('fetchProductInquiry', {
        productNo: updateparams.productNo,
        pageNo: updateparams.pageNo
      })
    },
    async deleteProductInquiry ({ state, dispatch, commit, rootState }, deleteparams) {
      await dispatch('_deleteProductInquiry', { data: deleteparams, params: { inquiryNo: deleteparams.inquiryNo } })
      await dispatch('fetchProductInquiry', {
        productNo: deleteparams.productNo,
        pageNo: deleteparams.pageNo
      })
    },
    async fetchProductInquiries ({ state, dispatch, commit, rootState }, params) {
      commit('MY_INQUIRY_RESET_LIST')
      commit('MY_INQUIRY_SET_PARAMS', params)
      await dispatch('_fetchProductInquiries', { params: state.fetchListParams })
      await commit('FORMAT_INQUIRY_DATAS', state.productInquiries)
    },
    async putMyProductInquiry ({ state, dispatch, commit, rootState }, updateparams) {
      await dispatch('_putProductInquiry', { data: updateparams, params: { inquiryNo: updateparams.inquiryNo } })
      await dispatch('fetchProductInquiries')
    },
    async deleteMyProductInquiry ({ state, dispatch, commit, rootState }, deleteparams) {
      await dispatch('_deleteProductInquiry', { data: deleteparams, params: { inquiryNo: deleteparams.inquiryNo } })
      await dispatch('fetchProductInquiries')
    },

    async fetchMore ({ state, dispatch, commit, rootState }) {
      commit('SET_PARAMS', {
        pageNumber: state.fetchListParams.pageNumber + 1
      })
      await dispatch('_fetchProductInquiries', { params: state.fetchListParams })
      if (state.productInquiries.length >= state.totalCount) {
        state.loading = false
      }
    }
  },
  mutations: {
    RESET_LIST (state) {
      // state.inquiryList = null
      state.totalCount = null
      state.loading = true
      state.fetchListParams = defaultParams
    },
    RESET_DETAIL (state) {
      state.inquiry = null
    },
    SET_PARAMS (state, params) {
      state.fetchListParams = {
        ...state.fetchListParams,
        ...params
      }
    },
    RESET_MEMBER_LIST (state) {
      state.memberInquiry = null
      state.memberTotalCount = null
      state.memberLoading = true
      state.fetchMemberListParams = defaultMemberParams
    },
    SET_MEMBER_PARAMS (state, params) {
      state.fetchMemberListParams = {
        ...state.fetchMemberListParams,
        ...params
      }
    },
    MY_INQUIRY_RESET_LIST (state) {
      state.productInquiries = null
      state.totalCount = null
      state.loading = true
      state.fetchListParams = defaultMyInquiryParams
    },
    MY_INQUIRY_SET_PARAMS (state, params) {
      state.fetchListParams = {
        ...state.fetchListParams,
        ...params
      }
    },
    FORMAT_INQUIRY_DATAS (state, inquirys) {
      if (!inquirys || inquirys.length === 0 || inquirys.item === null) {
        return
      }
      inquirys.item && inquirys.item.forEach(item => {
        if (item.memberId === cookies.get('ncpMemberId')) {
          item.selfFlg = true
        } else {
          item.selfFlg = false
        }
        item.showContent = item.content.replace(/\n/g, '<br/>')
        item.showDate = getStrYMDHM(new Date(item.registerYmdt), '.')
        Vue.set(item, 'showMemberId', maskingMemberId(item.memberId))
        if (item.answers) {
          item.answers.forEach(answer => {
            answer.showAnswersYmdt = getStrYMDHM(new Date(answer.updateYmdt), '.')
          })
        }
      })
    }
  },
  mixins: [apiStore]
}
