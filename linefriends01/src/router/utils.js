import { isPC } from '../utils/utils'

let directory = isPC() ? 'pc' : 'mobile'

export function asyncComponentFooter () {
  return () => import(`@/components/${directory}/layout/footer/Footer.vue`)
}

export function asyncComponentHeader () {
  return () => import(`@/components/${directory}/layout/header/Header.vue`)
}

export function asyncComponent (componentName) {
  return () => import(`@/components/${directory}/${componentName}`)
}

export function scrollBehavior (to, from, savedPosition) {
  if (to.meta.keepScroll && from.meta.keepScroll) {
    return null
  }
  if (savedPosition) {
    return savedPosition
  }
  if (to.hash) {
    const position = {}
    position.selector = to.hash
    const productHash = ['#item_info', '#item_review', '#item_qna', '#item_refund']
    if (productHash.some(item => item === to.hash)) {
      position.offset = {
        y: 67
      }
    }
    return position
  }
  return { x: 0, y: 0 }
}
