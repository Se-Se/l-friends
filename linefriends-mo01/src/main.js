import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { sync } from 'vuex-router-sync'
import './filters'
import VueTouch from 'vue-touch'
import { directive } from '@/directives'
import VueAwesomeSwiper from 'vue-awesome-swiper'

Vue.use(VueAwesomeSwiper)

Vue.config.productionTip = false
sync(store, router)
directive()
Vue.use(VueTouch, { name: 'v-touch' })

let vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
export default vue
