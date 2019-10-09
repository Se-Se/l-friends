import { createNcpApiStore } from '@/api'
import config from '@/config'
import { isPC } from '@/utils/utils'
import cookies from 'js-cookie'

const device = isPC() ? 'pc' : 'mobile'

const apiStore = createNcpApiStore([
  {
    action: 'brandBanner',
    property: 'brandBanner',
    path: `display/banners/${config.brandBannerCode[device]}`
  },
  {
    action: 'mainSlideBanner',
    property: 'mainSlideBanner',
    path: `display/banners/${config.mainSlideBannerCode[device]}`
  },
  {
    action: 'mainTopBanner',
    property: 'mainTopBanner',
    path: `display/banners/${config.mainTopBannerCode[device]}`
  },
  {
    action: 'mainHotBanner',
    property: 'mainHotBanner',
    path: `display/banners/${config.mainHotBannerCode[device]}`
  },
  {
    action: 'mainHalfBanner',
    property: 'mainHalfBanner',
    path: `display/banners/${config.mainHalfBannerCode[device]}`
  },
  {
    action: 'categoryBanner',
    property: 'categoryBanner',
    path: `display/banners/${config.categoryBannerCode[device]}`
  },
  {
    action: 'eventCarouselBanner',
    property: 'eventCarouselBanner',
    path: `display/banners/${config.eventCarouselBannerCode[device]}`
  },
  {
    action: 'eventMainBanner',
    property: 'eventMainBanner',
    path: `display/banners/${config.eventMainBannerCode[device]}`
  },
  {
    action: 'myPageTopBanner',
    property: 'myPageTopBanner',
    path: `display/banners/${config.myPageTopBannerCode[device]}`
  },
  {
    action: 'myPageBottomBanner',
    property: 'myPageBottomBanner',
    path: `display/banners/${config.myPageBottomBannerCode[device]}`
  },
  {
    action: 'allCategoryBanner',
    property: 'allCategoryBanner',
    path: `display/banners/${config.allCategoryBanner[device]}`
  },
  {
    action: '_promotionBanner',
    property: 'promotionBanner',
    path: `display/banners/${config.promotionBannerCode[device]}`
  }
])

export default {
  namespaced: true,
  mixins: [apiStore],
  actions: {
    async promotionBanner ({ state, dispatch, commit, rootState }) {
      await dispatch('_promotionBanner')
    }
  },
  getters: {
    slideBanners (state) {
      return state.mainSlideBanner && state.mainSlideBanner[0] && state.mainSlideBanner[0].accounts[0].banners
    },
    hotBanners (state) {
      return state.mainHotBanner && state.mainHotBanner[0] && state.mainHotBanner[0].accounts[0].banners
    },
    topBanners (state) {
      return state.mainTopBanner && state.mainTopBanner[0] && state.mainTopBanner[0].accounts[0].banners
    },
    halfBanners (state) {
      return state.mainHalfBanner && state.mainHalfBanner[0] && state.mainHalfBanner[0].accounts[0].banners
    },
    eventCarouselBanner (state) {
      return state.eventCarouselBanner && state.eventCarouselBanner[0] && state.eventCarouselBanner[0].accounts[0].banners
    },
    eventMainBanner (state) {
      return state.eventMainBanner && state.eventMainBanner[0] && state.eventMainBanner[0].accounts[0].banners
    },
    brandBanners (state) {
      return state.brandBanner && state.brandBanner[0].accounts[0] && state.brandBanner[0].accounts[0].banners
    },
    promotionBanners (state) {
      return state.promotionBanner && state.promotionBanner[0] && state.promotionBanner[0].accounts[0].banners
    },
    categoryBanner (state) {
      return state.categoryBanner && state.categoryBanner[0].accounts
    },
    myPageTopBanners (state) {
      return state.myPageTopBanner && state.myPageTopBanner[0] && state.myPageTopBanner[0].accounts[0].banners
    },
    myPageBottomBanners (state) {
      return state.myPageBottomBanner && state.myPageBottomBanner[0] && state.myPageBottomBanner[0].accounts[0].banners
    },
    allCategoryBanners (state) {
      return state.allCategoryBanner && state.allCategoryBanner[0] && state.allCategoryBanner[0].accounts[0].banners
    }
  }
}
