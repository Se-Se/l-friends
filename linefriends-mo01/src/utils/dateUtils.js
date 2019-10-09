export function addDay (date, cnt, separator) {
  if (typeof date === 'object') {
    date = new Date(date)
  } else {
    date = new Date(date.replace(/-/g, '/'))
  }
  if (date.constructor !== Date) {
    return ''
  }

  date.setDate(date.getDate() + cnt)

  let month = date.getMonth() + 1
  let day = date.getDate()

  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }

  if (separator === null || separator === undefined) {
    separator = '-'
  }
  const reDate = date.getFullYear() + separator + month + separator + day

  return reDate
}

export function addMonth (date, cnt, separator) {
  if (date.constructor !== Date) {
    return ''
  }

  if (separator === null || separator === undefined) {
    separator = '-'
  }

  let newDate = new Date(date.getFullYear(), date.getMonth() + cnt, date.getDate())
  const newDateEndDay = new Date(date.getFullYear(), date.getMonth() + cnt + 1, 0)
  if (newDate.getMonth() !== newDateEndDay.getMonth()) {
    newDate = newDateEndDay
  }
  let month = newDate.getMonth() + 1
  let day = newDate.getDate()

  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }

  return newDate.getFullYear() + separator + month + separator + day
}

export function getStrDate (date, separator) {
  if (date.constructor !== Date) {
    date = new Date(date.replace(/-/g, '/'))
  }
  if (date.constructor !== Date) {
    return ''
  }

  let month = date.getMonth() + 1
  let day = date.getDate()

  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }

  if (separator === null || separator === undefined) {
    separator = '-'
  }
  const reDate = date.getFullYear() + separator + month + separator + day

  return reDate
}

export function getStrYMDHM (date, separator) {
  date = new Date(date.replace(/-/g, '/'))
  if (date.constructor !== Date) {
    return ''
  }

  let month = date.getMonth() + 1
  let day = date.getDate()
  let hours = date.getHours()
  let minutes = date.getMinutes()

  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }

  if (separator === null || separator === undefined) {
    separator = '-'
  }
  const reDate = date.getFullYear() + separator + month + separator + day + ' ' + hours + ':' + minutes

  return reDate
}

export function getStrYMDHMSS (date, separator) {
  if (date.constructor !== Date) {
    date = new Date(date.replace(/-/g, '/'))
  }

  let month = date.getMonth() + 1
  let day = date.getDate()
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let seconds = date.getSeconds()

  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }

  if (separator === null || separator === undefined) {
    separator = '-'
  }
  const reDate = date.getFullYear() + separator + month + separator + day + ' ' + hours + ':' + minutes + ':' + seconds

  return reDate
}

export function getToday () {
  return getStrDate(new Date())
}

export function getTodayTime () {
  return getStrYMDHMSS(new Date())
}

export function isToday (date) {
  let nowTime = new Date().getTime()
  let dateTime = new Date(date.replace(/-/g, '/')).getTime()
  return nowTime - dateTime < 1000 * 60 * 60 * 24
}

export function getFirstAndEndDay (mm, separator) {
  const nowdays = new Date()
  let year = nowdays.getFullYear()
  let month = nowdays.getMonth() + 1

  if (month <= mm) {
    year = year - 1
    month = month - mm + 12
  } else {
    month = month - mm
  }

  if (month < 10) {
    month = '0' + month
  }

  if (separator === null || separator === undefined) {
    separator = '-'
  }

  const startYmd = year + separator + month + separator + '01'

  const myDate = new Date(year, month, 0)
  const endYmd = year + separator + month + separator + myDate.getDate()

  return { startYmd, endYmd }
}

export function getSixMonths () {
  const sixMonths = []
  for (let index = 0; index < 6; index++) {
    const nowDate = new Date()
    const newDate = new Date(nowDate.getFullYear(), nowDate.getMonth() - index, 1)
    sixMonths.push(newDate.getFullYear() + '年 ' + (newDate.getMonth() + 1) + '月')
  }
  return sixMonths
}

export function isYearEndDay () {
  const date = new Date()
  if (date.getMonth() === 11 && date.getDate() === 31) {
    return true
  } else {
    return false
  }
}

export function getJanuary5 () {
  const date = new Date()
  return date.getFullYear() + 1 + '-01-05 23:59:59'
}

export function getEndDayForYear () {
  const date = new Date()
  return date.getFullYear() + '-12-31 23:59:59'
}

export function getStrMDW (date) {
  const weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return date.getMonth() + 1 + '.' + date.getDate() + ' ' + weeks[date.getDay()]
}

export function isOverDay (date) {
  const ONE_DAY = 1000 * 60 * 60 * 24
  const d = new Date(date.replace(/-/g, '/') + ' GMT+9') - new Date().getTime()
  return d > 0 && d <= ONE_DAY
}

export function within30Days (date) {
  const ONE_DAY = 1000 * 60 * 60 * 24 * 30
  const d = new Date(date.replace(/-/g, '/') + ' GMT+9') - new Date().getTime()
  return d > 0 && d <= ONE_DAY
}

export function getDateFormat (date) {
  if (date) {
    let slaDate = new Date(date.replace(/-/g, '/'))

    let y = slaDate.getFullYear()
    let m = slaDate.getMonth() + 1
    m = m < 10 ? '0' + m : m
    let d = slaDate.getDate()
    d = d < 10 ? '0' + d : d
    return y + '年 ' + m + '月 ' + d + '日'
  }
}

export function getDateFormatMD (date) {
  if (date) {
    let slaDate = new Date(date.replace(/-/g, '/'))
    let m = slaDate.getMonth() + 1
    let d = slaDate.getDate()
    return m + '月 ' + d + '日 ' + ' オープン予定'
  }
}

export function getDateFormatYMDHM (date) {
  if (date) {
    let slaDate = new Date(date.replace(/-/g, '/'))

    let y = slaDate.getFullYear()
    let m = slaDate.getMonth() + 1
    m = m < 10 ? '0' + m : m
    let d = slaDate.getDate()
    d = d < 10 ? '0' + d : d
    let hours = slaDate.getHours()
    let minutes = slaDate.getMinutes()
    minutes = minutes < 10 ? '0' + minutes : minutes
    return y + '年 ' + m + '月 ' + d + '日' + (hours < 12 ? ' 午前 ' : ' 午後 ') + (hours < 12 ? hours : hours - 12) + ':' + minutes
  }
}

export function getDateFormatMDHM (date) {
  if (date) {
    let slaDate = new Date(date.replace(/-/g, '/'))
    let m = slaDate.getMonth() + 1
    let d = slaDate.getDate()
    let hours = slaDate.getHours()
    let minutes = slaDate.getMinutes()
    minutes = minutes < 10 ? '0' + minutes : minutes
    return m + '月 ' + d + '日' + (hours < 12 ? ' 午前 ' : ' 午後 ') + (hours < 12 ? hours : hours - 12) + ':' + minutes + ' オープン予定'
  }
}

export function includeNow (start, end) {
  const nowDateTime = new Date().getTime()
  const startDateTime = new Date(start.replace(/-/g, '/') + ' GMT+9').getTime()
  const endDateTime = new Date(end.replace(/-/g, '/') + ' GMT+9').getTime()
  return nowDateTime >= startDateTime && nowDateTime <= endDateTime
}

export function mypageDisDate (date, separator) {
  date = new Date(date.replace(/-/g, '/'))
  var today = new Date()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hours = date.getHours()
  let minutes = date.getMinutes()

  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }

  if (separator === null || separator === undefined) {
    separator = '-'
  }

  if (date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
    return hours + ':' + minutes
  } else {
    return date.getFullYear() + separator + month + separator + day
  }
}
export function pad (num, size) {
  const str = String(num)
  return new Array(size - str.length + 1).join('0') + str
}
export function dateFormatStr (dateStr, format) {
  let date = new Date(dateStr.replace(' ', 'T'))
  let week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
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
}

export function dateFormatStrContainIOS (dateStr, format) {
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
  if (format === 'yyyy.MM.dd hh:mm') {
    return iosData.replace(/-/g, '.')
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
  return dateFormat(date, format)
}
export function dateFormat (date, format) {
  if (!(date instanceof Date)) {
    return ''
  }
  let week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

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
}

export function containsNow (startYmdt, endYmdt) {
  let nowDate = getStrYMDHMSS(new Date())
  if (startYmdt <= nowDate && nowDate <= endYmdt) {
    return true
  } else {
    return false
  }
}

export function BirthYmd (year, month) {
  let defaultYear = new Date().getFullYear()
  let defaultYearArr = ['' + defaultYear]
  let defaultMonthArr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  let defaultBestMonthArr = [1, 3, 5, 7, 8, 10, 12]
  let defaultDayArr = []
  let differDay = 0
  for (let i = 1; i <= 100; i++) {
    defaultYearArr.push(defaultYear - i + '')
  }
  if (month) {
    month = Number(month)
  } else {
    month = 1
  }
  if (defaultBestMonthArr.indexOf(month) >= 0) {
    differDay = 3
  } else if (month !== 2) {
    differDay = 2
  } else {
    if (year && (year % 4 === 0 || year % 100 === 0 || year % 400 === 0)) {
      differDay = 1
    } else if (defaultYear && (defaultYear % 4 === 0 || defaultYear % 100 === 0 || defaultYear % 400 === 0)) {
      differDay = 1
    }
  }
  for (let i = 1; i <= (28 + differDay); i++) {
    if (i < 10) {
      i = '0' + i
    } else {
      i = '' + i
    }
    defaultDayArr.push(i)
  }
  return {
    'year': defaultYearArr,
    'month': defaultMonthArr,
    'day': defaultDayArr
  }
}
