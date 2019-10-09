import { mapGetters } from 'vuex'
import { formatCurrency } from '@/utils/StringUtils'
import { Alert } from '@/utils/event-bus'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'
import $ from 'jquery'
export default {
  data () {
    return {
      isCouponPopup: false
    }
  },
  components: {},
  computed: {
    ...mapGetters('coupon', ['compare'])
  },
  methods: {
    handleClose () {
      this.isCouponPopup = false
      const couponPopup = this.$refs.couponPopup
      const $elem = $('html, body')
      $('html,body').css({
        'overflow-x': 'auto',
        'overflow-y': 'auto'
      })
      enablePageScroll(couponPopup)
      $elem.css({ overflow: '' })
    },
    toggleCouponPopup () {
      if (!this.$store.getters.isLogined) {
        this.$store.state.route.query.redirect = `${location.protocol}//${location.host}${this.$route.fullPath.split('#')[0]}`
        this.$store.dispatch('login')
      } else {
        if (this.compare.length === 1) {
          this.$store.dispatch('coupon/downLoadCoupons', this.compare[0].couponNo).then(() => {
            Alert({
              message: '할인쿠폰이 발급되었습니다.'
            })
          })
        } else {
          this.isCouponPopup = !this.isCouponPopup
          const couponPopup = this.$refs.couponPopup
          const $elem = $('html, body')
          this.$nextTick(() => {
            if (this.isCouponPopup) {
              $('html,body').css({
                'overflow-x': 'scroll'
              })
              disablePageScroll(couponPopup)
              $elem.css({ overflow: '' }) // hidden
            }
          })
        }
      }
    },
    priceFormat (price) {
      return formatCurrency(price)
    },
    downloadCoupon (couponNo) {
      if (!this.$store.getters.isLogined) {
        this.$store.state.route.query.redirect = `${location.protocol}//${location.host}${this.$route.fullPath.split('#')[0]}`
        this.$store.dispatch('login')
      } else {
        this.$store.dispatch('coupon/downLoadCoupons', couponNo).then(() => {
          Alert({
            message: '할인쿠폰이 발급되었습니다.'
          })
        })
      }
    }
  }
}
