<template>
  <div class="table_wrap person-info">
    <table class="table_data shipping_data">
      <colgroup>
        <col style="width: 200px;">
        <col>
      </colgroup>
      <tbody>
        <tr>
          <th>クーポン適用金額</th>
          <td>
            <dl class="amount">
              <dt><i class="uom2">￥  </i><input type="text" class="wid-140 wrapper-pc-font_family_c" v-model="showTotalDiscountAmt" disabled=""> </dt>
              <dd><button class="btn btn_primary size_m" @click.prevent="showCouponPopup">クーポン適用</button></dd>
            </dl>
          </td>
        </tr>
      </tbody>
    </table>
    <coupon-pop :orderCoupons="orderCoupons" :couponRequest="couponRequest" :orderCouponCnt="orderCouponCnt" @closeCouponPopup="closeCouponPopup" :active="active.coupon" />
  </div>
</template>

<script>
/* eslint-disable */
import { mapState, mapGetters } from 'vuex'
import { formatCurrency } from '@/utils/StringUtils'
import { popupfixBodyForShow, popupReleaseBodyForClose, popupReleaseBodyForNaviBack } from '@/utils/utils.js'
import CouponPop from '@/components/escrow/order/coupon/CouponPop'
import $ from 'jquery'
import { Alert } from '@/components/common/modal'

export default {
  props: ['paymentInfo'],
  data () {
    return {
      active: {
        coupon: false
      },
      orderSheetNo: this.$store.state.route.params.orderSheetNo,
      bodyScrollTop: 0,
      useAccumulationAmt: 0
    }
  },
  beforeDestroy () {
    popupReleaseBodyForNaviBack()
  },
  components: {
    CouponPop
  },
  computed: {
    ...mapState('ordersheet', ['orderCoupons', 'couponAmt', 'couponRequest']),
    ...mapGetters('ordersheet', ['orderCouponCnt']),
    ...mapState('myorder', ['pointName']),
    ...mapGetters('profile', ['isExec']),
    showTotalDiscountAmt () {
      let totalDiscountAmt = this.paymentInfo.productCouponAmt + this.paymentInfo.cartCouponAmt + this.paymentInfo.deliveryCouponAmt
      return formatCurrency(totalDiscountAmt)
    },
    accumulationAmt () {
      return formatCurrency(this.paymentInfo.accumulationAmt)
    }
  },
  methods: {
    closeCouponPopup () {
      this.$store.commit('CLOSE_POP')
      this.active.coupon = false
    },
    showCouponPopup () {
      if (!this.orderCouponCnt) {
        Alert({
          message: '適用可能なクーポンがありません。'
        })
      } else {
        this.$store.commit('SHOW_POP')
        this.useAccumulationAmt = 0
        this.$emit('changeAccumulationAmt', 0)

        this.$store.dispatch('ordersheet/calculateConpons', { orderSheetNo: this.orderSheetNo, couponRequest: this.couponRequest })
        this.active.coupon = true
      }
    },
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
          message: '保有ポイントがありません。'
        })
      }
      if (totalStandardAmt < availableMinAccumulationAmt || minAccumulationLimit > availableMaxAccumulationAmt || minAccumulationLimit > accumulationAmt) {
        this.useAccumulationAmt = 0
      } else {
        this.useAccumulationAmt = availableMaxAccumulationAmt
      }
      this.$emit('changeAccumulationAmt', this.useAccumulationAmt)
      this.useAccumulationAmt = formatCurrency(this.useAccumulationAmt)
    }
  }
}
</script>
