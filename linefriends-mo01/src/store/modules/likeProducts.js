import { createNcpApiStore } from '@/api'
import { getDateFormatYMDHM } from '@/utils/dateUtils'
import { isLogin } from '@/utils/utils'

const defaultParams = {
  pageNumber: 1,
  pageSize: 6,
  hasTotalCount: true
}

const apiStore = createNcpApiStore([
  {
    action: '_fetchLikeProducts',
    property: 'likeProducts',
    path: 'profile/like-products',
    method: 'get',
    queryParams: true,
    onSuccess (state, payload) {
      payload.data.items.forEach((element) => {
        element.saleStartYmdt = getDateFormatYMDHM(element.saleStartYmdt)
      })
      state.likeProducts = [...(state.likeProducts || []), ...payload.data.items]
      state.likeProducts.totalCount = payload.data.totalCount
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
  },
  {
    action: '_postLikeProducts',
    property: 'result',
    path: 'profile/like-products',
    method: 'post'
  }
])

export default {
  namespaced: true,
  state: {
    fetchListParams: {},
    loading: true
  },
  mixins: [apiStore],
  actions: {
    async fetchLikeProducts ({ state, dispatch, commit }, payload) {
      if (isLogin()) {
        commit('RESET_LIST')
        commit('SET_PARAMS', payload.params)
        await dispatch('_fetchLikeProducts', { params: state.fetchListParams })
      }
    },
    async postLikeProducts ({ state, dispatch, commit, rootGetters }, productNos) {
      await dispatch('_postLikeProducts', { data: { productNos } })
    },
    async pageLikeProducts ({ state, dispatch, commit, rootGetters }, productNos) {
      await dispatch('_postLikeProducts', { data: { productNos } })
      commit('RESET_LIST')
      commit('SET_PARAMS')
      await dispatch('_fetchLikeProducts', { params: state.fetchListParams })
    },
    async getLikeProductsMore ({ state, dispatch, commit, rootState }, payload) {
      commit('SET_PARAMS', {
        ...payload,
        pageNumber: state.fetchListParams.pageNumber + 1
      })
      await dispatch('_fetchLikeProducts', { params: state.fetchListParams }).then(() => {
        if (state.likeProducts.length >= state.likeProducts.totalCount) {
          state.loading = false
        }
      })
    }
  },
  getters: {
    likeProductNos (state) {
      if (state.likeProducts && state.likeProducts.items) {
        return state.likeProducts.items.map((item) => item.productNo)
      }
      return []
    }
  },
  mutations: {
    SET_PARAMS (state, params) {
      state.fetchListParams = {
        ...state.fetchListParams,
        ...params
      }
    },
    RESET_LIST (state) {
      state.likeProducts = null
      state.totalCount = 0
      state.loading = true
      state.fetchListParams = defaultParams
    }
  }
}
