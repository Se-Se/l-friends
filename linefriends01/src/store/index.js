import Vue from 'vue'
import Vuex from 'vuex'
import { applyMixin } from './storeMixin'
import actions from './actions'
import getters from './getters'
import VueAwesomeSwiper from 'vue-awesome-swiper'

Vue.use(Vuex)
Vue.use(VueAwesomeSwiper)

const requireModules = require.context('./modules', false, /\.js$/)
const modules = requireModules.keys().reduce((modules, fileName) => {
  const name = fileName.match(/([^./]+)\.js$/)[1]
  modules[name] = requireModules(fileName).default
  return modules
}, {})

export default new Vuex.Store(applyMixin({
  actions,
  getters,
  modules
}))
