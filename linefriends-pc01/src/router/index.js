import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import MetaInfo from 'vue-meta-info'
import { scrollBehavior } from './utils'
import { checkLogin, pc2Mo } from './hooks'
import routes from './routes'

Vue.use(Router)
Vue.use(Meta)
Vue.use(MetaInfo)

const router = new Router({
  mode: 'history',
  scrollBehavior,
  routes
})

router.beforeEach(pc2Mo)
router.beforeEach(checkLogin)

export default router
