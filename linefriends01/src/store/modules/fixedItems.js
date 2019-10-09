// fixed 상태값 저장
import cookies from 'js-cookie'
export default {
  namespaced: true,
  state: {
    meetMainFooter: false,
    meetCutline: false,
    meetCategoryOnTop: false,
    meetBrandBody: false,
    meetFooterWithAreaOrderInformation: false,
    underAreaOrderInformation: false,
    showTopBanner: !cookies.get('topBanner'),
    meetTop: true
  },
  mutations: {
    // footer가 화면에 등장
    meet_main_footer (state, params) {
      state.meetMainFooter = params
    },
    // footer가 category와 만남
    meet_cutline (state, params) {
      state.meetCutline = params
    },
    LEFT_CATEGORY_ON_TOP (state, params) {
      state.meetCategoryOnTop = params
    },
    meet_brand_body (state, params) {
      state.meetBrandBody = params
    },
    CHANGE_TOP_BANNER_STATE (state) {
      state.showTopBanner = !state.showTopBanner
    },
    MEET_FOOTER_WITH_AREA_ORDER_INFORMATION (state, params) {
      state.meetFooterWithAreaOrderInformation = params
    },
    UNDER_AREA_ORDER_INFORMATION (state, params) {
      state.underAreaOrderInformation = params
    },
    MEET_TOP (state, params) {
      state.meetTop = params
    }
  },
  getters: {
    topPosition (state, getters, rootState, rootGetters) {
      return (state.showTopBanner && rootGetters['banners/topBanners'] && rootGetters['banners/topBanners'][0]) ? 165 : 85
    }
  }
}
