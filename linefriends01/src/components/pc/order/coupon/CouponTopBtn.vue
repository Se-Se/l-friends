<template>
  <div class="btn_discount">
    <button class="btn_radius" @click="resetCoupon" v-if="resetBtnFlg">최대할인 해제</button>
    <button type="button" class="btn_radius red" @click="maxCalcCoupon" v-else>최대할인 적용</button>
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
