import { createNcpApiStore } from '@/api'
import { containsNow } from '@/utils/dateUtils'
import qs from 'qs'

const apiStore = createNcpApiStore([
  {
    action: '_fetchRecentGoods',
    property: 'recentGoods',
    path: 'guest/recent-products',
    method: 'get',
    requestConfig: {
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
    }
  }
])

export default {
  namespaced: true,
  mixins: [apiStore],
  state: {
    recentGoods: []
  },
  actions: {
    async addRecent ({ dispatch }, { productNo }) {
      let productNos = JSON.parse(window.localStorage.recentGoods || '[]')
      productNos = productNos.filter(item => productNo !== item)
      productNos.unshift(productNo)
      window.localStorage.recentGoods = JSON.stringify(productNos)
      await dispatch('fetchRecentGoods')
    },
    async fetchRecentGoods ({ state, dispatch }) {
      state.recentGoods = []
      let mallProductNos = JSON.parse(window.localStorage.recentGoods || '[]')
      if (mallProductNos.length) {
        await dispatch('_fetchRecentGoods', { params: { mallProductNos, soldout: false } })
        state.recentGoods = state.recentGoods.filter(product => {
          return (
            product.reservationData &&
            containsNow(product.reservationData.reservationStartYmdt, product.reservationData.reservationEndYmdt)
          ) || containsNow(product.saleStartYmdt, product.saleEndYmdt)
        })
        state.recentGoods = state.recentGoods.filter((product, idx) => idx < 30)
        let resNos = state.recentGoods.map(product => product.productNo.toString())
        window.localStorage.recentGoods = JSON.stringify(resNos)
      }
    }
  },
  getters: {
    count (state) {
      return state.recentGoods.length
    }
  }
}
