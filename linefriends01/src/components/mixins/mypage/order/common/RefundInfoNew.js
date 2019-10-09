import { mapState } from 'vuex'
export default {
  props: ['refundInfos'],
  data () {
    return {
      productAmtInfo: {
        totalAmt: 0,
        standardPrice: 0,
        immediateDiscountAmt: 0,
        additionalDiscountAmt: 0,
        productCouponDiscountAmt: 0
      },
      subtractionAmtInfo: {
        refundAdjustReason: [],
        refundAdjustAmt: 0,
        deliveryCouponAmt: 0,
        cartCouponAmt: 0,
        totalAmt: 0
      },
      deliveryAmtInfo: {
        totalAmt: 0
      },
      refundPayAmt: 0,
      refundMainPayAmt: 0,
      refundSubPayAmt: 0
    }
  },
  computed: {
    ...mapState('myorder', ['pointName'])
  },
  methods: {
    setAmt () {
      this.refundInfos.forEach(data => {
        this.productAmtInfo.totalAmt += data.productAmtInfo.totalAmt
        this.productAmtInfo.standardPrice += data.productAmtInfo.standardPrice
        this.productAmtInfo.immediateDiscountAmt += data.productAmtInfo.immediateDiscountAmt
        this.productAmtInfo.additionalDiscountAmt += data.productAmtInfo.additionalDiscountAmt
        this.productAmtInfo.productCouponDiscountAmt += data.productAmtInfo.productCouponDiscountAmt
        this.deliveryAmtInfo.totalAmt += data.deliveryAmtInfo.totalAmt
        let totalAmt = data.subtractionAmtInfo.cartCouponAmt + data.subtractionAmtInfo.deliveryCouponAmt + data.productAmtInfo.immediateDiscountAmt + data.productAmtInfo.additionalDiscountAmt + data.productAmtInfo.productCouponDiscountAmt
        this.subtractionAmtInfo.totalAmt += totalAmt
        if (data.subtractionAmtInfo.refundAdjustReason) {
          this.subtractionAmtInfo.refundAdjustReason.push(data.subtractionAmtInfo.refundAdjustReason)
        }
        this.subtractionAmtInfo.refundAdjustAmt += data.subtractionAmtInfo.refundAdjustAmt
        this.subtractionAmtInfo.deliveryCouponAmt += data.subtractionAmtInfo.deliveryCouponAmt
        this.subtractionAmtInfo.cartCouponAmt += data.subtractionAmtInfo.cartCouponAmt
        this.refundPayAmt += data.refundPayAmt
        this.refundMainPayAmt += data.refundMainPayAmt
        this.refundSubPayAmt += data.refundSubPayAmt
      })
    }
  },
  watch: {
    refundInfos () {
      this.productAmtInfo.totalAmt = 0
      this.productAmtInfo.standardPrice = 0
      this.productAmtInfo.immediateDiscountAmt = 0
      this.productAmtInfo.additionalDiscountAmt = 0
      this.productAmtInfo.productCouponDiscountAmt = 0
      this.deliveryAmtInfo.totalAmt = 0
      this.subtractionAmtInfo.totalAmt = 0
      this.subtractionAmtInfo.refundAdjustReason = []
      this.subtractionAmtInfo.refundAdjustAmt = 0
      this.subtractionAmtInfo.deliveryCouponAmt = 0
      this.subtractionAmtInfo.cartCouponAmt = 0
      this.refundPayAmt = 0
      this.refundMainPayAmt = 0
      this.refundSubPayAmt = 0
      this.setAmt()
    }
  },
  created () {
    this.setAmt()
  }
}
