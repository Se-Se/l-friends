import { Alert } from '@/utils/event-bus'

const Validater = (valiInfos) => {
  this.valiInfos = valiInfos
}
const checkLengthFn = () => {
  let isBreak = false
  let hasError = false
  this.valiInfos.forEach((item) => {
    item.hasError = false
    if (!isBreak) {
      if (item.pattern) {
        if (!item.pattern.test(item.inputValue)) {
          item.hasError = true
        }
      } else if (item.eqTarget) {
        if (item.inputValue !== item.eqTarget) {
          item.hasError = true
          item.message = item.eqTargetMessage
        }
      } else if (item.length) {
        if (item.inputValue.length !== item.length) {
          item.hasError = true
        }
      } else if (item.minLength && item.maxLength) {
        if (item.inputValue.length < item.minLength || item.inputValue.length > item.maxLength) {
          item.hasError = true
        }
      } else if (item.minLength) {
        if (item.inputValue.length < item.minLength) {
          item.hasError = true
        }
      } else {
        if (item.inputValue.length > item.maxLength) {
          item.hasError = true
        }
      }
      if (item.hasError) {
        // alert(item.message)
        Alert({
          message: item.message
        })
        isBreak = true
        hasError = true
        if (item.input) {
          item.input.focus()
        }
      }
    }
  })
  return hasError
}
Validater.prototype.validate = checkLengthFn

export default Validater

export function validateNumber (event, max) {
  const allowKeys = [46, 8, 9, 27, 13]
  if (allowKeys.includes(event.keyCode) ||
    // Allow: Ctrl + A/X/V/C
    (event.ctrlKey === true) ||
    // Allow: home, end, left, right, down, up
    (event.keyCode >= 35 && event.keyCode <= 40)) {
    // let it happen, don't do anything
    return
  }
  if (event.type === 'keydown' && max) {
    if (event.target.value.length >= max) {
      event.preventDefault()
    }
  }
  // Ensure that it is a number and stop the keypress
  if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
    event.preventDefault()
  }

  if (event.type === 'blur') {
    let value = changeKoreanToEmptyString(event.target.value)
    event.target.value = value
  }
}

export function changeKoreanToEmptyString (value) {
  let regx = /[ㄱ-ㅎㅏ-ㅣ가-힣]/g
  if (regx.test(value)) {
    value = value.replace(regx, '')
  }
  return value
}

export function joinPasswordValidation (value) {
  const pattern1 = /[0-9]/
  const letterReg = /^.*[a-zA-Z].*$/
  const characterReg = /^.*[\\!~@#$%^&*()_+\-=`,./<>?;':"|[\]{}].*$/
  let result = { code: 1,
    pattern: ''
  }
  let patternList = []
  if (!pattern1.test(value)) {
    result.code = 0
    patternList.push('숫자')
  }
  if (!letterReg.test(value)) {
    result.code = 0
    patternList.push('영문')
  }
  if (!characterReg.test(value)) {
    result.code = 0
    patternList.push('특수문자')
  }
  result.pattern = patternList[patternList.length - 1] === '영문' ? patternList.toString() + '을' : patternList.toString() + '를'

  return result
}

export function PasswordValidation (value) {
  let passwordReg = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[\\!~@#$%^&*()_+\-=])[A-Za-z0-9\\!~@#$%^&*()_+\-=]{8,20}$/
  return passwordReg.test(value)
}

export function EmailValidation (value) {
  let isEmail = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/.test(value)
  return isEmail
}

export function checkPhone (value) {
  let reg = /^01\d{8,9}$/
  if (value === '') {
    return '휴대전화를 입력해주세요.'
  }
  if (!reg.test(value)) {
    return '휴대전화를 다시 확인해주세요.'
  }
}

export function checkMail (value) {
  let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
  if (value === '') {
    return '이메일을 입력해주세요.'
  }
  if (!reg.test(value)) {
    return '이메일 형식에 맞게 입력해주세요.'
  }
}
