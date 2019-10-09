import cookies from 'js-cookie'

export default {
  getDeviceMode () {
    return cookies.get('useDeviceMode')
  },
  osType () {
    return 'WEB'
  },
  ncpAccessToken () {
    return cookies.get('ncpAccessToken')
  },
  paycoToken () {
    return cookies.get('accessToken')
  },
  memberStatus () {
    return cookies.get('memberStatus')
  },
  ncpCertificated () {
    return cookies.get('ncpCertificated') === 'true'
  },
  ncpMemberAgree () {
    return cookies.get('memberStatus') === 'ACTIVE'
  },
  memberIsLogin () {
    return cookies.get('ncpAccessToken') !== undefined && cookies.get('ncpAccessToken').length > 0
  },
  isLogined (state, getter) {
    if (getter.ncpAccessToken === undefined || getter.ncpAccessToken === '') {
      return false
    }
    return true
  }
}
