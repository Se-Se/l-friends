import { mapState, mapGetters } from 'vuex'
import { formatCurrency } from '@/utils/StringUtils'

export default {
  computed: {
    ...mapState('cart', ['totalItemPrice', 'totalDiscountAmount', 'totalShippingCost', 'paymentAmount']),
    ...mapGetters('cart', ['havePayOnDelivery']),
    showTotalItemPrice () {
      return formatCurrency(this.totalItemPrice)
    },
    showTotalDiscountAmount () {
      return formatCurrency(this.totalDiscountAmount)
    },
    showTotalShippingCost () {
      return formatCurrency(this.totalShippingCost)
    },
    showPaymentAmount () {
      return formatCurrency(this.paymentAmount)
    }
  }
}
