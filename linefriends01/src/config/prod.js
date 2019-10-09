import { isPC } from '@/utils/utils'
import brands from './prod-brands'

// config for production
export default {
  // ncpApiBaseUrl: 'https://api-gw.cloud.toast.com/ncp/',
  // ncpApiBaseUrl: 'https://apis.krp.toastoven.net/ncp/openapi/',
  ncpApiBaseUrl: 'https://api.e-ncp.com/',
  ncpClientId: 'o2Rq8FbOSrnJCB4NG7u6kA==',
  platform: isPC() ? 'PC' : 'MOBILE_WEB',
  pinkdiaryApiBaseUrl: 'https://3wpinkdiary.com/api_bo/',
  paycoAuthorizeUrl: 'https://id.payco.com/oauth2.0/authorize',
  paycoAuthorizeJoinUrl: 'https://id.payco.com/join.nhn',
  paycoClientId: 'dboVqN11pzGIAp2gva2X',
  paycoCertifyLogin: 'https://id.payco.com/certifyLogin.nhn',
  paycoMyinfo: 'https://id.payco.com/myinfo.nhn',
  paycoChangPwd: 'https://id.payco.com/myInfoChangePwd.nhn',
  paycoPersonalInfo: 'https://member.nhnent.com/personalInfoUsageDetail',
  paycoPrivacy: 'https://member.nhnent.com/provision/privacy',
  oldPingdamall: 'http://old.pingdamall.com',
  oldPdmall: 'http://old.pdmall.buywow.co.kr',
  whatupLogin: 'https://cas.nhnent.com/login?service=https://www.paycobizmall.com/whatupLoginCallback',
  whatupLogout: 'https://cas.nhnent.com/logout?service=https://www.paycobizmall.com/whatupLogoutCallback',
  /* FAQ */
  faqBoardNo: '25720',
  /* NOTICE */
  noticeBoardNo: '25857',
  /* FAQ */
  boardNo: {
    notice: '25857'
  },
  /* 상품섹션 */
  newBrownSectionNo: 10453,
  newBT21SectionNo: 10454,
  chimmyEventSectionNo: 10455,
  newEventNo: 235,
  chimmyEventNo: 236,
  /* 오늘의 특가 */
  bestSectionNo: 280,
  pinkSectionNo: '9',
  /* 프로모션 배너 */
  promotionBannerCode: { pc: '010', mobile: '011' },
  /* 브랜드 탭 배너 */
  brandBannerCode: { pc: '006', mobile: '006' },
  /* 카테고리 홈 배너 */
  categoryBannerCode: { pc: '006', mobile: '006' },
  /* 메인 최상단 띠 배너 */
  mainTopBannerCode: { pc: '001', mobile: '006' },
  /* 메인 인기 배너 */
  mainHotBannerCode: { pc: '002', mobile: '007' },
  /* 메인 하프 배너 */
  mainHalfBannerCode: { pc: '003', mobile: '008' },
  /* 메인 슬라이드 배너 */
  mainSlideBannerCode: { pc: '000', mobile: '005' },
  /* 이벤트 카로셀 배너 */
  eventCarouselBannerCode: { pc: '006', mobile: '006' },
  /* 이벤트 메인 */
  eventMainBannerCode: { pc: '006', mobile: '006' },
  /* 전체 카테고리 띠배너 */
  allCategoryBanner: { pc: '004', mobile: '009' },
  /* My Page Top Banner */
  myPageTopBannerCode: { pc: '006', mobile: '006' },
  /* My Page Bottom Banner */
  myPageBottomBannerCode: { pc: '006', mobile: '006' },
  payJs: 'ncp_pay.js',
  searchJs: 'ncp_search.js',
  /* 사내 이벤트 */
  internalEventPath: '/event/263',
  internalProductNos: ['100520256', '100520255', '100520238', '100520232', '100520241', '100520240', '100520242', '100520243', '100520239', '100520262', '100520257', '100520258', '100520263', '100520265', '100520266', '100520251', '100520253', '100520254', '100520252', '100520230', '100520234', '100520235', '100520236', '100520267', '100520229', '100520244', '100520245', '100520250', '100520249', '100520272', '100520248', '100520273'],
  /* 추석 이벤트 */
  chuseokEventNo: '349',
  /* 임직원 */
  executives: ['2626', '2628', '2629', '2630', '2631', '2632', '2633', '2634', '2636'],
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
