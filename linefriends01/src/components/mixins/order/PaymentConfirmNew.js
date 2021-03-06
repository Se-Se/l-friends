import { formatCurrency } from '@/utils/StringUtils'
import { Alert } from '@/utils/event-bus'
import { mapState, mapGetters } from 'vuex'

export default {
  data () {
    return {
      params: '',
      bankName: '',
      account: '',
      vaDate: '',
      payType: '',
      resp: ''
    }
  },
  methods: {
    MyMiliForma (val) {
      return formatCurrency(val)
    },
    gotoOrder () {
      if (opener) {
        opener.location.replace('/mypage/orderlist')
        self.close()
      } else {
        window.location.replace('/mypage/orderlist')
      }
    },
    gotoHome () {
      if (opener) {
        opener.location.replace('/')
        self.close()
      } else {
        window.location.replace('/')
      }
    }
  },
  computed: {
    ...mapGetters('profile', ['isExec', 'isSaleExec']),
    result: {
      get () {
        return this.$store.state.route.query.result
      }
    },
    orderSheetNo: {
      get () {
        return this.$store.state.route.query.orderSheetNo
      }
    },
    orderNo: {
      get () {
        return this.$store.state.route.query.orderNo
      }
    },
    message: {
      get () {
        return this.$store.state.route.query.message
      }
    },
    totalDiscountAmt () {
      return this.order.lastOrderAmount.immediateDiscountAmt + this.order.lastOrderAmount.additionalDiscountAmt + this.order.lastOrderAmount.productCouponDiscountAmt + this.order.lastOrderAmount.cartCouponDiscountAmt
    },
    totalCouponAmt () {
      return this.order.lastOrderAmount.deliveryAmt - this.order.lastOrderAmount.deliveryCouponDiscountAmt + this.order.lastOrderAmount.remoteDeliveryAmt
    },
    isIntenational () {
      let isIntenational = false
      if (this.order.orderOptionsGroupByPartner && this.order.orderOptionsGroupByPartner.length > 0) {
        this.order.orderOptionsGroupByPartner.forEach(p => {
          if (p.orderOptionsGroupByDelivery && p.orderOptionsGroupByDelivery.length > 0) {
            p.orderOptionsGroupByDelivery.forEach(d => {
              if (d.orderOptions && d.orderOptions.length > 0) {
                d.orderOptions.forEach(o => {
                  if (o.deliveryInternationalYn) {
                    isIntenational = true
                  }
                })
              }
            })
          }
        })
      }
      return isIntenational
    },
    ...mapState('myorder', ['order', 'pointName'])
  },
  mounted () {
    if (this.$route.query.result === 'FAIL') {
      Alert({
        title: '주문',
        message: '결제에 실패했습니다'
      })
      this.$router.replace({
        path: `/order/${this.$route.query.orderSheetNo}${this.$route.query.productNo ? '?productNo=' + this.$route.query.productNo : ''}`
      })
    }
  }
}
