import { createNcpApiStore } from '@/api'
import { Alert, Confirm } from '@/utils/event-bus'
import config from '@/config'
import Vue from 'vue'
import router from '@/router'
const apiStore = createNcpApiStore([
  {
    action: '_today',
    property: 'today',
    path: `display/sections/${config.todaySectionNo}`,
    onSuccess (state, res) {
      state.today = res.data[0]
    }
  },
  {
    action: '_pink',
    property: 'pink',
    path: `display/sections/${config.pinkSectionNo}`,
    onSuccess (state, res) {
      state.pink = res.data[0]
    }
  },
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
  getters: {
    todayProduct (state, getters, rootState) {
      if (!state.today || !state.today.products || state.today.products.length === 0) {
        return null
      }

      let todayProduct = null
      let notfind = true
      state.today.products.reverse()
      state.today.products.forEach(product => {
        if (notfind) {
          if (product.stockCnt > 0) {
            const tempSticker = []
            if (product.stickerLabels) {
              if (product.stickerLabels.some(sticker => sticker === '기부천사')) {
                tempSticker.push('기부천사')
              }
              if (product.hasCoupons.brand || product.hasCoupons.category || product.hasCoupons.partner || product.hasCoupons.product) {
                tempSticker.push('쿠폰')
              }
              if (product.deliveryConditionType === 'FREE') {
                tempSticker.push('무료배송')
              }
            } else {
              if (product.hasCoupons.brand || product.hasCoupons.category || product.hasCoupons.partner || product.hasCoupons.product) {
                tempSticker.push('쿠폰')
              }
              if (product.deliveryConditionType === 'FREE') {
                tempSticker.push('무료배송')
              }
            }
            if (tempSticker.length === 4) {
              tempSticker.pop()
              tempSticker.pop()
            }
            if (tempSticker.length === 3) {
              tempSticker.pop()
            }
            product.newStickers = tempSticker

            product.milliseconds = new Date(product.saleEndYmdt.replace(' ', 'T')) - new Date()
            product.showCountDown = product.milliseconds < 24 * 60 * 60 * 1000
            product.days = Math.floor(product.milliseconds / (24 * 60 * 60 * 1000))

            todayProduct = product
            notfind = false
          }
        }
      })

      return todayProduct
    }
  },
  actions: {
    async today ({ state, commit, dispatch }) {
      await dispatch('_today', { params: { soldout: false, order: 'SALE', saleStatus: 'ONSALE' } }).then(() => {
        state.showTimerSpan = true
      })
    },
    async fetchPinkPick ({ state, commit, dispatch }) {
      await dispatch('_pink', { params: { soldout: false, order: 'ADMIN_SETTING', saleStatus: 'ONSALE' } })
    },
    async fetchEventDetail ({ state, commit, dispatch }, {eventNo, isMain}) {
      await dispatch('fetch', { params: { eventNo, soldout: isMain } }).catch(e => {
        if (e.data.code === 'A0006') {
          // alert('접근 불가한 페이지입니다.')
          Alert({
            message: '접근 불가한 페이지입니다.'
          })
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
    },
    RESET_TIMER_SPAN (state) {
      state.showTimerSpan = false
    }
  }
}
