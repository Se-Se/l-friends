import { asyncComponent, asyncComponentHeader, asyncComponentFooter } from './utils'

export default [
  {
    path: '/',
    name: 'MainHome',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/Main'),
      footer: asyncComponentFooter()
    },
    meta: {
      action: true
    }
  },
  {
    path: '/event',
    name: 'Event',
    components: {
      // header: EventHeader,
      header: asyncComponentHeader(),
      default: asyncComponent('pages/eventView/EventListNew'),
      footer: asyncComponentFooter()
    },
    meta: {
      action: true,
      title: '프로모션',
      breadCrumbs: '프로모션'
    }
  },
  {
    path: '/event/:eventNo',
    name: 'EventDetail',
    components: {
      // header: EventHeader,
      header: asyncComponentHeader(),
      default: asyncComponent('pages/eventView/EventViewNew'),
      footer: asyncComponentFooter()
    },
    meta: {
      action: true,
      breadCrumbs: '프로모션 상세',
      title: '프로모션'
    }
  },
  { /* 장바구니 */
    path: '/cart',
    name: 'Cart',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/Cart'),
      footer: asyncComponentFooter()
    },
    meta: {
      action: true,
      breadCrumbs: '장바구니',
      title: '장바구니'
    }
  },
  { /* 비밀번호찾기 */
    path: '/member/find/password',
    name: 'FindPassword',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/member/ResetPassword'),
      footer: asyncComponentFooter()
    },
    meta: {
      notMember: true,
      hideHeader: true,
      hideFooter: true,
      breadCrumbs: '비밀번호 찾기',
      title: '비밀번호 찾기'
    }
  },
  { /* 비밀번호찾기 > 메일 전송 */
    path: '/member/find/password/email',
    name: 'FindPassword',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/member/ResetPasswordSendEmail'),
      footer: asyncComponentFooter()
    },
    meta: {
      notMember: true,
      hideHeader: true,
      hideFooter: true,
      breadCrumbs: '메일 전송',
      title: '비밀번호 찾기'
    }
  },
  { /* 비밀번호찾기 > 비밀번호 재설정 */
    path: '/member/find/password/result',
    name: 'ResetPassword',
    components: {
      // header: asyncComponentHeader(),
      default: asyncComponent('pages/member/ResetPasswordResult')
      // footer: asyncComponentFooter()
    },
    meta: {
      notMember: true,
      hideHeader: true,
      breadCrumbs: '비밀번호 재설정',
      title: '비밀번호 찾기'
    }
  },
  { /* 비밀번호찾기 > 비밀번호 재설정 > 완료 */
    path: '/member/find/password/success',
    name: 'ResetPassword',
    components: {
      // header: asyncComponentHeader(),
      default: asyncComponent('pages/member/ResetPasswordSuccess')
      // footer: asyncComponentFooter()
    },
    meta: {
      notMember: true,
      hideHeader: true,
      breadCrumbs: '비밀번호 재설정 완료',
      title: '비밀번호 찾기'
    }
  },
  { /* 로그인 */
    path: '/member/login',
    name: 'Login',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/member/Login'),
      footer: asyncComponentFooter()
    },
    meta: {
      notMember: true,
      hideHeader: true,
      breadCrumbs: '로그인',
      title: '로그인'
    }
  },
  { /* SNS 로그인 테스트 */
    path: '/member/login/callback/:sns',
    name: 'SNSLogin',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/member/Login'),
      footer: asyncComponentFooter()
    },
    meta: {
      notMember: true,
      hideHeader: true,
      breadCrumbs: 'SNS 로그인'
    }
  },
  { /* 회원가입 > 이용동의 > Mobile 전용 */
    path: '/member/join/terms',
    name: 'Join',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/member/Terms'),
      footer: asyncComponentFooter()
    },
    meta: {
      notMember: true,
      hideHeader: true,
      hideFooter: true,
      breadCrumbs: '이용동의',
      title: '회원가입'
    }
  },
  { /* 회원가입 > 이용동의 > 전문보기 Mobile 전용 */
    path: '/member/join/terms/:term',
    name: 'term',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/member/TermsDetail'),
      footer: asyncComponentFooter()
    },
    meta: {
      notMember: true,
      hideHeader: true,
      hideFooter: true,
      breadCrumbs: '이용동의',
      title: '회원가입'
    }
  },
  { /* 회원가입 > 메인 */
    path: '/member/join',
    name: 'Join',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/member/Join'),
      footer: asyncComponentFooter()
    },
    meta: {
      notMember: true,
      hideHeader: true,
      hideFooter: true,
      breadCrumbs: '회원가입',
      title: '회원가입'
    }
  },
  { /* 회원가입 > 회원가입 이메일 인증 */
    path: '/member/join/sendEmail',
    name: 'JoinSendEmail',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/member/JoinSendEmail'),
      footer: asyncComponentFooter()
    },
    meta: {
      notMember: true,
      hideHeader: true,
      hideFooter: true,
      breadCrumbs: '이메일 인증',
      title: '이메일인증'
    }
  },
  { /* 회원가입 > 회원가입 완료 */
    path: '/member/join/complate',
    name: 'Join',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/member/JoinComplete'),
      footer: asyncComponentFooter()
    },
    meta: {
      notMember: true,
      hideHeader: true,
      hideFooter: true,
      breadCrumbs: '회원가입 완료',
      title: '회원가입완료'
    }
  },
  { /* 마이페이지 */
    path: '/mypage',
    name: 'MyPage',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/mypage/index'),
      footer: asyncComponentFooter()
    },
    meta: {
      title: '마이페이지',
      action: true,
      needAuth: true,
      breadCrumbs: '마이페이지'
    },
    children: [
      { /* 임직원 포인트 */
        path: 'welfare',
        name: 'Welfare',
        component: asyncComponent('pages/mypage/ExecutivesPoint'),
        meta: {
          action: true,
          breadCrumbs: '임직원 포인트',
          title: '임직원 포인트'
        }
      },
      { /* 회원정보수정 비밀번호 인증 */
        path: 'passwordConfirm',
        name: 'PasswordConfirm',
        component: asyncComponent('pages/mypage/PasswordConfirm'),
        meta: {
          tab: 'order',
          needAuth: true,
          breadCrumbs: '개인정보수정',
          title: '개인정보수정'
        }
      },
      { /* 회원정보수정 */
        path: 'profile',
        name: 'Profile',
        component: asyncComponent('pages/mypage/Profile'),
        meta: {
          tab: 'order',
          needAuth: true,
          breadCrumbs: '회원정보 수정',
          title: '회원정보 수정'
        }
      },
      {
        path: 'hack',
        name: 'Hack',
        component: asyncComponent('pages/mypage/Withdrawal'),
        meta: {
          tab: 'order',
          needAuth: true,
          breadCrumbs: '회원탈퇴',
          title: '회원탈퇴'
        }
      },
      { /* SNS 계정 연동 */
        path: 'profile/callback/:sns',
        name: 'SNSConnect',
        component: asyncComponent('pages/mypage/Profile'),
        meta: {
          tab: 'order',
          needAuth: true,
          breadCrumbs: 'SNS 계정 연동',
          title: 'SNS 계정 연동'
        }
      },
      { /* 주문 배송 */
        path: 'orderlist',
        name: 'OrderList',
        component: asyncComponent('pages/mypage/order/list/OrderListNew'),
        meta: {
          tab: 'order',
          action: true,
          needAuth: true,
          breadCrumbs: '주문 배송',
          title: '주문 배송'
        }
      },
      {
        path: 'cancellist',
        name: 'CancelList',
        component: asyncComponent('pages/mypage/order/list/CancelListNew'),
        meta: {
          action: true,
          tab: 'cancel',
          breadCrumbs: '취소반품',
          title: '취소반품'
        }
      },
      {
        path: 'cancel/:orderOptionNo(\\d+)',
        name: 'OrderClaimCancel',
        components: {
          default: asyncComponent('pages/mypage/order/claim/OrderClaimRefundNew'),
          header: asyncComponentHeader(),
          footer: asyncComponentFooter()
        },
        meta: {
          needAuth: true,
          action: true,
          breadCrumbs: '환불',
          title: '환불'
        }
      },
      {
        path: 'orderdetail/:orderNo(\\d+)',
        name: 'OrderDetail',
        component: asyncComponent('pages/mypage/order/detail/OrderDetailNew'),
        meta: {
          action: true,
          tab: 'order',
          breadCrumbs: '주문배송 상세',
          title: '주문배송 상세'
        }
      },
      {
        path: 'returndetail/:claimNo(\\d+)',
        name: 'OrderReturnDetailNew',
        component: asyncComponent('pages/mypage/order/claim/OrderClaimDetailNew'),
        meta: {
          needAuth: true
        }
      },
      {
        path: 'canceldetail/:optionNo(\\d+)',
        name: 'OrderCancelDetailNew',
        component: asyncComponent('pages/mypage/order/claim/OrderClaimDetailNew'),
        meta: {
          needAuth: true
        }
      },
      {
        path: 'return/:orderOptionNo(\\d+)',
        name: 'OrderClaimReturn',
        components: {
          default: asyncComponent('pages/mypage/order/claim/OrderClaimRefundNew'),
          header: asyncComponentHeader(),
          footer: asyncComponentFooter()
        },
        meta: {
          needAuth: true,
          action: true,
          breadCrumbs: '취소반품 상세'
        }
      },
      {
        path: 'mycoupon',
        name: 'ValidCoupon',
        components: {
          default: asyncComponent('pages/mypage/coupon/ValidCouponNew'),
          header: asyncComponentHeader(),
          footer: asyncComponentFooter()
        },
        meta: {
          action: true,
          tab: 'coupon',
          breadCrumbs: '쿠폰함'
        }
      },
      {
        path: 'novalidcoupon',
        name: 'NoValidCoupon',
        components: {
          default: asyncComponent('pages/mypage/coupon/NoValidCouponNew'),
          header: asyncComponentHeader(),
          footer: asyncComponentFooter()
        },
        meta: {
          action: true,
          tab: 'coupon',
          breadCrumbs: '쿠폰함'
        }
      },
      {
        path: 'myreview',
        components: {
          default: asyncComponent('pages/mypage/review/MyReviewNew'),
          header: asyncComponentHeader(),
          footer: asyncComponentFooter()
        },
        meta: {
          action: true,
          tab: 'review',
          commonName: 'myreview',
          breadCrumbs: '상품평'
        },
        children: [
          {
            path: '/mypage/myreview/write/:reviewno',
            name: 'MyReviewableWrite',
            component: asyncComponent('mypage/ReviewNew'),
            meta: {
              action: true,
              tab: 'review',
              commonName: 'myreview',
              breadCrumbs: '상품평'
            }
          },
          {
            path: '/',
            name: 'MyReviewable',
            component: asyncComponent('pages/mypage/review/MyReviewableNew'),
            meta: {
              action: true,
              tab: 'review',
              commonName: 'myreview',
              breadCrumbs: '상품평'
            }
          },
          {
            path: 'myreviews',
            name: 'MyReviews',
            component: asyncComponent('pages/mypage/review/MyReviewsNew'),
            meta: {
              action: true,
              tab: 'review',
              commonName: 'myreview',
              breadCrumbs: '상품평'
            }
          }
        ]
      },
      {
        path: 'myproductinquires',
        name: 'MyProductInquirys',
        component: asyncComponent('pages/mypage/productinquiry/ProductInquiryNew'),
        meta: {
          action: true,
          breadCrumbs: '상품문의',
          title: '상품문의'
        }
      },
      {
        path: 'inquiry',
        name: 'ProfileInquiries',
        components: {
          header: asyncComponentHeader(),
          default: asyncComponent('pages/mypage/inquiry/InquiryNew'),
          footer: asyncComponentFooter()
        },
        meta: {
          title: '1:1문의',
          action: true,
          tab: 'inquiry',
          breadCrumbs: '1:1문의'
        }
      },
      {
        path: 'inquiry/write',
        name: 'ProfileInquiryNew',
        components: {
          header: asyncComponentHeader(),
          default: asyncComponent('pages/mypage/inquiry/ProfileInquiryNew'),
          footer: asyncComponentFooter()
        },
        meta: {
          title: '1:1문의',
          breadCrumbs: '1:1문의'
        }
      },
      {
        path: 'like',
        name: 'LikeProducts',
        component: asyncComponent('pages/mypage/like/LikeNew'),
        meta: {
          action: true,
          breadCrumbs: '찜한 상품',
          title: '찜한 상품'
        }
      }
      /*
      {
        path: 'member/setting',
        name: 'MemberSetting',
        component: asyncComponent('mypage/member/SettingNew'),
        meta: {
          action: true,
          tab: 'member'
        }
      },
      {
        path: 'member/reset',
        name: 'MemberReset',
        component: asyncComponent('mypage/member/Reset')
      },
      {
        path: 'member/withdrawal',
        name: 'MemberWithdrawal',
        component: asyncComponent('mypage/member/WithdrawalNew')
      }
      */
    ]
  },
  { /* 주문서 작성 */
    path: '/order/:orderSheetNo(\\d+)',
    name: 'OrderSheet',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/order/OrderSheetNew'),
      footer: asyncComponentFooter()
    },
    meta: {
      action: true,
      breadCrumbs: '주문',
      title: '주문'
    }
  },
  {
    path: '/order/getsheetno',
    name: 'BeforeOrder',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/order/BeforeOrder'),
      footer: asyncComponentFooter()
    },
    meta: {
      needAuth: true,
      action: true,
      title: '주문'
    }
  },
  {
    path: '/order/paymentconfirm',
    name: 'PaymentConfirm',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/order/PaymentConfirmNew'),
      footer: asyncComponentFooter()
    },
    meta: {
      action: true,
      breadCrumbs: '주문',
      title: '주문'
    }
  },
  { /* 상품 상세 */
    path: '/goods/detail/:goodsNo?',
    name: 'GoodsDetail',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/goods/GoodsDetail'),
      footer: asyncComponentFooter()
    },
    meta: {
      action: true
    }
  },
  { /* 상품 문의 */
    path: '/goods/detail/:goodsNo/inquiry/:inquiryNo?',
    name: 'GoodsInquiry',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/goods/GoodsInquiry'),
      footer: asyncComponentFooter()
    },
    meta: {
      hideHeader: true,
      hideFooter: true
    }
  },
  { /* 상품 리뷰 */
    path: '/goods/detail/:goodsNo/review/:reviewNo?',
    name: 'GoodsInquiry',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/mypage/review/leaf/AddReviewNew'),
      footer: asyncComponentFooter()
    },
    meta: {
      hideHeader: true,
      hideFooter: true
    }
  },
  { /* 상품 검색 */
    path: '/goods/search',
    name: 'Search',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/search/Search'),
      footer: asyncComponentFooter()
    },
    meta: {
      hideHeader: false,
      hideFooter: true,
      action: true,
      search: true,
      needAuth: false,
      breadCrumbs: '검색어'
    }
  },
  { /* 브랜드 검색 */
    path: '/goods/brand',
    name: 'BrandSelect',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/goods/BrandSelect'),
      footer: asyncComponentFooter()
    },
    meta: {
      hideHeader: true,
      hideFooter: true
    }
  },
  {
    path: '/notice/list',
    name: 'BBSBoard',
    components: {
      default: asyncComponent('pages/notice/BBSBoard'),
      header: asyncComponentHeader(),
      footer: asyncComponentFooter()
    },
    meta: {
      needAuth: false,
      action: true,
      breadCrumbs: '공지사항',
      title: '공지사항'
    }
  },
  {
    path: '/notice/detail/:articleNo',
    name: 'BBSBoardDetail',
    components: {
      default: asyncComponent('pages/notice/BBSBoardDetail'),
      header: asyncComponentHeader(),
      footer: asyncComponentFooter()
    },
    meta: {
      needAuth: false,
      action: true,
      breadCrumbs: '공지사항',
      title: '공지사항'
    }
  },
  { /* 상품 리스트 ( 세일 ) */
    path: '/goods/sale',
    name: 'GoodsSaleList',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/goods/GoodsList'),
      footer: asyncComponentFooter()
    },
    meta: {
      action: true,
      title: '세일'
    }
  },
  { /* 상품 리스트 */
    path: '/goods/:depth1No/:depth2No?',
    name: 'GoodsList',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/goods/GoodsList'),
      footer: asyncComponentFooter()
    },
    meta: {
      action: true
    }
  },
  { /* 상품 리스트 ( 전체 ) */
    path: '/goods',
    name: 'GoodsList',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/goods/GoodsList'),
      footer: asyncComponentFooter()
    },
    meta: {
      action: true,
      showTopBanner: true,
      title: '전체'
    }
  },
  {
    /* 약관 > 개인정보처리 방침 */
    path: '/policy/privacy',
    name: 'Privacy',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/policy/privacy'),
      footer: asyncComponentFooter()
    },
    meta: {
      action: true,
      breadCrumbs: '개인정보처리 방침'
    }
  },
  {
    /* 약관 > 이용약관 */
    path: '/policy/terms',
    name: 'Terms',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/policy/terms'),
      footer: asyncComponentFooter()
    },
    meta: {
      action: true,
      breadCrumbs: '이용약관'
    }
  },
  {
    /* 기타 > 매장안내 */
    path: '/others/stores',
    name: 'Store',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/others/Store'),
      footer: asyncComponentFooter()
    },
    meta: {
      breadCrumbs: '매장안내',
      title: '매장안내'
    }
  },
  {
    /* 기타 > BT21 */
    path: '/others/bt21',
    name: 'Bt21',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/others/CharacterBt21'),
      footer: asyncComponentFooter()
    },
    meta: {
      breadCrumbs: 'BT21',
      title: 'BT21'
    }
  },
  {
    /* 기타 > 쿠폰안내 */
    path: '/others/couponguides/:eventNo',
    name: 'CouponGuides',
    components: {
      default: asyncComponent('pages/others/CouponGuide'),
      footer: asyncComponentFooter()
    },
    meta: {
      breadCrumbs: '쿠폰 안내',
      title: '쿠폰 안내'
    }
  },
  {
    /* 기타 > 브라운앤프렌즈 */
    path: '/others/brown',
    name: 'Brown',
    components: {
      header: asyncComponentHeader(),
      default: asyncComponent('pages/others/CharacterFriends'),
      footer: asyncComponentFooter()
    },
    meta: {
      breadCrumbs: '브라운앤프렌즈',
      title: '브라운앤프렌즈'
    }
  },
  {
    path: '/etc/faq',
    alias: '/etc/faq/search',
    name: 'Faq',
    components: {
      default: asyncComponent('pages/etc/FaqNew'),
      header: asyncComponentHeader(),
      footer: asyncComponentFooter()
    },
    meta: {
      needAuth: false,
      action: true,
      breadCrumbs: '고객센터',
      title: 'FAQ'
    }
  },
  {
    path: '/pagenotfound',
    name: '404',
    components: {
      default: asyncComponent('pages/others/ServiceError')
    }
  },
  {
    path: '/service',
    name: 'service',
    components: {
      default: asyncComponent('pages/others/ServiceChecking')
    }
  },
  { // 리뉴얼페이지
    path: '/renewal',
    name: 'renewal',
    components: {
      default: asyncComponent('pages/others/Renewal')
    },
    meta: {
      title: '리뉴얼안내'
    }
  },
  {
    path: '*',
    components: {
      default: asyncComponent('pages/others/ServiceError')
    }
  }
]
