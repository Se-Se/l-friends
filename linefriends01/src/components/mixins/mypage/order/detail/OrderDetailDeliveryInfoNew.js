import { addClass, removeClass } from '@/utils/utils'

export default {
  props: ['orderNo', 'shippingAddress', 'nonMember', 'showCustomsID'],
  data () {
    return {
      isShowAddress: false,
      bodyScrollTop: 0
    }
  },
  methods: {
    openOrderDetailAddressPopup () {
      if (this.isShowAddress) {
        this.isShowAddress = true
      }
      const currScroll = document.body.scrollTop | document.documentElement.scrollTop
      this.bodyScrollTop = currScroll * -1
      document.body.style.top = this.bodyScrollTop + 'px'
      addClass(document.body, 'no_scroll')
      this.$refs.orderDetailAddress.openOrderDetailAddressPopup()
    },
    closePop () {
      removeClass(document.body, 'no_scroll')
      document.body.style.top = '0px'
      window.scrollTo(0, this.bodyScrollTop * -1)
    }
  }
}
