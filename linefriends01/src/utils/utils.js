import cookies from 'js-cookie'
import { deleteOrderInfoInStorage } from './orderUtils'

export function hasClass (elem, cls) {
  cls = cls || ''
  if (cls.replace(/\s/g, '').length === 0) return false
  return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ')
}

export function addClass (elem, cls) {
  if (!hasClass(elem, cls)) {
    elem.className = elem.className === '' ? cls : elem.className + ' ' + cls
  }
}

export function removeClass (elem, cls) {
  if (hasClass(elem, cls)) {
    let newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' '
    while (newClass.indexOf(' ' + cls + ' ') >= 0) {
      newClass = newClass.replace(' ' + cls + ' ', ' ')
    }
    elem.className = newClass.replace(/^\s+|\s+$/g, '')
  }
}

export function miliFormat (num) {
  return num && num.toString().replace(/(?=(?!^)(\d{3})+$)/g, ',')
}

export function logoutRemoveCookie () {
  cookies.remove('memberStatus')
  cookies.remove('ncpAccessToken')
  cookies.remove('accessToken')
  cookies.remove('ncpMemberId')
  cookies.remove('ncpOauthIdNo')
  cookies.remove('ncpCertificated')
  cookies.remove('ncpMemberAgree')
  deleteOrderInfoInStorage()
}

export function range (start, edge, step) {
  if (arguments.length === 1) {
    edge = start
    start = 0
  }

  edge = edge || 0
  step = step || 1

  for (var ret = []; (edge - start) * step > 0; start += step) {
    ret.push(start)
  }
  return ret
}

export function scriptLoader (url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    script.async = true
    script.addEventListener('load', resolve)
    script.addEventListener('error', reject)
    document.body.appendChild(script)
  })
}

export function popupfixBodyForShow () {
  let body = document.getElementsByTagName('body')[0]
  const currScroll = body.scrollTop | document.documentElement.scrollTop
  const bodyScrollTop = currScroll * -1
  body.style.top = bodyScrollTop + 'px'
  body.classList.add('no_scroll')
  window.scrollTo(0, bodyScrollTop * -1)
  return bodyScrollTop
}

export function popupReleaseBodyForClose (bodyScrollTop) {
  let body = document.getElementsByTagName('body')[0]
  body.classList.remove('no_scroll')
  body.style.top = '0px'
  window.scrollTo(0, bodyScrollTop * -1)
  return 0
}

export function popupReleaseBodyForNaviBack () {
  let body = document.getElementsByTagName('body')[0]
  body.classList.remove('no_scroll')
  return 0
}

export function isPCDevice () {
  return /(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent) === false
}

export function isPC () {
  let type = isPCDevice()
  if (window.location.host.split('.').shift() === 'm') {
    type = false
  }
  if (cookies.get('useDeviceMode')) {
    if (cookies.get('useDeviceMode') === 'mobile') {
      document.getElementById('viewport').setAttribute('content', 'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0')
      type = false
    } else {
      document.getElementById('viewport').setAttribute('content', 'width=1300')
      type = true
    }
  }
  return type
}

export function getBrowser () {
  const userAgent = navigator.userAgent
  if (userAgent.indexOf('OPR') > -1) {
    return 'Opera'
  }
  if (userAgent.indexOf('Firefox') > -1) {
    return 'FF'
  }
  if (userAgent.indexOf('Trident') > -1) {
    return 'IE'
  }
  if (userAgent.indexOf('Edge') > -1) {
    return 'Edge'
  }
  if (userAgent.indexOf('Chrome') > -1) {
    return 'Chrome'
  }
  if (userAgent.indexOf('Safari') > -1) {
    return 'Safari'
  }
}

export function deepCopy (obj) {
  return JSON.parse(JSON.stringify(obj))
}

export function productDetailQuery (to, flatBrands) {
  let depth1Path = ''
  let depth1Desc = ''
  let depth2Path = ''
  let depth2Desc = ''
  let query = {}

  if (to.name === 'GoodsSaleList') {
    depth1Path = '/goods/sale'
    depth1Desc = '세일'
  } else if (to.name === 'Search') {
    depth1Path = to.fullPath
    depth1Desc = to.query.keyword
  } else if (to.name === 'EventDetail') {
    depth1Path = '/event'
    depth1Desc = '프로모션'
  } else if (to.name === 'GoodsList') {
    let brandNos = []
    const pathList = to.fullPath.split('/')
    const brand = flatBrands.filter(item => item.brandNo === to.query.brandNo)[0]
    if (brand) {
      brandNos.push(brand.brandNo)
      if (brand.brands) {
        brandNos.push(brand.brands.map(item => item.brandNo))
      }
    }
    switch (pathList.length) {
      case 2:
        depth1Path = to.fullPath
        depth1Desc = '전체'
        if (brandNos.length > 0) {
          depth1Desc = to.query.brandName
        }
        break
      case 3:
        depth1Path = to.fullPath
        depth1Desc = to.query.depth1Desc
        break
      case 4:
        depth1Path = '/' + pathList[1] + '/' + pathList[2].split('?')[0] + '?depth1Desc=' + to.query.depth1Desc
        depth1Desc = to.query.depth1Desc
        depth2Path = to.fullPath
        depth2Desc = to.query.depth2Desc
        break
    }
  }
  if (to.name === 'GoodsSaleList' || to.name === 'Search' || to.name === 'EventDetail' || to.name === 'GoodsList') {
    if (depth1Path !== '' && depth1Desc !== '') {
      query = {
        depth1Path,
        depth1Desc
      }
    }
    if (depth2Path !== '' && depth2Desc !== '') {
      query = {
        depth1Path,
        depth1Desc,
        depth2Path,
        depth2Desc
      }
    }
  } else {
    return null
  }
  return query
}
