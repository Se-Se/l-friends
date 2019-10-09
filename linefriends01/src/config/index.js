let config = {}

if (process.env.BUILD_ENV === 'prod') {
  config = require('./prod').default
}
if (process.env.BUILD_ENV === 'alpha') {
  config = require('./alpha').default
  // config = require('./dev').default
}
if (process.env.BUILD_ENV === 'dev') {
  config = require('./dev').default
}

config.paycoLoginUrl = function (nextUrl) {
  const params = {
    response_type: 'code',
    client_id: config.paycoClientId,
    state: 'null',
    serviceProviderCode: 'PINK',
    redirect_uri: `${location.protocol}//${location.host}/logincallback?nxturl=${nextUrl}`,
    termsYN: 'Y'
  }
  const queryStr = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&')
  return `${config.paycoAuthorizeUrl}?${queryStr}`
}

config.paycoJoinUrl = function (nextUrl) {
  const params = {
    serviceProviderCode: 'PINK',
    svcType: 'APP',
    serviceOfferYn: 'Y',
    migrationCode: '',
    smsAuthInfoYn: '',
    client_id: config.paycoClientId,
    serviceClientId: config.paycoClientId,
    nextURL: '',
    response_type: 'code',
    state: 'null',
    redirect_uri: `${location.protocol}//${location.host}/logincallback?nxturl=${nextUrl}`,
    loginUrl: config.paycoLoginUrl(nextUrl)
  }
  const queryStr = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&')
  return `${config.paycoAuthorizeJoinUrl}?${queryStr}`
}

config.paycoCertifyUrl = function (nextUrl) {
  const params = {
    serviceProviderCode: 'PINK',
    m: 'certifyIndividual',
    nextURL: nextUrl,
    usageCode: 'EASY_PAYMENT'
  }
  const queryStr = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&')
  return `${config.paycoCertifyLogin}?${queryStr}`
}

config.paycoMyinfoUrl = function () {
  const svcType = 'WEB'
  const viewType = 'payco_web_mobile'
  const params = {
    serviceProviderCode: 'PINK',
    nextURL: '',
    svcType: svcType,
    viewType: viewType
  }
  const queryStr = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&')
  return `${config.paycoMyinfo}?${queryStr}`
}

config.paycoChangPwdUrl = function () {
  const svcType = 'WEB'
  const params = {
    popUp: 'true',
    serviceProviderCode: 'PINK',
    retUrl: '',
    svcType: svcType
  }
  const queryStr = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&')
  return `${config.paycoChangPwd}?${queryStr}`
}
export default config
