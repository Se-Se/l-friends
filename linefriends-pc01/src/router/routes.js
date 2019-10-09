import Header from '../views/layout/Header.vue'
import Footer from '../views/layout/Footer.vue'
import Login from '../views/member/Login.vue'
import ResetPassword from '../views/member/ResetPassword.vue'
import ResetPasswordSendEmail from '../views/member/ResetPasswordSendEmail.vue'
import ResetPasswordResult from '../views/member/ResetPasswordResult.vue'
import ResetPasswordSuccess from '../views/member/ResetPasswordSuccess.vue'
import Join from '../views/member/join/Join.vue'
import JoinComplete from '../views/member/join/JoinComplete.vue'
import JoinSendEmail from '../views/member/join/JoinSendEmail.vue'
import MyPage from '../views/mypage/MyPage.vue'
import OrderDetail from '../views/mypage/order/OrderDetail.vue'
import OrderClaimCancel from '../views/mypage/order/OrderClaimCancel.vue'
import OrderClaimReturn from '../views/mypage/order/OrderClaimReturn.vue'
import Policy from '../views/etc/Policy.vue'
import DataError from '../views/etc/DataError.vue'
import NotFound from '../views/etc/NotFound.vue'
import ServiceInspection from '../views/etc/ServiceInspection.vue'
import OrderSheet from '../views/escrow/OrderSheet.vue'
// import Store from '../views/main/Store.vue'
import GoodsSearch from '../views/search/GoodsSearch.vue'
import KeywordSearch from '../views/search/KeywordSearch.vue'
import Faq from '../views/etc/Faq.vue'
import Inquiry from '../views/etc/Inquiry.vue'
import ProductDetail from '../views/goods/ProductDetail.vue'
import EventList from '../views/events/EventList.vue'
import EventView from '../views/events/EventView.vue'
import EtcStore from '../views/others/EtcStore.vue'
import BBSBoard from '../views/etc/BBSBoard.vue'
import BBSBoardDetail from '../views/etc/BBSBoardDetail.vue'
import Cupon from '../views/mypage/Cupon.vue'
import Profile from '../views/mypage/Profile.vue'
import Hack from '../views/mypage/Hack.vue'
import OrderList from '../views/mypage/order/OrderList.vue'
import CancelList from '../views/mypage/order/CancelList.vue'
import Qa from '../views/mypage/Qa.vue'
import ProfileInquiry from '../views/mypage/inquiry/ProfileInquiry.vue'
import LikeProducts from '../views/mypage/LikeProducts.vue'

export default [
  {
    path: '/',
    name: 'Home',
    components: {
      default: (resolve) => require(['../views/main/Home.vue'], resolve),
      header: Header,
      footer: Footer
    }
  },
  {
    path: '/member/login',
    name: 'Login',
    components: {
      default: Login,
      header: Header,
      footer: Footer
    },
    meta: {
      notMember: true
    }
  },
  {
    path: '/member/join',
    name: 'Join',
    components: {
      default: Join,
      header: Header,
      footer: Footer
    },
    meta: {
      notMember: true
    }
  },
  {
    /* 회원가입 > 회원가입 완료 */
    path: '/member/join/complete',
    name: 'JoinComplete',
    components: {
      header: Header,
      default: JoinComplete,
      footer: Footer
    },
    meta: {
      notMember: true
    }
  },
  {
    /* 회원가입 > 회원가입 이메일 인증 */
    path: '/member/join/sendEmail',
    name: 'JoinSendEmail',
    components: {
      header: Header,
      default: JoinSendEmail,
      footer: Footer
    },
    meta: {
      notMember: true,
      breadCrumbs: '이메일 인증',
      title: '이메일인증'
    }
  },
  {
    /* SNS 로그인 테스트 */
    path: '/member/login/callback/:sns',
    name: 'SNSLogin',
    components: {
      default: Login,
      header: Header,
      footer: Footer
    },
    meta: {
      notMember: true
    }
  },
  {
    /* 비밀번호찾기 */
    path: '/member/find/password',
    name: 'FindPassword',
    components: {
      default: ResetPassword,
      header: Header,
      footer: Footer
    },
    meta: {
      notMember: true
    }
  },
  {
    /* 비밀번호찾기 > 메일 전송 */
    path: '/member/find/password/email',
    name: 'FindPassword',
    components: {
      default: ResetPasswordSendEmail,
      header: Header,
      footer: Footer
    },
    meta: {
      notMember: true
    }
  },
  {
    /* 비밀번호찾기 > 비밀번호 재설정 */
    path: '/member/find/password/result',
    name: 'ResetPassword',
    components: {
      default: ResetPasswordResult
    },
    meta: {
      notMember: true
    }
  },
  {
    /* 비밀번호찾기 > 비밀번호 재설정 > 완료 */
    path: '/member/find/password/success',
    name: 'ResetPassword',
    components: {
      default: ResetPasswordSuccess
    },
    meta: {
      notMember: true
    }
  },
  {
    path: '/mypage',
    name: 'MyPage',
    components: {
      default: MyPage,
      header: Header,
      footer: Footer
    },
    meta: {
      needAuth: true
    }
  },
  {
    path: '/mypage/cupon/:usable?',
    name: 'Cupon',
    components: {
      default: Cupon,
      header: Header,
      footer: Footer
    },
    meta: {
      needAuth: true
    }
  },
  {
    path: '/mypage/qa',
    name: 'Qa',
    components: {
      default: Qa,
      header: Header,
      footer: Footer
    },
    meta: {
      needAuth: true
    }
  },
  {
    path: '/mypage/profile',
    name: 'Profile',
    components: {
      default: Profile,
      header: Header,
      footer: Footer
    },
    meta: {
      needAuth: true
    }
  },
  {
    /* SNS 계정 연동 */
    path: '/mypage/hack',
    name: 'Hack',
    components: {
      default: Hack,
      header: Header,
      footer: Footer
    },
    meta: {
      needAuth: true
    }
  },
  {
    path: '/mypage/like',
    name: 'LikeProducts',
    components: {
      default: LikeProducts,
      header: Header,
      footer: Footer
    },
    meta: {
      needAuth: true
    }
  },
  {
    path: '/mypage/myreview',
    name: 'MyreviewIndex',
    components: {
      default: (resolve) => require(['../views/mypage/review/index.vue'], resolve),
      header: Header,
      footer: Footer
    },
    children: [
      {
        path: '/',
        name: 'Myreview',
        component: (resolve) => require(['../views/mypage/review/Myreview.vue'], resolve),
        meta: {
          needAuth: true
        }
      },
      {
        path: 'reviewed',
        name: 'Reviewed',
        component: (resolve) => require(['../views/mypage/review/Reviewed.vue'], resolve),
        meta: {
          needAuth: true
        }
      }
    ]
  },
  {
    path: '/mypage/inquiry',
    name: 'ProfileInquiry',
    components: {
      default: ProfileInquiry,
      header: Header,
      footer: Footer
    },
    meta: {
      needAuth: true
    }
  },
  {
    /* SNS 계정 연동 */
    path: '/mypage/profile/callback/:sns',
    name: 'SNSConnect',
    components: {
      default: Profile,
      header: Header,
      footer: Footer
    },
    meta: {
      needAuth: true
    }
  },
  {
    path: '/mypage/orderdetail/:orderNo(\\d+)',
    name: 'OrderDetail',
    components: {
      default: OrderDetail,
      header: Header,
      footer: Footer
    },
    meta: {
      needAuth: true
    }
  },
  {
    path: '/mypage/cancel/:orderOptionNo(\\d+)',
    name: 'OrderClaimCancel',
    components: {
      default: OrderClaimCancel,
      header: Header,
      footer: Footer
    },
    meta: {
      needAuth: true
    }
  },
  {
    path: '/mypage/return/:orderOptionNo(\\d+)',
    name: 'OrderClaimReturn',
    components: {
      default: OrderClaimReturn,
      header: Header,
      footer: Footer
    },
    meta: {
      needAuth: true
    }
  },
  {
    path: '/mypage/orderlist',
    name: 'OrderList',
    components: {
      default: OrderList,
      header: Header,
      footer: Footer
    },
    meta: {
      needAuth: true
    }
  },
  {
    path: '/mypage/cancellist',
    name: 'CancelList',
    components: {
      default: CancelList,
      header: Header,
      footer: Footer
    },
    meta: {
      needAuth: true
    }
  },
  {
    path: '/cart',
    name: 'Cart',
    components: {
      default: (resolve) => require(['../views/escrow/Cart.vue'], resolve),
      header: Header,
      footer: Footer
    }
  },
  {
    path: '/order/:orderSheetNo(\\d+)',
    name: 'OrderSheet',
    components: {
      // default: (resolve) => require(['../views/escrow/OrderSheet.vue'], resolve),
      default: OrderSheet,
      header: Header,
      footer: Footer
    }
  },
  {
    path: '/order/paymentconfirm',
    name: 'PaymentConfirm',
    components: {
      default: (resolve) => require(['../views/escrow/PaymentConfirm.vue'], resolve),
      header: Header,
      footer: Footer
    }
  },
  {
    path: '/product/detail/:goodsNo',
    name: 'ProductDetail',
    components: {
      default: ProductDetail,
      header: Header,
      footer: Footer
    }
  },
  {
    path: '/goods/:categoryNo?/:subCategoryNo?',
    name: 'GoodsSearch',
    components: {
      default: GoodsSearch,
      header: Header,
      footer: Footer
    }
  },
  {
    path: '/search',
    name: 'KeywordSearch',
    components: {
      default: KeywordSearch,
      header: Header,
      footer: Footer
    }
  },
  {
    path: '/event',
    name: 'EventList',
    components: {
      default: EventList,
      header: Header,
      footer: Footer
    }
  },
  {
    path: '/event/:eventNo',
    name: 'EventDetail',
    components: {
      header: Header,
      default: EventView,
      footer: Footer
    }
  },
  {
    path: '/policy',
    name: 'Policy',
    components: {
      default: Policy,
      header: Header,
      footer: Footer
    }
  },
  {
    path: '/etc/faq',
    alias: '/etc/faq/search',
    name: 'Faq',
    components: {
      default: Faq,
      header: Header,
      footer: Footer
    }
  },
  {
    path: '/others/store',
    name: 'EtcStore',
    components: {
      default: EtcStore,
      header: Header,
      footer: Footer
    }
  },
  {
    path: '/etc/notice',
    name: 'BBSBoard',
    components: {
      default: BBSBoard,
      header: Header,
      footer: Footer
    }
  },
  {
    path: '/notice/detail/:articleNo',
    name: 'BBSBoardDetail',
    components: {
      default: BBSBoardDetail,
      header: Header,
      footer: Footer
    }
  },
  {
    path: '/etc/inquiry',
    name: 'Inquiry',
    components: {
      default: Inquiry,
      header: Header,
      footer: Footer
    },
    meta: {
      needAuth: true
    }
  },
  {
    path: '/etc/serviceInspection',
    name: 'ServiceInspection',
    components: {
      default: ServiceInspection
    }
  },
  {
    path: '/etc/dataerror',
    name: 'DataError',
    components: {
      default: DataError
    }
  },
  {
    path: '/*',
    name: 'NotFound',
    components: {
      default: NotFound
    }
  }
]
