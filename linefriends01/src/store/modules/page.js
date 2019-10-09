import cookies from 'js-cookie'
import $ from 'jquery'
import config from '@/config'

const FETCH_DATA_START = 'FETCH_DATA_START'
const FETCH_DATA_END = 'FETCH_DATA_END'
const FETCH_DATA_ERROR = 'FETCH_DATA_ERROR'

function genFetchDataAction (action) {
  return (context, payload) => {
    context.commit(FETCH_DATA_START)
    // for keep scroll position.
    if ($('#wrap').height() < 10000) {
      $('#wrap').height(10000)
    }

    action(context, payload)
      .then(() => {
        $('#wrap').css('height', '')
        return context.commit(FETCH_DATA_END)
      })
      .catch((error) => {
        $('#wrap').css('height', '')
        context.commit(FETCH_DATA_ERROR, error)
        return Promise.reject(error)
      })
  }
}

const state = {
  initDataFetching: false,
  error: null
}

const actions = {
  MainHome: genFetchDataAction(({ dispatch }, { to }) => (
    Promise.all([
      dispatch('event/fetchEventDetail', {eventNo: config.chuseokEventNo, isMain: false}),
      dispatch('banners/mainTopBanner'),
      dispatch('banners/mainHotBanner'),
      dispatch('banners/mainHalfBanner'),
      dispatch('banners/mainSlideBanner')
      // dispatch('productList/fetchBestByHome'),
      // dispatch('event/today'),
      // dispatch('event/fetchPinkPick'),
      // dispatch('banners/mainCarouselBanner'),
      // dispatch('banners/mainRecommendBanner')
    ])
  )),
  MainBest: genFetchDataAction(({ dispatch }) => (
    Promise.all([
    ])
  )),
  MainToday: genFetchDataAction(({ dispatch }) => (
    Promise.all([
      dispatch('display/todaysdeal')
    ])
  )),
  MainBrand: genFetchDataAction(({ dispatch }) => (
    Promise.all([
      dispatch('banners/brandBanner'),
      dispatch('brand/fetchAllBrand')
    ])
  )),
  MainEvent: genFetchDataAction(({ dispatch }) => (
    Promise.all([
      dispatch('banners/eventCarouselBanner'),
      dispatch('banners/eventMainBanner')
    ])
  )),
  Search: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('productList/search', { to }),
      dispatch('productList/fetchBestBySearch')
    ])
  )),
  GoodsList: genFetchDataAction(({ dispatch, commit }, { to, from }) => {
    if (from.name === 'GoodsList') {
      commit('productList/RESET_CUR_PAGE_NO')
    }

    return Promise.all([
      dispatch('productList/fetchListByCategory', to)
    ])
  }),
  GoodsSaleList: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('productList/fetchListSale', to)
    ])
  )),
  GoodsDetail: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('product/fetchProduct', { productNo: to.params.goodsNo }),
      dispatch('product/fetchProductOptions', to.params.goodsNo),
      dispatch('review/fetchProductReviews', {
        productNo: to.params.goodsNo,
        pageNo: 1,
        orderBy: 'RECOMMEND'
      }),
      dispatch('productinquiry/fetchProductInquiry', { productNo: to.params.goodsNo }),
      dispatch('productrecommand/fetchByProductNo', to.params.goodsNo),
      dispatch('coupon/fetchProductCoupons', to.params.goodsNo)
    ])
  )),
  Brand: genFetchDataAction(({ dispatch }, { to }) => (
    Promise.all([
      dispatch('productList/fetchListByBrand', { to }),
      dispatch('brand/fetchBrand', Number(to.params.brandNo))
    ])
  )),
  BrandCategory: genFetchDataAction(({ dispatch }, { to }) => (
    Promise.all([
      dispatch('productList/fetchListByBrand', { to }),
      dispatch('brand/fetchBrand', Number(to.params.brandNo))
    ])
  )),
  Event: genFetchDataAction(({ dispatch }, { to }) => (
    Promise.all([
      // dispatch('event/fetchOtherEvent'),
      dispatch('banners/promotionBanner')
    ])
  )),
  EventDetail: genFetchDataAction(({ dispatch }, { to }) => (
    Promise.all([
      // dispatch('event/fetchEventDetail', {eventNo: to.params.eventNo, 'filter.soldout': true})
    ]).then(() => {
      if (to.hash && $(to.hash).offset()) {
        $('body,html').scrollTop($(to.hash).offset().top)
      }
    })
  )),
  ItemView: genFetchDataAction(({ dispatch }, { to, from }) => {
    if (from && from.name === 'ItemView' && to.hash) {
      return Promise.resolve()
    }
    return dispatch('product/fetchProduct', { productNo: to.params.productId, preview: to.query.preview }).then(() => {
      return Promise.all([
        dispatch('product/fetchProductOptions', to.params.productId),
        dispatch('coupon/fetchProductCoupons', to.params.productId),
        dispatch('likeProducts/fetchLikeProducts'),
        dispatch('profile/memberFetch'),
        dispatch('review/fetchProductReviews', {
          productNo: to.params.productId,
          pageNo: 1,
          orderBy: 'RECOMMEND'
        }),
        dispatch('productinquiry/fetchProductInquiry', {
          productNo: to.params.productId,
          pageNo: 1
        }),
        dispatch('product/fetchProductOptionsImages', to.params.productId)
      ])
    }).then(() => {
      if (to.hash && $(to.hash).offset()) {
        $('body,html').scrollTop($(to.hash).offset().top)
      }
    })
  }),
  Cart: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('cart/fetchCart')
    ])
  )),
  MemberSetting: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('profile/memberFetch'),
      dispatch('authentication/fetchShopAgreement'),
      dispatch('authentication/fetchAdPushAgreement')
    ])
  )),
  MemberAgreement: genFetchDataAction(({ dispatch }, { to, from }) => {
    if (!cookies.get('ncpAccessToken') || cookies.get('ncpAccessToken').length === 0) {
      location.href = '/member/login'
      return
    }
    return Promise.all([
      dispatch('profile/memberFetch')
    ])
  }),
  MemberAgreementNormal: genFetchDataAction(({ dispatch }) => {
    Promise.all([
    ])
  }),
  LoginNormal: genFetchDataAction(({ dispatch }) => {
    Promise.all([
    ])
  }),
  OrderList: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchMalls'),
      dispatch('myorder/getOrderList', { type: 'ORDER', to })
    ])
  )),
  CancelList: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchMalls'),
      dispatch('myorder/getOrderList', { type: 'CANCEL', to })
    ])
  )),
  BeforeOrder: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('ordersheet/getSheetNoInit', to)
    ])
  )),
  OrderSheet: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('ordersheet/fetchOrder', to.params.orderSheetNo),
      // dispatch('ordersheet/fetchOrderConpons', to.params.orderSheetNo),
      dispatch('shippingaddresses/recentAddresses')
      // dispatch('profile/memberFetch')
    ])
  )),
  MyPage: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('member/mySummary'),
      dispatch('member/getWelfareTotal'),
      dispatch('profileinquiry/fetchInquiries'),
      dispatch('productinquiry/fetchProductInquiries')
    ])
  )),
  MyMain: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('member/ordersStatus'),
      dispatch('member/myCoupons'),
      dispatch('member/myReview'),
      dispatch('member/myLike')
    ])
  )),
  MyReviewable: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchMalls'),
      dispatch('profilereview/fetchProductReviewable'),
      dispatch('review/fetchProfileProductReviews')
    ])
  )),
  MyReviews: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('review/fetchProfileProductReviews')
    ])
  )),
  ValidCoupon: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('validCoupon/getValidCoupons'),
      dispatch('validCoupon/getNoValidCoupons')
      // dispatch('validCoupon/getNoValidCoupons')
    ])
  )),
  NoValidCoupon: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('validCoupon/getNoValidCoupons')
      // dispatch('validCoupon/getValidCoupons'),
      // dispatch('validCoupon/getNoValidCoupons')
    ])
  )),
  LikeProducts: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('likeProducts/fetchLikeProducts')
    ])
  )),
  OrderDetail: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchMalls'),
      dispatch('myorder/getOrderDetail', to.params.orderNo)
    ])
  )),
  OrderClaimCancel: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchMalls'),
      dispatch('myorder/getClaimOrderOption', {
        claimParams: {
          claimType: 'CANCEL',
          orderOptionNo: to.params.orderOptionNo
        }
      })
    ])
  )),
  OrderClaimReturn: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchMalls'),
      dispatch('myorder/getClaimOrderOption', {
        claimParams: {
          claimType: 'RETURN',
          orderOptionNo: to.params.orderOptionNo
        }
      })
    ])
  )),
  NonMemberOrderDetail: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchMalls'),
      dispatch('guestorder/getGuestOrderDetail', to.params.orderNo)
    ])
  )),
  NonMemberCancel: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchMalls'),
      dispatch('guestorder/getGuestClaim', {
        claimParams: {
          claimType: 'CANCEL',
          orderOptionNo: to.params.orderOptionNo
        }
      })
    ])
  )),
  NonMemberReturn: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchMalls'),
      dispatch('guestorder/getGuestClaim', {
        claimParams: {
          claimType: 'RETURN',
          orderOptionNo: to.params.orderOptionNo
        }
      })
    ])
  )),
  NonMemberCancelDetail: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchMalls'),
      dispatch('guestorder/getGuestClaimResult', {
        claimParams: {
          orderOptionNo: to.params.orderOptionNo
        }
      })
    ])
  )),
  NonMemberReturnDetail: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchMalls'),
      dispatch('guestorder/getGuestClaimResult', {
        claimParams: {
          orderOptionNo: to.params.orderOptionNo
        }
      })
    ])
  )),
  Faq: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('board/faqCategorys')
    ])
  )),
  BoardInquiry: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchMalls'),
      dispatch('profile/memberFetch')
    ])
  )),
  PaymentConfirm: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('myorder/getOrder', to.query.orderNo)
    ])
  )),
  AddReview: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('myorder/getOrder', to.params.orderNo)
    ])
  )),
  EditReview: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('myorder/getOrder', to.params.orderNo),
      dispatch('profilereview/fetchProductReviewDetail', {
        editParams: {
          reviewNo: to.params.reviewNo,
          productNo: to.params.productNo
        }
      })
    ])
  )),
  MyProductInquirys: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      // dispatch('common/fetchMalls'),
      dispatch('productinquiry/fetchProductInquiries')
    ])
  )),
  ProfileInquiries: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('profileinquiry/fetchInquiries')
    ])
  )),
  Partners: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchPartners')
    ])
  )),
  Terms: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchTerms', 'USE')
    ])
  )),
  Privacy: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchTerms', 'PI_PROCESS')
    ])
  )),
  BBSBoard: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('board/bbsCategorys'),
      dispatch('board/featchBBS', 1)
    ])
  )),
  BBSBoardDetail: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('board/bbsCategorys'),
      // dispatch('profile/memberFetch'),
      dispatch('board/fetchBBSDetail', to.params.articleNo).catch((e) => {
        window.location.href = '/pagenotfound'
      })
    ])
  )),
  Welfare: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('member/mySummary'),
      dispatch('member/getWelfareTotal'),
      dispatch('myorder/getPointName')
    ])
  ))
}

const mutations = {
  [FETCH_DATA_START] (state) {
    state.initDataFetching = true
  },
  [FETCH_DATA_END] (state) {
    state.initDataFetching = false
  },
  [FETCH_DATA_ERROR] (state, payload) {
    state.error = payload
  }
}

export default {
  state,
  actions: Object.keys(actions).reduce((obj, rawActionName) => {
    obj[`beforeEnter${rawActionName}`] = actions[rawActionName]
    return obj
  }, {}),
  mutations
}
