import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import { scrollBehavior } from './utils'
import { auth, dispatchAction, resetSearchWordInfo, beforePageAction, setDocumentTitle, loadAceCounter, pagePopupCheck } from './hooks'
import routes from './routes'
import { detect } from 'detect-browser'
import { Alert, Confirm } from '@/utils/event-bus'

const browser = detect()
if (browser.name === 'ie') {
  let version = Number(browser.version.split('.')[0])
  if (version < 10) {
    // alert('고객님의 브라우저에서는 사이트가 정상 동작하지 않습니다.\n인터넷 익스플로러 업데이트 또는 크롬 브라우저를 설치하신 후 이용해 주세요.')
    Alert({
      message: '고객님의 브라우저에서는 사이트가 정상 동작하지 않습니다.\n인터넷 익스플로러 업데이트 또는 크롬 브라우저를 설치하신 후 이용해 주세요.'
    })
  }
}

Vue.use(Router)
Vue.use(Meta)

const router = new Router({
  mode: 'history',
  scrollBehavior,
  routes
})

router.beforeEach(pagePopupCheck)
router.beforeEach(auth)
router.beforeEach(beforePageAction)
router.beforeEach(dispatchAction)
router.afterEach(resetSearchWordInfo)
router.afterEach(setDocumentTitle)
router.afterEach(loadAceCounter)
export default router
