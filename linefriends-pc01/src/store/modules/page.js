import router from '@/router'
import store from '@/store'

router.beforeEach((to, from, next) => {
  store.commit('page/init')
  next()
})
router.afterEach((to, from) => {
  const noInitPages = ['NotFound', 'DataError']
  if (!noInitPages.some((pageName) => pageName === to.name)) {
    store
      .dispatch('page/initLoader', { to, from }, { root: true })
      .then(() => {
        store.commit('page/done')
      })
      .catch(() => {
        store.commit('page/done')
      })
  } else {
    store.commit('page/done')
  }
})

const pageStore = {
  namespaced: true,
  state: {
    loading: false
  },
  mutations: {
    done (state) {
      state.loading = false
    },
    init (state) {
      state.loading = true
    }
  },
  actions: {
    async initLoader ({ dispatch }, { to, from }) {
      let categories = null
      await dispatch('common/fetchMalls', {}, { root: true })
      await dispatch('common/fetchCategories', {}, { root: true }).then((res) => {
        categories = res
      })
      const noPageActions = ['Login', 'FindPassword', 'EventList', 'EventDetail', 'LikeProducts']
      if (!noPageActions.some((pageName) => pageName === to.name)) {
        await dispatch(`page/${to.name}`, { to, from, categories }, { root: true })
      }
      dispatch('display/fetchMainTopBanner', {}, { root: true })
      dispatch('cart/fetchCount', {}, { root: true })
      dispatch('profile/memberFetch', {}, { root: true })
      dispatch('product/fetchFavoriteKeywords', {}, { root: true })
      dispatch('likeProducts/fetchLikeProducts', { to }, { root: true })
      dispatch('display/promotionBanner', { to }, { root: true })
    },
    Cart ({ dispatch }, { to }) {
      dispatch('cart/cartInit', { to }, { root: true })
      dispatch('product/fetchWrappingProduct', {}, { root: true })
      dispatch('product/fetchBestProducts', { type: 'cart' }, { root: true })
    },
    OrderSheet: ({ dispatch }, { to }) => {
      return Promise.all([
        dispatch('ordersheet/fetchOrder', to.params.orderSheetNo, { root: true }),
        dispatch('shippingaddresses/recentAddresses', {}, { root: true }),
        dispatch('profile/memberFetch', {}, { root: true }),
        dispatch('cart/fetchCount', {}, { root: true })
        // dispatch('ordersheet/deliveryconditions', to.params.orderSheetNo, { root: true })
        // dispatch('recentAddresses', { root: true })
      ])
    },
    OrderDetail ({ dispatch }, { to }) {
      dispatch('myorder/getOrder', { orderNo: to.params.orderNo }, { root: true })
    },
    OrderClaimCancel ({ dispatch }, { to }) {
      dispatch('myorder/getClaimOrderOption', { claimType: 'CANCEL', orderOptionNo: to.params.orderOptionNo }, { root: true })
    },
    OrderClaimReturn ({ dispatch }, { to }) {
      dispatch('myorder/getClaimOrderOption', { claimType: 'RETURN', orderOptionNo: to.params.orderOptionNo }, { root: true })
    },
    PaymentConfirm: ({ dispatch }, { to }) => {
      return Promise.all([
        // dispatch('myorder/getOrder', { orderNo: to.query.orderNo }, { root: true })
      ])
    },
    GoodsSearch ({ dispatch }, { to }) {
      dispatch('search/fetchList', { to }, { root: true })
      dispatch('display/fetchCategoryTopBanner', { to }, { root: true })
    },
    KeywordSearch ({ dispatch }, { to }) {
      dispatch('search/fetchList', { to }, { root: true })
      dispatch('product/fetchBestProducts', {}, { root: true })
    },
    async MyPage ({ dispatch }, { to }) {
      dispatch('member/mySummary', { to }, { root: true })
      dispatch('mypage/fetchQa', { to }, { root: true })
      dispatch('common/getMalls', {}, { root: true })
      dispatch('profileinquiry/fetchInquiries', { to }, { root: true })
      dispatch('review/fetchProfileProductReviews', {}, { root: true })
    },
    ProfileInquiry ({ dispatch }, { to }) {
      dispatch('profileinquiry/fetchInquiries', { to }, { root: true })
    },
    OrderList ({ dispatch }, { to }) {
      dispatch('orderList/getOrderList', { type: 'ORDER', to }, { root: true })
    },
    CancelList ({ dispatch }, { to }) {
      dispatch('orderList/getOrderList', { type: 'CANCEL', to }, { root: true })
    },
    Home ({ dispatch }, { to }) {
      dispatch('display/fetchMain', {}, { root: true })
      dispatch('board/fetchMainNotice', {}, { root: true })
      dispatch('search/setDefaultKeyword', '', { root: true }) // 검색어 초기화
      dispatch('product/fetchMainBestProducts', {}, { root: true })
      dispatch('recent/fetchRecentProducts', {}, { root: true })
    },
    Faq ({ dispatch }, { to }) {
      dispatch('board/faqCategorys', { to }, { root: true })
    },
    Inquiry ({ dispatch }, { to }) { },
    BBSBoard ({ dispatch }, { to }) {
      dispatch('board/featchBBS', { to }, { root: true })
    },
    BBSBoardDetail ({ dispatch }, { to }) {
      dispatch('board/bbsCategorys', { to }, { root: true })
      dispatch('board/fetchBBSDetail', { to }, { root: true })
    },
    Join ({ dispatch }, { to }) { },
    JoinComplete ({ dispatch }, { to }) { },
    JoinSendEmail ({ dispatch }, { to }) { },
    ProductDetail ({ dispatch }, { to, from }) {
      dispatch('product/initProduct', { to, from }, { root: true })
    },
    Cupon ({ dispatch }, { to }) {
      dispatch('mypage/fetchCupon', { to }, { root: true })
    },
    Qa ({ dispatch }, { to }) {
      dispatch('mypage/fetchQa', { to }, { root: true })
      dispatch('common/getMalls', {}, { root: true })
    },
    Profile ({ dispatch }, { to }) { },
    Hack ({ dispatch }, { to }) { },
    Myreview ({ dispatch }, { to }) {
      dispatch('review/fetchProductReviewable', {}, { root: true })
    },
    Reviewed ({ dispatch }, { to }) {
      dispatch('review/fetchProfileProductReviews', {}, { root: true })
    },
    EtcStore ({ dispatch }, { to }) { }
  }
}

export default pageStore
