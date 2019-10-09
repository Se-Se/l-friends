import Vue from 'vue'
import { formatCurrency } from '../utils/utils.js'

const filters = {
  pad (num, size) {
    const str = String(num)
    return new Array(size - str.length + 1).join('0') + str
  },
  formatCurrency (num, positive) {
    return formatCurrency(num, positive)
  },
  dateFormatStr (dateStr, format) {
    let date = new Date(dateStr.replace(' ', 'T'))
    let week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    let pad = (num, size) => {
      const str = String(num)
      return new Array(size - str.length + 1).join('0') + str
    }
    return format.replace(/(yyyy|yy|MM|M|dd|d|E|hh|mm|ss|a\/p)/gi, ($1) => {
      switch ($1) {
        case 'yyyy':
          return '' + date.getFullYear()
        case 'MM':
          return pad(date.getMonth() + 1, 2)
        case 'M':
          return date.getMonth() + 1
        case 'dd':
          return pad(date.getDate(), 2)
        case 'd':
          return date.getDate()
        case 'E':
          return week[date.getDay()]
        case 'HH':
          return pad(date.getHours(), 2)
        case 'hh':
          return pad(date.getHours() % 12 ? date.getHours() : 12, 2)
        case 'mm':
          return pad(date.getMinutes(), 2)
        case 'ss':
          return pad(date.getSeconds(), 2)
        case 'a/p':
          return date.getHours() < 12 ? '午前' : '午後'
        default:
          return $1
      }
    })
  },
  dateFormat (date, format) {
    if (!(date instanceof Date)) {
      return ''
    }
    let week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return format.replace(/(yyyy|yy|MM|M|dd|d|E|hh|mm|ss|a\/p)/gi, ($1) => {
      switch ($1) {
        case 'yyyy':
          return '' + date.getFullYear()
        case 'MM':
          return this.pad(date.getMonth() + 1, 2)
        case 'M':
          return date.getMonth() + 1
        case 'dd':
          return this.pad(date.getDate(), 2)
        case 'd':
          return date.getDate()
        case 'E':
          return week[date.getDay()]
        case 'HH':
          return this.pad(date.getHours(), 2)
        case 'hh':
          return this.pad(date.getHours() % 12 ? date.getHours() : 12, 2)
        case 'mm':
          return this.pad(date.getMinutes(), 2)
        case 'ss':
          return this.pad(date.getSeconds(), 2)
        case 'a/p':
          return date.getHours() < 12 ? '午前' : '午後'
        default:
          return $1
      }
    })
  },
  formatRate (rate) {
    let number = rate.toString()
    if (number === '' || isNaN(number)) {
      return rate
    }
    if (number.indexOf('.') > 0) {
      return rate
    }
    return number + '.0'
  },
  warpTag (content, keyword, tagName) {
    if (content === '') {
      return content
    }
    const a = content.toLowerCase()
    const b = keyword.toLowerCase()
    const indexof = a.indexOf(b)
    const c = indexof > -1 ? content.substr(a.indexOf(b), keyword.length) : ''
    const val = `<${tagName} class='keywords'>${c}</${tagName}>`
    let characterReg = /^.*[\\!~@#$%^&*(_)+\-=`,./<>?;':"|[\]{}].*$/
    let regS
    if (characterReg.test(keyword)) {
      if (keyword.length === 1) {
        regS = new RegExp('\\' + keyword, 'gi')
      } else {
        let keywordNew = ''
        for (let i = 0; i < keyword.length; i++) {
          keywordNew += i < keyword.length - 1 ? keyword.substr(i, 1) + '\\' : keyword.substr(i, 1)
        }
        keyword = keywordNew
      }
      regS = new RegExp('\\' + keyword, 'gi')
    } else {
      regS = new RegExp(keyword, 'gi')
    }
    return content.replace(regS, val)
  },
  wordsFormat (content, num) {
    if (content) {
      if (navigator.userAgent.indexOf('Trident') === -1 && navigator.userAgent.indexOf('Edge') === -1) {
        return content
      }
      if (content.length <= num) {
        return content
      }
      return content.substring(0, num) + '...'
    }
  },
  showStatus ({ orderType, claimType }) {
    let statusLabel = ''

    if (claimType) {
      switch (claimType) {
        case 'CANCEL_REQUEST':
        case 'CANCEL_PROC_REQUEST_REFUND':
        case 'CANCEL_PROC_WAITING_REFUND':
          statusLabel = 'キャンセル処理中'
          break
        case 'CANCEL_NO_REFUND':
        case 'CANCEL_DONE':
          statusLabel = 'キャンセル完了'
          break
        case 'RETURN_REQUEST':
        case 'RETURN_REJECT_REQUEST':
        case 'RETURN_PROC_BEFORE_RECEIVE':
        case 'RETURN_PROC_REQUEST_REFUND':
        case 'RETURN_PROC_WAITING_REFUND':
          statusLabel = '返品処理中'
          break
        case 'RETURN_DONE':
          statusLabel = '返品完了'
          break
        case 'EXCHANGE_REQUEST':
        case 'EXCHANGE_PROC_BEFORE_RECEIVE':
        case 'EXCHANGE_PROC_REQUEST_REFUND':
        case 'EXCHANGE_PROC_WAITING_REFUND':
        case 'EXCHANGE_REJECT_REQUEST':
        case 'RETURN_PROC_REQUEST_PAY':
        case 'RETURN_PROC_WAITING_PAY':
          statusLabel = '交換処理中'
          break
        case 'EXCHANGE_DONE_PAY_DONE':
        case 'EXCHANGE_DONE_REFUND_DONE':
        case 'EXCHANGE_DONE':
          statusLabel = '交換完了'
          break
      }
    } else {
      switch (orderType) {
        case 'DEPOSIT_WAIT':
          statusLabel = '入金待ち'
          break
        case 'PAY_DONE':
        case 'PRODUCT_PREPARE':
          statusLabel = '注文完了'
          break
        case 'DELIVERY_PREPARE':
        case 'DELIVERY_ING':
          statusLabel = '配送準備中'
          break
        case 'DELIVERY_DONE':
        case 'BUY_CONFIRM':
          statusLabel = '配達完了'
          break
      }
    }

    return statusLabel
  },
  bytesFormat (content, bytes) {
    if (content) {
      // if (navigator.userAgent.indexOf('Trident') === -1 && navigator.userAgent.indexOf('Edge') === -1) {
      //   return content
      // }
      let len = 0
      for (var i = 0; i < content.length; i++) {
        len += (content.charCodeAt(i) > 255 ? 2 : 1)
      }
      if (len <= bytes) {
        return content
      }
      let theLen = 0
      for (var y = 0; y < content.length; y++) {
        theLen += (content.charCodeAt(y) > 255 ? 2 : 1)
        if (theLen > bytes) {
          return content.substring(0, y) + '···'
        }
      }
    }
  },
  toHtml (str) {
    return str ? str.replace(/&((g|l|quo)t|amp|#39|nbsp);/g, function (m) {
      return {
        '&lt;': '<',
        '&amp;': '&',
        '&quot;': '"',
        '&gt;': '>',
        '&#39;': "'",
        '&nbsp;': ' '
      }[m]
    }) : ''
  }
}

Object.keys(filters).forEach((name) => Vue.filter(name, filters[name]))

export default filters
