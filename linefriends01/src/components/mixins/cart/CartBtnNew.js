import { mapState } from 'vuex'
import { setOrderInfoInStorage } from '@/utils/orderUtils'
import { Alert } from '@/utils/event-bus'

export default {
  computed: {
    ...mapState('cart', ['checkOptions'])
  },
  methods: {
    buyChecked () {
      if (this.checkOptions && this.checkOptions.length > 0) {
        setOrderInfoInStorage(this.checkOptions, this.$route.fullPath)
        this.$store.dispatch('ordersheet/getSheetNo', {})
      } else {
        // alert('상품을 선택해 주세요.')
        Alert({
          message: this.$t('layout.cart.selectGoods')
        })
      }
    },
    buyAll () {
      this.$store.commit('cart/CHECK_ALL', true)
      this.$store.dispatch('cart/calculate')
      this.buyChecked()
    },
    goMain () {
      this.$router.push({
        path: '/'
      })
    }
  }
}
