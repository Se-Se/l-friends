import { createNcpApiStore } from '@/api'

const apiStore = createNcpApiStore([
  {
    action: 'fetchList',
    property: 'list',
    path: 'recommend-products',
    method: 'get',
    queryParams: true,
    onSuccess (state, payload) {
      state.list = payload.data.map(item => ({
        ...item,
        productNo: item.productNo,
        listImageUrls: [item.imageUrls[0]],
        imageUrls: [item.imageUrls[0]]
      }))
      state.totalCount = payload.data.length
    },
    cacheable: false
  }
])

export default {
  namespaced: true,
  state: {
    list: [],
    totalCount: 0,
    loading: true
  },
  actions: {
    async fetchByProductNo ({ state, dispatch, commit, rootState }, mallProductNo) {
      return dispatch('fetchList', {
        params: {
          mallProductNo
        }
      }).then(() => { state.loading = false })
    }
  },
  mutations: {
    CLEAR_LIST (state) {
      state.list = null
      state.totalCount = 0
      state.loading = true
    }
  },
  mixins: [apiStore]
}
