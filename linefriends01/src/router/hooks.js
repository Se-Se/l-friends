import store from '@/store'
// import trackGA from '@/utils/analytics'
import cookies from 'js-cookie'
import router from '@/router'

export function setDocumentTitle (to, from, next) {
  if (to.name !== 'GoodsDetail') {
    if (to.meta.title) {
      document.title = to.meta.title + ' - LINE FRIENDS'
    } else {
      document.title = 'LINE FRIENDS'
    }
    if (to.name === 'Search') {
      document.title = to.query.keyword + ' - LINE FRIENDS'
    }
  }
}

export function auth (to, from, next) {
  if (to.matched.some(record => record.meta.needAuth)) {
    if (!store.getters.isLogined) {
      router.push({
        path: '/member/login',
        query: {
          redirect: `${location.protocol}//${location.host}${to.fullPath}`
        }
      })
    } else {
      next()
    }
  } else {
    if (to.matched.some(record => record.meta.notMember)) {
      if (store.getters.isLogined) {
        router.push({
          path: '/'
        })
      } else {
        next()
      }
    } else {
      next()
    }
  }
}

export function beforePageAction (to, from, next) {
  if (to.name === 'JoinSendEmail') {
    if (!to.query.email || cookies.get('authJoin') !== to.query.email) {
      router.replace({
        path: '/'
      })
    } else {
      next()
    }
  }

  if (to.name === 'Profile') {
    if (!cookies.get('authProfile')) {
      window.location.href = '/mypage/passwordConfirm'
    }
  }
  next()
}

export async function dispatchAction (to, from, next) {
  await store.dispatch('profile/memberFetch')

  let promises = [
    store.dispatch('categories/fetchForCate', to),
    store.dispatch('common/fetchMalls'),
    store.dispatch('cart/fetchCartCount'),
    store.dispatch('recent/fetchRecentGoods')
  ]

  if (to.meta.action) {
    promises.push(store.dispatch(`beforeEnter${to.name}`, { to, from }))
  }

  Promise.all(promises).then(next)
}

export function resetSearchWordInfo (to, from, next) {
  // out search
  if (from.meta.search && !to.meta.search) {
    window.NCPSearch.resetSearchWordInfo()
  }
}

/* Loading the script in every page */
export function loadAceCounter (to, from) {
  /* eslint-disable */

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-142988644-1')
  /*
  var _AceTM = (_AceTM || {});
  if (cookies.get('ncpAccessToken') && cookies.get('ncpAccessToken').length > 0) {
    store.dispatch('profile/getProfileForAceTM').then(res => {
      _AceTM.Login = {
        uID: res.uID, 	// 로그인사용자 고유값
        uAge: res.uAge,   	// 로그인사용자 나이
        uGender: res.uGender, // 로그인사용자 성별(man | woman)
        uGroup1: '',	// 사용자 정의변수 1 ( 1 ~ 10 정수값)
        uGroup2: '',	// 사용자 정의변수 2 ( 1 ~ 10 정수값)
        uGroup3: ''	// 사용자 정의변수 3 ( 1 ~ 10 정수값)
      }
    })
  }
  */
  // <!--AceCounter Plus Login variable End -->
}

/* 모바일 페이지 팝업 열려있는지 체크, 열려있으면 닫힘 처리 */
export function pagePopupCheck (to, from, next) {
  if (store.getters['pagePopup/isExistsOpenPopup']) {
    store.dispatch('pagePopup/closeAllPopups')
    next(false)
  } else {
    store.commit('pagePopup/resetPopups')
    next()
  }
}
