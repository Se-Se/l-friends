// import { addClass, removeClass } from '@/utils/utils'

// let bodyScrollTop = 0

let preventDefault = e => {
  return e.preventDefault()
}

export default {
  prevent () {
    // const currScroll = document.body.scrollTop | document.documentElement.scrollTop
    // bodyScrollTop = currScroll
    // document.body.style.top = (bodyScrollTop * -1) + 'px'
    // addClass(document.body, 'overflow_hidden')

    // <style>
    // .overflow_hidden {
    //   position: fixed;
    //   left: 0;
    //   width: 100%;
    //   overflow-y: scroll;
    // }
    // </style>
    document.body.addEventListener('scroll', preventDefault, false)
    document.body.addEventListener('touchmove', preventDefault, { passive: false })
  },
  recover () {
    // removeClass(document.body, 'overflow_hidden')
    // document.body.style.top = '0px'
    // window.scrollTo(0, bodyScrollTop)
    document.body.removeEventListener('scroll', preventDefault, false)
    document.body.removeEventListener('touchmove', preventDefault, { passive: false })
  }
}
