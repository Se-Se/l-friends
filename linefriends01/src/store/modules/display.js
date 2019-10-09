import Vue from 'vue'
import router from '@/router'
import { createNcpApiStore } from '@/api'

const apiStore = createNcpApiStore([
  {
    action: '_fetchGoodsSection',
    property: 'section',
    path: 'display/sections/{sectionNo}',
    pathParams: ['sectionNo'],
    method: 'get'
  },
  {
    action: '_fetchGoodsEvent',
    property: 'event',
    path: 'display/events/{eventNo}',
    pathParams: ['eventNo'],
    method: 'get'
  },
  {
    action: '_fetchGoodsBest',
    property: 'best',
    path: 'products/main-best-products',
    method: 'get'
  }
])

export default {
  namespaced: true,
  mixins: [apiStore],
  state: {
    sections: {},
    sectionInfos: {},
    events: {},
    boardDetails: [],
    sectionNo: null
  },
  actions: {
    async fetchGoodsSection ({ state, dispatch }, sectionNo) {
      await dispatch('_fetchGoodsSection', {
        params: {
          sectionNo,
          by: 'ADMIN_SETTING',
          direction: 'ASC',
          'saleStatus': 'RESERVATION_AND_ONSALE',
          soldout: router.currentRoute.name !== 'MainHome'
        }
      })

      Vue.set(state.sections, sectionNo, state.section[0].products)
      Vue.set(state.sectionInfos, sectionNo, state.section[0])
    },
    async fetchGoodsEvent ({ state, dispatch }, eventNo) {
      await dispatch('_fetchGoodsEvent', {
        params: {
          eventNo,
          by: 'ADMIN_SETTING',
          direction: 'ASC',
          'saleStatus': 'RESERVATION_AND_ONSALE',
          soldout: router.currentRoute.name !== 'MainHome'
        }
      })

      Vue.set(state.events, eventNo, state.event.section)
    },
    async fetchGoodsBest ({ dispatch }) {
      await dispatch('_fetchGoodsBest', {
        params: {
          soldout: router.currentRoute.name !== 'MainHome'
        }
      })
    }
  },
  getters: {
    sections (state) {
      return state.sections
    },
    events (state) {
      return state.events
    }
  }
}
