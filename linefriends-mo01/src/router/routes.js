import Header from '../views/layout/Header.vue'
import Footer from '../views/layout/Footer.vue'
import Login from '../views/member/Login.vue'
import ResetPassword from '../views/member/ResetPassword.vue'
import ResetPasswordSendEmail from '../views/member/ResetPasswordSendEmail.vue'
import ResetPasswordResult from '../views/member/ResetPasswordResult.vue'
import ResetPasswordSuccess from '../views/member/ResetPasswordSuccess.vue'
import SearchForm from '../views/search/SearchForm.vue'
import Faq from '../views/etc/Faq.vue'
import BBSBoard from '../views/etc/BBSBoard.vue'
import Inquiry from '../views/etc/Inquiry.vue'
import BBSBoardDetail from '../views/etc/BBSBoardDetail.vue'
import ServiceInspection from '../views/etc/ServiceInspection.vue'
import NotFound from '../views/etc/NotFound.vue'
import DataError from '../views/etc/DataError.vue'
import Result from '../views/search/Result.vue'
import ProductList from '../views/search/ProductList.vue'
import JoinPage from '../views/member/join/JoinPage.vue'
import Join from '../views/member/join/Join.vue'
import JoinComplete from '../views/member/join/JoinComplete.vue'
import JoinSendEmail from '../views/member/join/JoinSendEmail.vue'
import EventList from '../views/events/EventList.vue'
import EventDetail from '../views/events/EventDetail.vue'
import GoodsDetail from '../views/goods/GoodsDetail.vue'
import StoreGuide from '../views/others/StoreGuide'
import GoodsInquiryDetail from '../views/goods/GoodsInquiryDetail.vue'
import OrderList from '../views/mypage/order/OrderList.vue'
import CancelList from '../views/mypage/order/CancelList.vue'
import OrderDetail from '../views/mypage/order/OrderDetail.vue'
import OrderClaimCancel from '../views/mypage/order/OrderClaimCancel.vue'
import EditAddress from '../views/mypage/order/EditAddress.vue'
import Cupon from '../views/mypage/Cupon.vue'
import Qa from '../views/mypage/Qa.vue'
import Mypage from '../views/mypage/Mypage.vue'
import LikeProducts from '../views/mypage/LikeProducts.vue'
import ProfileInquiry from '../views/mypage/inquiry/ProfileInquiry.vue'
import Profile from '../views/mypage/Profile.vue'
import Hack from '../views/mypage/Hack.vue'
import AddReview from '../views/mypage/review/AddReview'
import Policy from '../views/etc/Policy.vue'
import Package from '../views/goods/Package.vue'
import OrderClaimDetail from '../views/mypage/order/OrderClaimDetail.vue'

export default [
  {
    path: '/',
    name: 'Home',
    redirect: '/m'
  },
  {
    path: '/m',
    name: 'Home',
    components: {
      default: (resolve) => require(['../views/main/Home.vue'], resolve),
      header: Header,
      footer: Footer
    }
  },
  {
    path: '/m/member/login',
    name: 'Login',
    components: {
      default: Login,
      footer: Footer
    },
    meta: {
      notMember: true
    }
  },
  {
    path: '/m/member/joinpage',
    name: 'JoinPage',
    components: {
      default: JoinPage
    },
    meta: {
      notMember: true
    }
  },
  {
    path: '/m/member/join',
    name: 'Join',
    components: {
      default: Join
    },
    meta: {
      notMember: true
    }
  },
  {
    /* 회원가입 > 회원가입 완료 */
    path: '/m/member/join/complete',
    name: 'JoinComplete',
    components: {
      default: JoinComplete
    },
    meta: {
      notMember: true
    }
  },
  {
    /* 회원가입 > 회원가입 이메일 인증 */
    path: '/m/member/join/sendEmail',
    name: 'JoinSendEmail',
    components: {
      default: JoinSendEmail
    },
    meta: {
      notMember: true
    }
  },
  {
    /* SNS 로그인 테스트 */
    path: '/m/member/login/callback/:sns',
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
    /* SNS 로그인 테스트 */
    path: '/m/mypage/profile/callback/:sns',
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
    /* 비밀번호찾기 */
    path: '/m/member/find/password',
    name: 'FindPassword',
    components: {
      default: ResetPassword
    },
    meta: {
      notMember: true
    }
  },
  {
    /* 비밀번호찾기 > 메일 전송 */
    path: '/m/member/find/password/email',
    name: 'FindPassword',
    components: {
      default: ResetPasswordSendEmail
    },
    meta: {
      notMember: true
    }
  },
  {
    /* 비밀번호찾기 > 비밀번호 재설정 */
    path: '/m/member/find/password/result',
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
    path: '/m/member/find/password/success',
    name: 'ResetPassword',
    components: {
      default: ResetPasswordSuccess
    },
    meta: {
      notMember: true
    }
  },
  {
    path: '/m/mypage',
    name: 'Mypage',
    components: {
      default: Mypage,
      header: Header,
      footer: Footer
    },
    meta: {
      needAuth: true
    }
  },
  {
    path: '/m/mypage/cupon/:usable?',
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
    path: '/m/mypage/qa',
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
    path: '/m/mypage/profile',
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
    path: '/m/mypage/hack',
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
    path: '/m/mypage/like',
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
    path: '/m/mypage/myreview',
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
    path: '/m/mypage/inquiry',
    name: 'ProfileInquiry',
    components: {
      header: Header,
      default: ProfileInquiry,
      footer: Footer
    },
    meta: {
      needAuth: true
    }
  },
  {
    path: '/m/mypage/orderdetail/:orderNo(\\d+)',
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
    path: '/m/mypage/cancel/:orderOptionNo(\\d+)',
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
    path: '/m/mypage/orderlist',
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
    path: '/m/mypage/cancellist',
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
    path: '/m/mypage/returndetail/:claimNo(\\d+)',
    name: 'OrderReturnDetail',
    components: {
      default: OrderClaimDetail,
      footer: Footer
    },
    meta: {
      needAuth: true
    }
  },
  {
    path: '/m/mypage/canceldetail/:optionNo(\\d+)',
    name: 'OrderCancelDetail',
    components: {
      default: OrderClaimDetail,
      footer: Footer
    },
    meta: {
      needAuth: true
    }
  },
  {
    path: '/m/mypage/editAddress/:orderNo(\\d+)',
    name: 'EditAddress',
    components: {
      default: EditAddress,
      footer: Footer
    },
    meta: {
      needAuth: true
    }
  },
  {
    path: '/m/mypage/myreview/addreview',
    name: 'AddReview',
    components: {
      default: AddReview,
      header: Header,
      footer: Footer
    },
    meta: {
      needAuth: true
    }
  },
  {
    path: '/m/mypage/myreview/addreview/:reviewno',
    name: 'EditReview',
    components: {
      default: AddReview,
      header: Header,
      footer: Footer
    },
    meta: {
      needAuth: true
    }
  },
  {
    path: '/m/cart',
    name: 'Cart',
    components: {
      default: (resolve) => require(['../views/escrow/Cart.vue'], resolve),
      header: Header,
      footer: Footer
    }
  },
  {
    path: '/m/order/:orderSheetNo(\\d+)',
    name: 'OrderSheet',
    components: {
      default: (resolve) => require(['../views/escrow/OrderSheet.vue'], resolve),
      header: Header,
      footer: Footer
    }
  },
  {
    path: '/m/order/paymentconfirm',
    name: 'PaymentConfirm',
    components: {
      header: Header,
      default: (resolve) => require(['../views/escrow/PaymentConfirmNew.vue'], resolve),
      footer: Footer
    }
  },
  {
    path: '/m/product/detail/:goodsNo',
    name: 'ProductDetail',
    components: {
      default: GoodsDetail,
      header: Header,
      footer: Footer
    }
  },
  {
    path: '/m/product/detail/:goodsNo/package',
    name: 'Package',
    components: {
      default: Package
    }
  },
  {
    path: '/m/product/detail/:goodsNo/inquiry/:inquiryNo?',
    name: 'GoodsInquiryDetail',
    components: {
      default: GoodsInquiryDetail,
      header: Header
    }
  },
  {
    path: '/m/search',
    name: 'Search',
    components: {
      header: Header,
      default: SearchForm
    }
  },
  {
    path: '/m/goods/:categoryNo?/:subCategoryNo?',
    name: 'ProductList',
    components: {
      default: ProductList,
      header: Header,
      footer: Footer
    }
  },
  {
    path: '/m/search/keyword',
    name: 'Result',
    components: {
      default: Result,
      header: Header,
      footer: Footer
    }
  },
  {
    path: '/m/event',
    name: 'EventList',
    components: {
      default: EventList,
      header: Header,
      footer: Footer
    }
  },
  {
    path: '/m/event/:eventNo',
    name: 'EventDetail',
    components: {
      default: EventDetail,
      header: Header,
      footer: Footer
    }
  },
  {
    path: '/m/policy',
    name: 'Policy',
    components: {
      default: Policy,
      header: Header,
      footer: Footer
    }
  },
  {
    path: '/m/etc/faq',
    alias: '/m/etc/faq/search',
    name: 'Faq',
    components: {
      header: Header,
      default: Faq,
      footer: Footer
    }
  },
  {
    /* store */
    path: '/m/others/store',
    name: 'StoreGuide',
    components: {
      header: Header,
      default: StoreGuide,
      footer: Footer
    },
    meta: {
      breadCrumbs: '매장안내',
      title: '매장안내'
    }
  },
  {
    path: '/m/etc/notice',
    name: 'BBSBoard',
    components: {
      header: Header,
      default: BBSBoard,
      footer: Footer
    }
  },
  {
    path: '/m/notice/detail/:articleNo',
    name: 'BBSBoardDetail',
    components: {
      default: BBSBoardDetail
    }
  },
  {
    path: '/m/etc/inquiry',
    name: 'Inquiry',
    components: {
      header: Header,
      default: Inquiry,
      footer: Footer
    },
    meta: {
      needAuth: true
    }
  },
  {
    path: '/m/etc/serviceInspection',
    name: 'ServiceInspection',
    components: {
      default: ServiceInspection
    }
  },
  {
    path: '/m/etc/dataerror',
    name: 'DataError',
    components: {
      default: DataError
    }
  },
  {
    path: '/m/*',
    name: 'NotFound',
    components: {
      default: NotFound
    }
  }
]
