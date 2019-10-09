import router from '@/router'
import cookies from 'js-cookie'
import ncpApi from '@/api/ncpApi'
import config from '@/config/index'
import { goUrl } from '@/utils/urlUtils'

async function getCookieCarts () {
  const items = JSON.parse(window.localStorage.cartInfo || '[]')
  if (items.length > 0) {
    return this.dispatch('cart/addToCart', { carts: items, integrated: true }).then(res => {
      delete window.localStorage.cartInfo
    })
  }
  return Promise.resolve()
}

export default {
  backOrClose () {
    router.back() // TODO: back or close or to main....
  },
  saveLogin ({ dispatch, state }, { code, token, nxturl }) {
    cookies.set('accessToken', token)
    dispatch('paycoTokenLoginForWEB', { code, nxturl })
  },
  whatupSaveLogin ({ dispatch, state }, { openAccessToken }) {
    dispatch('whatupTokenLoginForWEB', { openAccessToken })
  },
  goLogin ({ dispatch, state }) {
    goUrl('/member/login')
  },
  paycoTokenLoginForWEB ({ dispatch, state }, { code, nxturl }) {
    dispatch('authentication/paycoCode2AccessToken', { code, nxturl }).then(function () {
      if (state.authentication.openid.accessToken) {
        cookies.set('ncpAccessToken', state.authentication.openid.accessToken, { 'max-age': state.authentication.openid.expireIn })
        ncpApi.defaults.headers.accessToken = state.authentication.openid.accessToken
        dispatch('afterLogined', { nxturl })
      } else {
        goUrl('/member/login?code=' + state.authentication.openid.dormantMemberResponse.code)
      }
    })
  },
  whatupTokenLoginForWEB ({ dispatch, state }, { openAccessToken }) {
    dispatch('authentication/whatupCode2AccessToken', { openAccessToken }).then(function () {
      if (state.authentication.openid.accessToken) {
        cookies.set('ncpAccessToken', state.authentication.openid.accessToken, { 'max-age': state.authentication.openid.expireIn })
        ncpApi.defaults.headers.accessToken = state.authentication.openid.accessToken
        dispatch('afterLogined', {})
      } else {
        window.location.href = config.whatupLogout
      }
    })
  },
  afterLogined ({ dispatch, state }, { nxturl }) {
    if (!nxturl || nxturl === '' || nxturl === 'undefined') {
      nxturl = '/'
    }
    dispatch('profile/memberFetch').then(() => {
      const memberStatus = cookies.get('memberStatus')
      if (memberStatus === 'WAITING') {
        goUrl('/member/agreement?nxturl=' + nxturl)
      } else {
        return dispatch('authentication/fetchShopAgreement').then(() => {
          return getCookieCarts.call(this)
        }).then(() => {
          goUrl(nxturl)
        })
      }
    })
  },
  login ({ dispatch, state }) {
    let url = state.route.query.redirect
    router.push('/member/login')
  },
  join ({ dispatch, state }) {
    let url = state.route.query.redirect
    window.open(config.paycoJoinUrl(url))
  },
  paycoCertify ({ dispatch, state }, { nxturl }) {
    dispatch('profile/paycoSync').then(() => {
      window.location.href = nxturl
    })
  }
}
