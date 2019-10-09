import Vue from 'vue'

const filters = {
  formatName (name) {
    if (name) {
      if (name.length > 10) {
        return name.substr(0, 10)
      } else {
        return name
      }
    }
  },
  formatNumber (num) {
    const str = String(num.toFixed(0))
    return str.replace(/(\d)(?=(\d{3})+$)/g, '$1,')
  },
  formatCurrency (num) {
    if (num) {
      let number = num.toString()

      if (number === '' || isNaN(number)) {
        return num
      }

      if (number.indexOf('-') > 0) {
        return num
      }

      let sign = number.indexOf('-') === 0 ? '-' : ''
      if (sign === '-') {
        number = number.substr(1)
      }

      let cents = number.indexOf('.') > 0 ? number.substr(number.indexOf('.')) : ''
      cents = cents.length > 1 ? cents : ''

      number = number.indexOf('.') > 0 ? number.substring(0, (number.indexOf('.'))) : number

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

      return (sign + tempNum + cents)
    } else {
      return 0
    }
  },
  pad (num, size) {
    const str = String(num)
    return new Array(size - str.length + 1).join('0') + str
  },
  dateFormatStr (dateStr, format) {
    let iosData
    if (dateStr) {
      let slaDate = new Date(dateStr.replace(/-/g, '/'))

      let y = slaDate.getFullYear()
      let m = slaDate.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = slaDate.getDate()
      d = d < 10 ? ('0' + d) : d
      let hours = slaDate.getHours()
      let minutes = slaDate.getMinutes()
      minutes = minutes < 10 ? ('0' + minutes) : minutes
      iosData = y + '-' + m + '-' + d + ' ' + hours + ':' + minutes
    }

    if (format === 'yyyy-MM-dd HH:mm') {
      return iosData
    }
    if (format === 'yyyy.MM.dd') {
      return iosData.replace(/-/g, '.').substring(0, 10)
    }
    if (format === 'yyyy-MM-dd') {
      return iosData.substring(0, 10)
    }
    if (format === 'HH:mm') {
      return iosData.substring(10, 16)
    }
    let date = new Date(dateStr.replace(' ', 'T'))
    return filters.dateFormat(date, format)
  },
  dateFormat (date, format) {
    if (!(date instanceof Date)) {
      return ''
    }
    let week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return format.replace(/(yyyy|yy|MM|M|dd|d|E|hh|mm|ss|a\/p)/gi, ($1) => {
      switch ($1) {
        case 'yyyy': return '' + date.getFullYear()
        case 'MM': return this.pad((date.getMonth() + 1), 2)
        case 'M': return date.getMonth() + 1
        case 'dd': return this.pad(date.getDate(), 2)
        case 'd': return date.getDate()
        case 'E': return week[date.getDay()]
        case 'HH': return this.pad(date.getHours(), 2)
        case 'hh': return this.pad(((date.getHours() % 12) ? date.getHours() : 12), 2)
        case 'mm': return this.pad(date.getMinutes(), 2)
        case 'ss': return this.pad(date.getSeconds(), 2)
        case 'a/p': return date.getHours() < 12 ? '오전' : '오후'
        default: return $1
      }
    })
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
  decodeEntities (content) {
    const txt = document.createElement('textarea')
    txt.innerHTML = content
    return txt.value
  }
}

Object.keys(filters).forEach(name => Vue.filter(name, filters[name]))

export default filters
