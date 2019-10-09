import { createNcpApiStore } from '@/api'
import router from '@/router'
import Vue from 'vue'

const apiStore = createNcpApiStore([
  {
    action: 'fetch',
    property: 'event',
    path: 'display/events/{eventNo}?saleStatus=RESERVATION_AND_ONSALE&order=ADMIN_SETTING',
    pathParams: ['eventNo']
  },
  {
    action: 'fetchOtherEvent',
    property: 'otherEvent',
    path: 'display/events'
  }
])

export default {
  namespaced: true,
  mixins: [apiStore],
  state: {
    showTimerSpan: false
  },
  actions: {
    async fetchEventDetail ({ state, commit, dispatch }, { eventNo, isMain }) {
      await dispatch('fetch', { params: { eventNo, soldout: isMain } }).catch(e => {
        if (e.data.code === 'A0006') {
          if (history && history.length > 1) {
            history.go(-1)
          } else {
            router.replace('/')
          }
        }
      })

      await commit('FORMAT_DATAS')
    }
  },
  getters: {},
  mutations: {
    FORMAT_DATAS (state) {
      if (state.event) {
        const sectionMenu = []
        if (state.event.section && state.event.section.length > 0) {
          state.event.section.forEach((item) => {
            if (item.products && item.products.length > 0) {
              sectionMenu.push(item)
            }
          })
          Vue.set(state.event, 'sectionMenu', sectionMenu)
        }
      }
    }
  }
}
