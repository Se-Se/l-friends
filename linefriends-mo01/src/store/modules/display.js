import { createNcpApiStore } from '@/api'
import { checkBanner } from '@/utils/utils'

const apiStore = createNcpApiStore([
  {
    action: '_fetchMainBigBanner',
    property: 'mainBigBanner',
    path: `display/banners/${process.env.VUE_APP_MAIN_BIG_BANNER}`
  },
  {
    action: '_fetchMainMidBanner',
    property: 'mainMidBanner',
    path: `display/banners/${process.env.VUE_APP_MAIN_MID_BANNER}`
  },
  {
    action: '_fetchMainMid2Banner',
    property: 'mainMid2Banner',
    path: `display/banners/${process.env.VUE_APP_MAIN_MID2_BANNER}`
  },
  {
    action: '_fetchMainBtmBanner',
    property: 'mainBtmBanner',
    path: `display/banners/${process.env.VUE_APP_MAIN_BTM_BANNER}`
  },
  {
    action: '_fetchMainQrBanner',
    property: 'mainQrBanner',
    path: `display/banners/${process.env.VUE_APP_MAIN_QR_BANNER}`
  },
  {
    action: '_fetchmainTopBanner',
    property: 'mainTopBanner',
    path: `display/banners/${process.env.VUE_APP_MAIN_TOP_BANNER}`
  },
  {
    action: '_fetchCategoryTopBanner',
    property: 'categoryTopBanner',
    path: `display/banners/${process.env.VUE_APP_CATEGORY_TOP_BANNER}`
  },
  {
    action: '_promotionBanner',
    property: 'promotionBanner',
    path: `display/banners/${process.env.VUE_APP_PROMOTION_BANNER}`
  },
  {
    action: '_fetchMainNewSections',
    property: 'mainNewSections',
    path: '/display/sections/{sectionNos}',
    pathParams: ['sectionNos']
  },
  {
    action: '_fetchMainBrandSection',
    property: 'mainBrandSection',
    path: '/display/sections/{sectionNo}',
    pathParams: ['sectionNo']
  }
])

export default {
  namespaced: true,
  mixins: [apiStore],
  actions: {
    async fetchMain ({ state, dispatch }) {
      if (!state.mainBigBanner) {
        await dispatch('_fetchMainBigBanner')
      }
      if (!state.mainNewSections) {
        const fetchParams = {
          sectionNos: process.env.VUE_APP_MAIN_NEW_SECTIONS,
          by: 'ADMIN_SETTING',
          direction: 'ASC',
          saleStatus: 'RESERVATION_AND_ONSALE'
        }
        await dispatch('_fetchMainNewSections', { params: fetchParams })
      }
      if (!state.mainMidBanner) {
        await dispatch('_fetchMainMidBanner')
      }
      if (!state.mainMid2Banner) {
        await dispatch('_fetchMainMid2Banner')
      }
      if (!state.mainBrandSection) {
        const fetchParams = {
          sectionNo: process.env.VUE_APP_MAIN_BRAND_SECTIONS,
          by: 'ADMIN_SETTING',
          direction: 'ASC',
          saleStatus: 'RESERVATION_AND_ONSALE'
        }
        await dispatch('_fetchMainBrandSection', { params: fetchParams })
      }
      if (!state.mainBtmBanner) {
        await dispatch('_fetchMainBtmBanner')
      }
      if (!state.mainQrBanner) {
        await dispatch('_fetchMainQrBanner')
      }
    },
    async fetchMainTopBanner ({ state, dispatch, commit, rootState }) {
      await dispatch('_fetchmainTopBanner')
    },
    async fetchCategoryTopBanner ({ state, dispatch }, { to }) {
      let CategoryNo = to.params.subCategoryNo || to.params.categoryNo || null
      if (!CategoryNo) {
        await dispatch('_fetchCategoryTopBanner')
      } else {
        state.categoryTopBanner = null
      }
    },
    async promotionBanner ({ state, dispatch, commit, rootState }) {
      await dispatch('_promotionBanner')
    }
  },
  getters: {
    bigBanners (state) {
      if (checkBanner(state.mainBigBanner)) {
        return state.mainBigBanner[0].accounts[0].banners
      }
    },
    midBanner (state) {
      if (checkBanner(state.mainMidBanner)) {
        return state.mainMidBanner[0].accounts[0].banners[0]
      }
    },
    mid2Banners (state) {
      if (checkBanner(state.mainMid2Banner)) {
        return state.mainMid2Banner[0].accounts[0].banners
      }
    },
    btmBanners (state) {
      if (checkBanner(state.mainBtmBanner)) {
        return state.mainBtmBanner[0].accounts[0].banners
      }
    },
    qrBanners (state) {
      if (checkBanner(state.mainQrBanner)) {
        return state.mainQrBanner[0].accounts[0].banners
      }
    },
    topBanners (state) {
      if (checkBanner(state.mainTopBanner)) {
        return state.mainTopBanner[0].accounts[0].banners
      }
    },
    categoryBanners (state) {
      if (checkBanner(state.categoryTopBanner)) {
        return state.categoryTopBanner[0].accounts[0].banners[0]
      }
    },
    promotionBanners (state) {
      if (checkBanner(state.promotionBanner)) {
        return state.promotionBanner[0].accounts[0].banners
      }
    }
  }
}
