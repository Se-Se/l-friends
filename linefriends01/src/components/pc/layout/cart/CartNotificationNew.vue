<template>
  <div class="bx_purchase_noti">
    <ul>
      <li>
        <button type="button" class="btn btn_white btn_radius-box" @click="delChecked">{{ $t('layout.cart.selectGoodsDel') }}</button>
      </li>
      <li>
        <button type="button" class="btn btn_whitebtn_radius-box" @click="delInvalidOptions" v-if="invalidOptions.length > 0">{{ $t('layout.cart.noBuyDel') }}</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Alert, Confirm } from '@/utils/event-bus'
import $ from 'jquery'

export default {
  computed: {
    ...mapState('cart', ['checkOptions', 'invalidOptions'])
  },
  methods: {
    delChecked () {
      // $('html').css('overflow', 'hidden')
      if (this.checkOptions && this.checkOptions.length > 0) {
        Confirm({
          message: this.$t('layout.cart.selectGoodsDelConfirm'),
          callback: () => {
            this.$store.dispatch('cart/deleteCartByOptions', this.checkOptions)
          }
        })
      } else {
        Alert({
          message: this.$t('layout.cart.selectGoods')
        })
      }
    },
    delInvalidOptions () {
      // $('html').css('overflow', 'hidden')
      if (this.invalidOptions && this.invalidOptions.length > 0) {
        Confirm({
          message: this.$t('layout.cart.noBuy'),
          callback: () => {
            this.$store.dispatch('cart/deleteCartByOptions', this.invalidOptions)
          }
        })
      }
    }
  }
}
</script>
