<template>
    <div class="btn_discount">
        <button class="btn btn_primary size_s" @click="resetCoupon" v-if="resetBtnFlg">最大割引解除</button>
        <button class="btn btn_primary size_s" @click="maxCalcCoupon" v-else>最大割引適用</button>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: ['couponRequest'],
  data () {
    return {
      orderSheetNo: this.$store.state.route.params.orderSheetNo
    }
  },
  computed: {
    ...mapGetters('ordersheet', ['resetBtnFlg'])
  },
  methods: {
    maxCalcCoupon () {
      this.$store.dispatch('ordersheet/maxCalculateConpons', { orderSheetNo: this.orderSheetNo, couponRequest: this.couponRequest })
    },
    resetCoupon () {
      this.$store.dispatch('ordersheet/resetConpons', { orderSheetNo: this.orderSheetNo, couponRequest: this.couponRequest })
    }
  }
}
</script>
