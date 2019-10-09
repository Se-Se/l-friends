<template>
  <div class="sale-info order-content">
    <div class="order-input point">
      <app-label
        target="couponPrice"
        size="normal"
      >쿠폰할인 금액</app-label>
      <div class="input-group inline">
        <app-input
          id="couponPrice"
          class="input-group__input"
          type="text"
          size="large"
          :value="showTotalDiscountAmt + '원'"
          :readonly="true"
        />
        <app-button
          class="input-group__button"
          type="secondary"
          @click="showCouponPopup"
        >
        쿠폰적용
        </app-button>
      </div>
    </div>
    <div
      v-if="isExec"
      class="order-input point"
    >
      <app-label
        target="couponPrice"
        size="normal"
      >임직원 포인트</app-label>
      <div class="input-group inline">
        <app-input
          id="couponPrice"
          v-model="useAccumulationAmt"
          class="input-group__input"
          type="text"
          size="large"
          :hint="'/ 보유 ' + accumulationAmt + '원'"
          @blur="changeAccumulationAmt"
          @focus="delSeparator"
        />
        <app-button
          class="input-group__button"
          type="secondary"
          @click="maxAccumulationAmt"
        >
          전액사용
        </app-button>
      </div>
    </div>
    <page-popup :show.sync="couponSelect">
      <coupon @close="couponSelect = false" />
    </page-popup>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { formatCurrency } from '@/utils/StringUtils'
import AppLabel from '@/components/mobile/common/form/Label'
import AppInput from '@/components/mobile/common/input/Input'
import AppButton from '@/components/mobile/common/button/Button'
import Coupon from '@/components/mobile/pages/order/Coupon'
import PagePopup from '@/components/mobile/common/PagePopup'
import { Alert } from '@/utils/event-bus'

export default {
  name: 'OrderSaleInfo',
  props: ['paymentInfo'],
  components: {
    AppLabel,
    AppInput,
    AppButton,
    Coupon,
    PagePopup
  },
  data () {
    return {
      orderSheetNo: this.$store.state.route.params.orderSheetNo,
      useAccumulationAmt: 0,
      couponSelect: false
    }
  },
  computed: {
    ...mapGetters('profile', ['isExec']),
    ...mapState('ordersheet', ['orderCoupons', 'couponAmt', 'couponRequest']),
    ...mapGetters('ordersheet', ['orderCouponCnt']),
    ...mapState('myorder', ['pointName']),
    showTotalDiscountAmt () {
      let totalDiscountAmt = this.paymentInfo.productCouponAmt + this.paymentInfo.cartCouponAmt + this.paymentInfo.deliveryCouponAmt
      return formatCurrency(totalDiscountAmt)
    },
    accumulationAmt () {
      return formatCurrency(this.paymentInfo.accumulationAmt)
    }
  },
  methods: {
    delSeparator () {
      if (this.useAccumulationAmt) {
        this.useAccumulationAmt = this.useAccumulationAmt.replace(/,/g, '')
      }
    },
    changeAccumulationAmt () {
      let reg = new RegExp('^[1-9][0-9]*$')
      if (!reg.test(this.useAccumulationAmt)) {
        this.useAccumulationAmt = 0
      }
      const availableMinAccumulationAmt = this.paymentInfo.availableMinAccumulationAmt
      const availableMaxAccumulationAmt = this.paymentInfo.availableMaxAccumulationAmt
      const accumulationAmt = this.paymentInfo.accumulationAmt
      const minAccumulationLimit = this.paymentInfo.minAccumulationLimit
      const totalStandardAmt = this.paymentInfo.totalStandardAmt
      if (totalStandardAmt < availableMinAccumulationAmt || minAccumulationLimit > availableMaxAccumulationAmt || minAccumulationLimit > accumulationAmt) {
        this.useAccumulationAmt = 0
      } else if (this.useAccumulationAmt > availableMaxAccumulationAmt) {
        this.useAccumulationAmt = availableMaxAccumulationAmt
      }
      this.$emit('changeAccumulationAmt', this.useAccumulationAmt)
      this.useAccumulationAmt = formatCurrency(this.useAccumulationAmt)
    },
    maxAccumulationAmt () {
      const availableMinAccumulationAmt = this.paymentInfo.availableMinAccumulationAmt
      const availableMaxAccumulationAmt = this.paymentInfo.availableMaxAccumulationAmt
      const accumulationAmt = this.paymentInfo.accumulationAmt
      const minAccumulationLimit = this.paymentInfo.minAccumulationLimit
      const totalStandardAmt = this.paymentInfo.totalStandardAmt
      if (this.accumulationAmt === 0) {
        Alert({
          message: '보유하신 포인트가 없습니다.'
        })
      }
      if (totalStandardAmt < availableMinAccumulationAmt || minAccumulationLimit > availableMaxAccumulationAmt || minAccumulationLimit > accumulationAmt) {
        this.useAccumulationAmt = 0
      } else {
        this.useAccumulationAmt = availableMaxAccumulationAmt
      }
      this.$emit('changeAccumulationAmt', this.useAccumulationAmt)
      this.useAccumulationAmt = formatCurrency(this.useAccumulationAmt)
    },
    showCouponPopup () {
      if (!this.orderCouponCnt) {
        Alert({
          message: '적용 가능한 쿠폰이 없습니다.'
        })
      } else {
        this.useAccumulationAmt = 0
        this.$emit('changeAccumulationAmt', 0)
        this.$store.dispatch('ordersheet/calculateConpons', { orderSheetNo: this.orderSheetNo, couponRequest: this.couponRequest })
        this.couponSelect = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.input-group {
  &.inline {
    display: flex;
    justify-content: space-between;

    .input-group__input {
      flex: 1 1 auto;
    }

    .input-group__button {
      margin-left: 0.7rem;
      flex: 0 0 auto;
      width: 10.7rem;
    }
  }
}
</style>
