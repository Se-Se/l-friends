// config for alpha

import productionConfig from './prod'
import { isPC } from '@/utils/utils'
import brands from './dev-brands'

export default {
  ...productionConfig,
  // ncpApiBaseUrl: 'https://api-gw.cloud.toast.com/alpha-ncp/',
  ncpApiBaseUrl: 'https://alpha-api.e-ncp.com/',
  ncpClientId: 'rOGMpJonBZlBP+RobdegBQ==',
  platform: isPC() ? 'PC' : 'MOBILE_WEB',
  pinkdiaryApiBaseUrl: 'https://dev.3wpinkdiary.com/api_bo/',
  paycoAuthorizeUrl: 'https://alpha-id.payco.com/oauth2.0/authorize',
  paycoAuthorizeJoinUrl: 'https://alpha-id.payco.com/join.nhn',
  paycoClientId: 'ALPi7p0YAW7lEBR2WHzc',
  paycoCertifyLogin: 'https://alpha-id.payco.com/certifyLogin.nhn',
  paycoMyinfo: 'https://alpha-id.payco.com/myinfo.nhn',
  paycoChangPwd: 'https://alpha-id.payco.com/myInfoChangePwd.nhn',
  paycoPersonalInfo: 'https://alpha-member.nhnent.com/personalInfoUsageDetail',
  paycoPrivacy: 'https://alpha-member.nhnent.com/provision/privacy',
  whatupLogin: 'https://dev-cas.nhnent.com/login?service=https://alpha-www.paycobizmall.com/whatupLoginCallback',
  whatupLogout: 'https://dev-cas.nhnent.com/logout?service=https://alpha-www.paycobizmall.com/whatupLogoutCallback',
  /* FAQ */
  faqBoardNo: '1083',
  /* NOTICE */
  noticeBoardNo: '1030',
  boardNo: {
    notice: '1030'
  },
  /* 상품섹션 */
  newBrownSectionNo: 316,
  newBT21SectionNo: 317,
  chimmyEventSectionNo: 282,
  newEventNo: 235,
  chimmyEventNo: 236,
  /* 오늘의 특가 */
  bestSectionNo: 280,
  pinkSectionNo: '9',
  /* 프로모션 배너 */
  promotionBannerCode: { pc: '012', mobile: '013' },
  /* 브랜드 탭 배너 */
  brandBannerCode: { pc: '006', mobile: '006' },
  /* 카테고리 홈 배너 */
  categoryBannerCode: { pc: '006', mobile: '006' },
  /* 메인 최상단 띠 배너 */
  mainTopBannerCode: { pc: '008', mobile: '004' },
  /* 메인 인기 배너 */
  mainHotBannerCode: { pc: '000', mobile: '005' },
  /* 메인 하프 배너 */
  mainHalfBannerCode: { pc: '002', mobile: '006' },
  /* 메인 슬라이드 배너 */
  mainSlideBannerCode: { pc: '003', mobile: '009' },
  /* 이벤트 카로셀 배너 */
  eventCarouselBannerCode: { pc: '006', mobile: '006' },
  /* 이벤트 메인 */
  eventMainBannerCode: { pc: '006', mobile: '006' },
  /* 전체 카테고리 띠배너 */
  allCategoryBanner: { pc: '010', mobile: '011' },
  /* My Page Top Banner */
  myPageTopBannerCode: { pc: '006', mobile: '006' },
  /* My Page Bottom Banner */
  myPageBottomBannerCode: { pc: '006', mobile: '006' },
  payJs: 'ncp_pay_sandbox.js',
  searchJs: 'ncp_search_sandbox.js',
  /* 사내 이벤트 */
  internalEventPath: '/event/126',
  internalProductNos: ['101713791', '101714100', '101713278', '101714091', '101714101', '101713279'],
  /* 추석 이벤트 */
  chuseokEventNo: '156',
  /* 임직원 */
  executives: ['2495', '2496', '2497', '2498', '2499', '2500', '2507'],
  /* SNS */
  sns: {
    naver: {
      ci: 'OjMta4AQBAlercF_PE1v',
      cs: 'uruH9ESCCu'
    },
    facebook: {
      ci: '596319600852860',
      cs: '32b182b941c736689b9d151ac4bc487'
    }
  },
  brands
}
