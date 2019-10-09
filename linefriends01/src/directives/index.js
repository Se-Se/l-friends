import Vue from 'vue'

// 더블클릭 방지 1초에 한번만 누르게
const notDoubleClick = {
  bind (el, binding, vnode) {
    el.addEventListener('click', (event) => {
      el.disabled = true
      setTimeout(() => {
        el.disabled = false
      }, 1000)
    })
  }
}

// 포커스 안되게
const noFocus = {
  bind (el, binding, vnode) {
    el.addEventListener('click', (event) => {
      el.blur()
    })
  }
}

const toggle = {
  bind (el, binding, vnode) {
    el.addEventListener('click', (event) => {
      let expression = binding.expression.split('.')
      let obj = expression.length === 1 ? vnode.context : null
      while (expression.length > 1) {
        obj = vnode.context[expression.shift()]
      }
      const property = expression.shift()
      obj[property] = !obj[property]
      event.preventDefault()
    })
  }
}

const hideSelect = {
  bind (el, binding, vnode) {
    document.body.addEventListener('click', (event) => {
      let obj = binding.value
      let target = event.target
      if ((el !== target) && !el.contains(target)) {
      }
      for (var key in obj) {
        if (vnode.context[key]) {
          vnode.context[key] = !vnode.context[key]
        }
      }
    })
  }
}

const scroll = (() => {
  let scrollEvents = []

  let f = function (evt) {
    for (const event of scrollEvents) {
      event.handler(evt, event.el)
    }
  }

  window.addEventListener('scroll', f)

  return {
    inserted: function (el, binding) {
      scrollEvents.push({
        handler: binding.value,
        element: el
      })
    }
  }
})()

export const directive = () => {
  Vue.directive('not-double-click', notDoubleClick)
  Vue.directive('no-focus', noFocus)
  Vue.directive('toggle', toggle)
  Vue.directive('hide-select', hideSelect)
  Vue.directive('scroll', scroll)
}
