export function productPrice (salePrice, additionDiscountAmt, immediateDiscountAmt) {
  let discountAmt = additionDiscountAmt || 0
  discountAmt += immediateDiscountAmt || 0

  return {
    discountRate: Math.round((discountAmt / salePrice) * 100) || 0,
    finalSalePrice: salePrice - discountAmt
  }
}
export function priceZone (product) {
  let discountAmt = product.additionDiscountAmt + product.immediateDiscountAmt
  let withCouponAmt = discountAmt + product.couponDiscountAmt

  return {
    discountRate: Math.round((discountAmt / product.salePrice) * 100),
    couponRate: Math.round((product.couponDiscountAmt / product.salePrice) * 100),
    finalSalePrice: product.salePrice - discountAmt,
    allRate: Math.round((withCouponAmt / product.salePrice) * 100),
    allPrice: product.salePrice - withCouponAmt
  }
}
export function maskingMemberId (memberId) {
  if (!memberId) {
    return ''
  }
  let showMemberId = ''
  let endStr = ''
  if (memberId.indexOf('@') > -1) {
    endStr = memberId.substring(memberId.indexOf('@'))
    memberId = memberId.substring(0, memberId.indexOf('@'))
  }
  if (memberId.length >= 2) {
    showMemberId = memberId.substring(0, memberId.length - 2) + '**'
  } else {
    showMemberId = '**'
  }
  return showMemberId + endStr
}
export function formatCurrency (num, positive) {
  if (!positive) {
    positive = ''
  }
  if (num) {
    let number = num.toString()

    if (number === '' || isNaN(number)) {
      return num
    }

    if (number.indexOf('-') > 0) {
      return num
    }

    let sign = number.indexOf('-') === 0 ? '-' : positive
    if (sign === '-') {
      number = number.substr(1)
    }

    let cents = number.indexOf('.') > 0 ? number.substr(number.indexOf('.')) : ''
    cents = cents.length > 1 ? cents : ''

    number = number.indexOf('.') > 0 ? number.substring(0, number.indexOf('.')) : number

    if (cents === '') {
      if (number.length > 1 && number.substr(0, 1) === '0') {
        return num
      }
    } else {
      if (number.length > 1 && number.substr(0, 1) === '0') {
        return num
      }
    }

    let tempNum = ''
    while (number.length > 3) {
      tempNum = ',' + number.slice(-3) + tempNum
      number = number.slice(0, number.length - 3)
    }
    if (number) {
      tempNum = number + tempNum
    }

    return sign + tempNum + cents
  } else {
    return num
  }
}
export function getBlength (str) {
  for (var i = str.length, n = 0; i--;) {
    n += str.charCodeAt(i) > 255 ? 2 : 1
  }
  return n
}
export function cutByte (str, len, endstr) {
  endstr = typeof endstr === 'undefined' ? '...' : endstr.toString()
  var endstrBl = getBlength(endstr)
  function n2 (a) {
    var n = (a / 2) | 0
    return n > 0 ? n : 1
  } // 用于二分法查找
  if (!(str + '').length || !len || len <= 0) {
    return ''
  }
  if (len < endstrBl) {
    endstr = ''
    endstrBl = 0
  }
  var lenS = len - endstrBl
  var _lenS = 0
  var _strl = 0
  while (_strl <= lenS) {
    var _lenS1 = n2(lenS - _strl)
    var addn = getBlength(str.substr(_lenS, _lenS1))
    if (addn === 0) {
      return str
    }
    _strl += addn
    _lenS += _lenS1
  }
  if (str.length - _lenS > endstrBl || getBlength(str.substring(_lenS - 1)) > endstrBl) {
    return str.substr(0, _lenS - 1) + endstr
  } else {
    return str
  }
}

export function optionFormat (optionUsed, optionType, optionName, optionValue, inputs, addPrice, orderCnt) {
  let showOption = ''

  const showOptions = []
  if (optionUsed) {
    if (optionType !== 'PRODUCT_ONLY') {
      const optionNames = optionName.split('|')
      const optionValues = optionValue.split('|')
      optionNames.forEach((tempName, index) => {
        showOptions.push(tempName + ':' + optionValues[index])
      })
    }
    if (inputs && inputs.length > 0) {
      inputs.forEach((optionInput) => {
        showOptions.push(optionInput.inputLabel + ':' + optionInput.inputValue)
      })
    }
  }

  if (addPrice && addPrice !== 0) {
    let last = showOptions.pop()
    let lastoption = last + ' (' + formatCurrency(addPrice, '+') + '￥)'
    showOptions.push(lastoption)
  }
  if (orderCnt) {
    showOptions.push(orderCnt + '個')
  }

  showOptions.forEach((item, index) => {
    if (index > 0) {
      showOption += ' / '
    }
    showOption += item
  })

  return showOption
}

export function telnoFormat (telno) {
  const telnos = ['', '', '']
  if (telno) {
    if (telno.indexOf('-') > 0) {
      let temptelnos = telno.split('-')
      if (temptelnos.length > 0) {
        telnos[0] = temptelnos[0]
        telnos[1] = temptelnos[1]
        telnos[2] = temptelnos[2]
      }
    } else if (telno.indexOf('-') < 0 && telno.length > 7) {
      telnos[0] = telno.substr(0, 3)
      telnos[1] = telno.substr(3, telno.length - 7)
      telnos[2] = telno.substr(telno.length - 4, 4)
    }
  }
  return telnos
}
