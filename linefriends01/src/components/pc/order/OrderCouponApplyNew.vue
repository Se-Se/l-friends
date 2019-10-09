<!-- [D] 3. 쿠폰적용 영역 -->
<template>
  <div class="info_com mar-top-40">
    <h2 class="ttl_h2">할인{{ isExec ? ' 및 임직원 포인트' : '' }}</h2>
    <table class="table_info">
      <tbody>
        <tr>
          <th>쿠폰할인 금액</th>
          <td>
            <div class="table-grid">
              <div class="table-grid__left">
                <div class="input_size_1">
                  <input type="text" v-model="showTotalDiscountAmt" disabled="">
                  <span class="point">원</span>
                </div>
              </div>
              <div class="table-grid__right">
                <button class="btn_radius" @click.prevent="showCouponPopup" >쿠폰적용</button>
              </div>
            </div>
          </td>
        </tr>
        <tr v-if="isExec">
          <th>임직원 포인트 사용</th>
          <td>
            <div class="table-grid">
              <div class="table-grid__left">
                <div class="input_size_1">
                  <input type="text" v-model="useAccumulationAmt" @blur="changeAccumulationAmt" @focus="delSeparator">
                </div>
                <div class="point">
                  <p>원
                    <span class="line">/</span>
                  </p>
                  <p class="txt_color_red">
                    <span>보유</span>
                    <span class="num">{{accumulationAmt}}</span>
                    <span>원</span>
                  </p>
                </div>
              </div>
              <div class="table-grid__right">
                <button class="btn_radius" @click="maxAccumulationAmt">전액사용</button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <coupon-pop :orderCoupons="orderCoupons" :couponRequest="couponRequest" :orderCouponCnt="orderCouponCnt" @closeCouponPopup="closeCouponPopup" :active="active.coupon" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { formatCurrency } from '@/utils/StringUtils'
import { popupfixBodyForShow, popupReleaseBodyForClose, popupReleaseBodyForNaviBack } from '@/utils/utils.js'
import CouponPop from '@/components/pc/order/coupon/CouponPop'
import $ from 'jquery'
import { Alert, Confirm } from '@/utils/event-bus'

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
      popupReleaseBodyForClose(this.bodyScrollTop)
      this.active.coupon = false
    },
    showCouponPopup () {
      if (!this.orderCouponCnt) {
        Alert({
          message: '적용 가능한 쿠폰이 없습니다.'
        })
      } else {
        // $('html').css('overflow', 'hidden')
        this.useAccumulationAmt = 0
        this.$emit('changeAccumulationAmt', 0)
        this.bodyScrollTop = popupfixBodyForShow()

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
    }
  }
}
</script>
