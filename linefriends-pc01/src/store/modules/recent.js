import { createNcpApiStore } from '@/api'
import qs from 'qs'
import { containsNow } from '@/utils/dateUtils'

const apiStore = createNcpApiStore([
  {
    action: '_fetchRecentProducts',
    property: 'recentProducts',
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
    recentProducts: []
  },
  actions: {
    addRecent ({ dispatch }, { productNo }) {
      let productNos = JSON.parse(window.localStorage.recentNos || '[]')
      productNos = productNos.filter(item => productNo !== item)
      productNos.unshift(productNo)
      window.localStorage.recentNos = JSON.stringify(productNos)
      // setCookie('recentNos', JSON.stringify(productNos), 365 * 24 * 60 * 60)
    },
    async fetchRecentProducts ({ state, dispatch }) {
      let mallProductNos = JSON.parse(window.localStorage.recentNos || '[]')
      if (mallProductNos.length) {
        state.recentProducts = []
        await dispatch('_fetchRecentProducts', { params: { mallProductNos, soldout: false } })
        state.recentProducts = state.recentProducts.filter(product => {
          return (
            product.reservationData &&
            containsNow(product.reservationData.reservationStartYmdt, product.reservationData.reservationEndYmdt)
          ) || containsNow(product.saleStartYmdt, product.saleEndYmdt)
        }).slice(0, 30)
        let recentNos = state.recentProducts.map(product => product.productNo.toString())
        window.localStorage.recentNos = JSON.stringify(recentNos)
        // setCookie('recentNos', JSON.stringify(recentNos), 365 * 24 * 60 * 60)
      }
    }
  },
  getters: {
    count (state) {
      return state.recentProducts.length
    }
  }
}
