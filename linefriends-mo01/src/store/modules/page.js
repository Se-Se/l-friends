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
      const noPageActions = ['Login', 'EventList', 'EventDetail', 'LikeProducts', 'AddReview', 'EditReview', 'JoinPage', 'Join', 'FindPassword']
      if (!noPageActions.some((pageName) => pageName === to.name)) {
        await dispatch(`page/${to.name}`, { to, from, categories }, { root: true })
      }
      dispatch('display/fetchMainTopBanner', {}, { root: true })
      dispatch('common/fetchNewCategories', {}, { root: true })
      dispatch('cart/fetchCount', {}, { root: true })
      dispatch('profile/memberFetch', {}, { root: true })
      dispatch('likeProducts/fetchLikeProducts', {}, { root: true })
      dispatch('product/fetchFavoriteKeywords', {}, { root: true })
      dispatch('display/promotionBanner', { to }, { root: true })
    },
    GoodsDetail ({ dispatch }, { to }) {
      dispatch('product/fetchProductDetail', { to }, { root: true })
    },
    Cart ({ dispatch }, { to }) {
      dispatch('cart/cartInit', { to }, { root: true })
      dispatch('product/fetchWrappingProduct', {}, { root: true })
      dispatch('product/fetchBestProducts', { type: 'cart' }, { root: true })
    },
    OrderSheet: ({ dispatch }, { to }) => {
      return Promise.all([
        dispatch('ordersheet/fetchOrder', to.params.orderSheetNo, { root: true }),
        // dispatch('ordersheet/deliveryconditions', to.params.orderSheetNo, { root: true }),
        dispatch('shippingaddresses/recentAddresses', {}, { root: true }),
        dispatch('profile/memberFetch', {}, { root: true }),
        dispatch('cart/fetchCount', {}, { root: true })
      ])
    },
    PaymentConfirm: ({ dispatch }, { to }) => {
      // dispatch('myorder/getOrder', { orderNo: to.query.orderNo }, { root: true })
    },
    ProfileInquiry ({ dispatch }, { to }) {
      dispatch('profileinquiry/fetchInquiries', { to }, { root: true })
    },
    OrderDetail ({ dispatch }, { to }) {
      dispatch('myorder/getOrder', { orderNo: to.params.orderNo }, { root: true })
    },
    OrderClaimCancel ({ dispatch }, { to }) {
      dispatch('myorder/getClaimOrderOption', { claimType: 'CANCEL', orderOptionNo: to.params.orderOptionNo }, { root: true })
    },
    EditAddress ({ dispatch }, { to }) {
      dispatch('myorder/getOrder', { orderNo: to.params.orderNo }, { root: true })
    },
    Policy ({ dispatch }, { to }) {
    },
    Home ({ dispatch }, { to }) {
      dispatch('display/fetchMain', {}, { root: true })
      dispatch('board/fetchMainNotice', {}, { root: true })
      dispatch('recent/fetchRecentProducts', {}, { root: true })
      dispatch('product/fetchMainBestProducts', {}, { root: true })
    },
    Faq ({ dispatch }, { to }) {
      dispatch('board/faqCategorys', { to }, { root: true })
    },
    Inquiry ({ dispatch }, { to }) { },
    BBSBoard ({ dispatch }, { to }) {
      dispatch('board/featchBBS', {}, { root: true })
    },
    BBSBoardDetail ({ dispatch }, { to }) {
      dispatch('board/bbsCategorys', { to }, { root: true })
      dispatch('board/fetchBBSDetail', { to }, { root: true })
    },
    Result ({ dispatch }, { to }) {
      dispatch('search/initFetchList', { to }, { root: true })
      dispatch('product/fetchBestProducts', {}, { root: true })
    },
    ProductList ({ dispatch }, { to }) {
      dispatch('search/initFetchList', { to }, { root: true })
      dispatch('display/fetchCategoryTopBanner', { to }, { root: true })
    },
    Search ({ dispatch }, { to }) {
      dispatch('search/fetchLocalKeyword', { to }, { root: true })
    },
    JoinComplete ({ dispatch }, { to }) { },
    JoinSendEmail ({ dispatch }, { to }) { },

    ProductDetail ({ dispatch }, { to, from }) {
      dispatch('product/initProduct', { to, from }, { root: true })
    },
    GoodsInquiryDetail ({ dispatch }, { to }) { },
    Cupon ({ dispatch }, { to }) {
      dispatch('mypage/fetchCupon', { to }, { root: true })
    },
    Qa ({ dispatch }, { to }) {
      dispatch('mypage/fetchQa', { to }, { root: true })
      dispatch('common/getMalls', {}, { root: true })
    },
    Mypage ({ dispatch }, { to }) {
      dispatch('member/mySummary', { to }, { root: true })
      dispatch('productinquiry/fetchProductInquiries', {}, { root: true })
    },
    OrderList ({ dispatch }, { to }) {
      dispatch('orderList/initOrderList', { type: 'ORDER' }, { root: true })
    },
    CancelList ({ dispatch }, { to }) {
      dispatch('orderList/initOrderList', { type: 'CANCEL' }, { root: true })
    },
    Myreview ({ dispatch }, { to }) {
      dispatch('review/fetchProductReviewable', {}, { root: true })
    },
    Reviewed ({ dispatch }, { to }) {
      dispatch('review/fetchProfileProductReviews', {}, { root: true })
    },
    Profile ({ dispatch }, { to }) { },
    Hack ({ dispatch }, { to }) { },
    StoreGuide ({ dispatch }, { to }) { },
    ServiceInspection ({ dispatch }, { to }) { },
    Package ({ dispatch }, { to }) {
      return Promise.all([
        dispatch('product/fetchProduct', { productTheNo: to.params.goodsNo }, { root: true }),
        dispatch('product/fetchProductOptions', to.params.goodsNo, { root: true }),
        dispatch('product/fetchProductOptionsImages', to.params.goodsNo, { root: true }),
        dispatch('profile/memberFetch', {}, { root: true })
      ])
    },
    OrderCancelDetail ({ dispatch }, { to }) { },
    OrderReturnDetail ({ dispatch }, { to }) { }
  }
}

export default pageStore
