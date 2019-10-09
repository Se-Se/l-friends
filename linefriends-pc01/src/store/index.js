import Vue from 'vue'
import Vuex from 'vuex'
import { applyMixin } from './storeMixin'
import $ from 'jquery'
Vue.use(Vuex)

const requireModules = require.context('./modules', false, /\.js$/)
const modules = requireModules.keys().reduce((modules, fileName) => {
  const name = fileName.match(/([^./]+)\.js$/)[1]
  modules[name] = requireModules(fileName).default
  return modules
}, {})

export default new Vuex.Store(applyMixin({
  state: {
    bodyScrollTop: 0
  },
  mutations: {
    SHOW_POP (state) {
      const currScroll = document.body.scrollTop | document.documentElement.scrollTop
      state.bodyScrollTop = currScroll
      document.body.style.top = (state.bodyScrollTop * -1) + 'px'
      $('body').addClass('overflow_hidden')
    },
    CLOSE_POP (state) {
      $('body').removeClass('overflow_hidden')
      document.body.style.top = '0px'
      window.scrollTo(0, state.bodyScrollTop)
    }
  },
  actions: {

  },
  modules
}))
