import 'babel-polyfill'
import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import App from './App'
import store from './store'
import router from './router'
import './filters'
import VueI18n from 'vue-i18n'
import kr from './i18n/kr.json'
import config from './config'
import { scriptLoader } from './utils/utils'
import VueInstagram from 'vue-instagram'

Vue.config.productionTip = false
Vue.use(VueI18n)
Vue.use(VueInstagram)

sync(store, router)

const messages = {
  kr
}

const i18n = new VueI18n({
  locale: 'kr',
  messages
})

function bootstrap () {
  return new Vue({
    el: '#wrap',
    router,
    store,
    i18n,
    render: h => h(App)
  })
}

Promise.all([
  scriptLoader(config.ncpApiBaseUrl + 'search/' + config.searchJs),
  scriptLoader(config.ncpApiBaseUrl + 'payments/' + config.payJs)
]).then(() => {
  bootstrap()
}).catch(() => {
  bootstrap()
})
