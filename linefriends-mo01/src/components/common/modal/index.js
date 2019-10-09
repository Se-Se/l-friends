import Vue from 'vue'
import AlertModal from './AlertModal'
import ConfirmModal from './ConfirmModal'
import merge from 'lodash/merge'

let AlertConstructor = Vue.extend(AlertModal)
let ConfirmConstructor = Vue.extend(ConfirmModal)

let Confirm = (options) => {
  let instance
  instance = new ConfirmConstructor({
    el: document.createElement('div')
  })
  document.getElementById('app').appendChild(instance.$el)
  if (typeof options === 'string') {
    options = {
      message: options
    }
  }
  merge(instance.$data.w, options)
  return new Promise((resolve, reject) => {
    instance.show = true

    let inputs = Array.prototype.slice.call(document.querySelectorAll('input'))
    inputs.forEach((input) => {
      input.blur()
    })

    let success = instance.success
    let cancel = instance.cancel
    instance.success = () => {
      success()
      resolve(true)
    }
    instance.cancel = () => {
      cancel()
      resolve(false)
    }
  })
}

const Alert = (options) => {
  let instance
  instance = new AlertConstructor({
    el: document.createElement('div')
  })
  document.getElementById('app').appendChild(instance.$el)
  if (typeof options === 'string') {
    options = {
      message: options
    }
  }
  merge(instance.$data.w, options)
  return new Promise((resolve, reject) => {
    instance.show = true

    let inputs = Array.prototype.slice.call(document.querySelectorAll('input'))
    inputs.forEach((input) => {
      input.blur()
    })

    let success = instance.success
    instance.success = () => {
      success()
      resolve('ok')
    }
  })
}

export {
  Alert,
  Confirm
}
