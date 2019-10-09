import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { sync } from 'vuex-router-sync'
import './filters'
import { directive } from '@/directives'

Vue.config.productionTip = false

sync(store, router)
directive()
let vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export default vue
