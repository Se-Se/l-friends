<template>
  <div>
    <div id="container" class="cart-order">
      <div class="wrap_category">
        <div class="category_left">
          <a href="#" class="btn_back" @click.prevent="goBack">Back</a>
        </div>
        <h2>注文・決済</h2>
      </div>

      <!-- ↓↓↓↓↓ cart_wrapper ↓↓↓↓↓ -->
      <div class="cart_wrapper">

        <div class="cart_main">
          <div class="" :class="{ '': true, 'close': cartFormSelectYn === false }">
            <div class="head_ttl">
              <p class="ttl">注文した商品<span class="data cart-order_data_margin_left" v-if="orderProductOptions">({{orderProductOptions.length}})</span></p>
              <p class="drawer1">
                <a href="#" @click.prevent="cartFormSelectYn=!cartFormSelectYn"></a>
              </p>
            </div>
            <div class="menuItems have_bottom">
              <div class="product_item pt-0" v-for="(item, key) in orderProductOptions" :key="key">
                <router-link :to="`/m/product/detail/${item.productNo}`" class="">
                <div class="product_item_cont">
                  <a href="#" class="thumbnail_inner size_m">
                    <div class="thumbnail">
                      <img :src="item.imageUrl">
                    </div>
                  </a>
                  <div class="product_info">
                    <ul class="product_info_status" v-if="item.reservation === true">
                      <li class="product_info_status_item">
                        <span class="badge badge_reserved">予約商品</span>
                      </li>
                      <li class="product_info_status_item">
                        <span class="product_delivery_date">{{item.reservationDeliveryYmdt.substring(0, 10)}}日から順次発送</span>
                      </li>
                    </ul>
                    <router-link :to="`/m/product/detail/${item.productNo}`" class="product_title mt-0"> {{(item.showProductName)}}</router-link>
                    <!--<router-link :to="`/m/product/detail/${item.productNo}`" class="product_title mt-0"> {{(item.showBrandName + item.showProductName)}}</router-link>-->
                    <p class="product_options">
                      <span v-for="(showOption, index) in item.showOptions" :key="index"><span v-if="index != 0">/</span> {{ showOption }} /</span>
                      <span> 数量: {{item.orderCnt}}</span>
                    </p>
                    <div class="product_detail size_s">
                      <dl class="product_detail_list new-style_size">
                        <dt>
                          <span class="new-color_999 new-under_line number" v-if="item.showDiscountAmt !== 0">
                            <span>￥</span>{{ item.showStandardAmt }}
                          </span>
                          <span class="number dark">
                            <span>￥</span>{{ item.showPrice }}
                          </span>
                          <span class="dark cart-text_number">(税込)</span>
                        </dt>
                      </dl>
                    </div>
                  </div>
                </div>
                </router-link>
              </div>

              <!-- <div class="head_ttl">
          <p class="ttl">고객 정보</p>
          <p class="drawer close">
            <a href="#"></a>
          </p>
        </div>
        <div class="product_item pt-0">
          <ul class="input_list">
            <li>
              <dl>
                <dt>주문자</dt>
                <dd>
                  <input type="text" placeholder="" value="이지영">
                </dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt>휴대전화</dt>
                <dd>
                  <input type="text" placeholder="">
                </dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt><span class="must">이메일</span></dt>
                <dd>
                  <input type="text" placeholder="" value="phenomenon_y@naver.com">
                </dd>
              </dl>
            </li>
          </ul>
        </div> -->
              <div class="temp_total">
                <p class="temp_total_prize">￥<span class="total_num" v-if="ordersheet">{{ ordersheet.paymentInfo.totalStandardAmt - ordersheet.paymentInfo.totalImmediateDiscountAmt - ordersheet.paymentInfo.totalAdditionalDiscountAmt - ordersheet.paymentInfo.productCouponAmt - ordersheet.paymentInfo.cartCouponAmt | formatCurrency }}</span> + ￥<span class="total_num" v-if="ordersheet">{{ ordersheet.paymentInfo.deliveryAmt + ordersheet.paymentInfo.remoteDeliveryAmt | formatCurrency }}</span> (送料) = ￥<span class="total_num" v-if="ordersheet">{{ ordersheet.paymentInfo.paymentAmt | formatCurrency }}</span></p>
                <p class="temp_total_txt">送料は東京基準となっており、<br>配送地域によって異なります。 </p>
              </div>
            </div>
          </div>
          <div class="menu">
            <!-- close -->
            <div class="" :class="{ '': true, 'close': deliveryFormSelectYn === false }">
              <div class="head_ttl">
                <p class="ttl">配送情報</p>
                <p class="drawer1">
                  <a href="#" @click.prevent="deliveryFormSelectYn=!deliveryFormSelectYn"></a>
                </p>
              </div>
              <OrderDeliveryInfo ref="orderDeliveryAddressInfo" v-if="ordersheet" :orderProductOptions="orderProductOptions" :delivery="deliveryCondition" :dTimes="setDeliveryTime" :address="recentAddresses" :defaultAdd="defaultAdd" :mail="ordersheet.ordererContact" :deliveryStartYmt="setDeliveryStartYmt" :deliveryConditionNo="deliveryConditionNo" />
            </div>
          </div>
          <div class="menu">
            <!-- close -->
            <div class="" :class="{ '': true, 'close': couponSelectYn === false }">
              <div class="head_ttl">
                <p class="ttl">割引情報</p>
                <p class="drawer1">
                  <a href="#" @click.prevent="couponSelectYn=!couponSelectYn"></a>
                </p>
              </div>
              <div class="menuItems">
                <div class="product_item pt-16">
                  <ul class="input_list">
                    <li>
                      <dl>
                        <dt>クーポン適用金額</dt>
                        <!--<order-sale-info v-if="ordersheet" :coupon="this.$store.state.ordersheet.orderCoupons" :payment-info="ordersheet.paymentInfo" ref="orderCouponApplyNew" @changeAccumulationAmt="changeAccumulationAmt" />-->
                        <dd>
                          <span class="table-grid__left w-70p pr-7">
                            <input type="text" placeholder="" v-if="this.ordersheet.paymentInfo" v-model="showTotalDiscountAmt" :readonly="true">
                          </span>
                          <span class="table-grid__right">
                            <button class="btn meta_se" @click="showCouponPopup">クーポン適用</button>
                          </span>
                          <!--<transition name="coupon-page" v-if="this.$store.state.ordersheet.orderCoupons">-->
                          <!--<div-->
                          <!--v-show="couponSelect"-->
                          <!--ref="couponPage"-->
                          <!--class="coupon-page"-->
                          <!--&gt;-->
                          <!--<coupon :coupon="this.$store.state.ordersheet.orderCoupons.products" @close="couponSelect = false" />-->
                          <!--</div>-->
                          <!--</transition>-->
                        </dd>
                      </dl>
                    </li>
                    <!-- <li>
                        <dl>
                          <dt>임직원 포인트</dt>
                          <dd>
                            <span class="table-grid__left w-70p pr-7">
                              <div class="base_info">
                                <input type="text" placeholder="" value="999,720￥">
                                <span class="base">/ 보유 999,999￥</span>
                              </div>
                            </span>
                            <span class="table-grid__right">
                              <button class="btn">クーポン適用</button>
                            </span>
                          </dd>
                        </dl>
                      </li> -->
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="menu">
            <!-- close -->
            <div class="" :class="{ '': true, 'close': paymentsSelectYn === false }">
              <div class="head_ttl">
                <p class="ttl">最終お支払い情報</p>
                <p class="drawer1">
                  <a href="#" @click.prevent="paymentsSelectYn=!paymentsSelectYn"></a>
                </p>
              </div>
              <div class="menuItems">
                <div class="pay_info">
                  <order-payment-confirm ref="orderPaymentConfirmNew" :order="ordersheet" @payments="setPayment" />
                  <div class="payment_method">
                    <ul>
                      <li class="" :class="{ '': true, 'on': paymentsKey === 'card' }">
                        <a href="#" @click.prevent="paymentsClicks('card','GMO','CARD')">
                          <span class="ico ico_1"></span>
                          <p class="txt">クレジットカード</p>
                        </a>
                      </li>
                      <!--<li :class="{ '': true, 'on': paymentsKey === 'CONVENIENCE' }">-->
                      <!--<a href="#" @click.prevent="paymentsClicks('CONVENIENCE','NONE','CONVENIENCE')">-->
                      <!--<span class="ico ico_5"></span>-->
                      <!--<p class="txt">コンビニ決済</p>-->
                      <!--</a>-->
                      <!--</li>-->
                      <li :class="{ '': true, 'on': paymentsKey === 'line' }">
                        <a href="#" @click.prevent="paymentsClicks('line','LINE','LINEPAY')">
                          <span class="ico ico_6"></span>
                          <p class="txt">LINE Pay</p>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div class="menu_sub no-border">
                    <!-- close -->
                    <order-confirm :order="ordersheet" ref="orderPaymentConfirm" @open="({ type, order }) => $refs.privacyUsageAgreement.show(type, order)" />

                  </div>
                  <ul class="product_active single">
                    <li><button class="btn btn_green" @click.prevent="payments(pgTypeTo,payTypeTo)" v-if="ordersheet">￥{{ ordersheet.paymentInfo.paymentAmt | formatCurrency }} お支払い</button></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- ↑↑↑↑↑ cart_wrapper ↑↑↑↑↑ -->
    </div>
    <transition name="coupon-page" >
      <div v-show="couponSelect" ref="couponPage" class="coupon-page">
        <coupon :coupon="this.$store.state.ordersheet.orderCoupons.products" @close="couponSelect = false" />
      </div>
    </transition>
  </div>
</template>

<script>
/* eslint-disable */
import OrderDeliveryInfo from '@/components/escrow/order/OrderDeliveryInfo'
import OrderSheetNew from '@/components/mixins/order/OrderSheetNew.js'
import OrderPaymentConfirm from '@/components/escrow/order/OrderPaymentConfirm'
// import OrderSaleInfo from '@/components/escrow/order/OrderSaleInfo'
import OrderConfirm from '@/components/escrow/order/OrderConfirm'
import PrivacyUsageAgreement from '@/components/escrow/order/PrivacyUsageAgreement'
import { Alert } from '@/components/common/modal'
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import { formatCurrency } from '@/utils/StringUtils'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'
import * as $ from 'jquery'
import Coupon from '@/components/escrow/order/Coupon'

export default {
  name: 'OrderSheet',
  mixins: [OrderSheetNew],
  data () {
    return {
      deliveryFormSelectYn: true,
      couponSelectYn: true,
      paymentsSelectYn: true,
      paymentsKey: 'card',
      pgTypeTo: 'GMO',
      payTypeTo: 'CARD',
      cartFormSelectYn: true,
      privacySelectYn: true,
      orderSheetNo: this.$store.state.route.params.orderSheetNo,
      useAccumulationAmt: 0,
      couponSelect: false
    }
  },
  watch: {
    // couponSelect (next) {
    //   if (next) {
    //     disablePageScroll(this.$refs.couponPage)
    //     $elem.css('overflow', 'hidden')
    //   } else {
    //     enablePageScroll(this.$refs.couponPage)
    //     $elem.css('overflow', '')
    //   }
    // }
  },
  computed: {
    ...mapState('ordersheet', ['orderCoupons', 'couponAmt', 'couponRequest']),
    ...mapGetters('ordersheet', ['orderCouponCnt']),
    showTotalDiscountAmt () {
      let totalDiscountAmt = this.ordersheet.paymentInfo.productCouponAmt + this.ordersheet.paymentInfo.cartCouponAmt + this.ordersheet.paymentInfo.deliveryCouponAmt
      return formatCurrency(totalDiscountAmt)
    },
    accumulationAmt () {
      return formatCurrency(this.ordersheet.paymentInfo.accumulationAmt)
    },
    showTotalDeliveryAmt () {
      return this.ordersheet.paymentInfo.deliveryAmt + this.ordersheet.paymentInfo.remoteDeliveryAmt - this.ordersheet.paymentInfo.deliveryCouponAmt
    },
    defaultAdd () {
      if (this.recentAddresses) {
        return this.recentAddresses[0]
      }
    },
    deliveryMail () {
      if (this.ordersheet.ordererContact.ordererEmail) {
        return this.ordersheet.ordererContact.ordererEmail
      }
    },
    deliveryCondition () {
      if (this.$store.state.ordersheet.deliveryConditions) {
          return this.$store.state.ordersheet.deliveryConditions[0]
      }
    },
    deliveryConditionNo () {
      if (this.$store.state.ordersheet.ordersheet.deliveryGroups) {
          return this.$store.state.ordersheet.ordersheet.deliveryGroups[0].deliveryCondition.deliveryConditionNo
      }
    },
    setDeliveryTime () {
      if (this.$store.state.ordersheet.deliveryConditions) {
        return this.deliveryCondition.deliveryTimes
      }
    },
    setDeliveryStartYmt () {
      if(this.$store.state.ordersheet.deliveryConditions) {
        return this.$store.state.ordersheet.deliveryConditions[0].deliveryAvailableStartYmd
      }
    },
    orderProductOptionsSize () {
      return this.orderProductOptions.length
    }
  },
  methods: {
    setPayment (payment) {
      this.pgTypeTo = payment.pgType
      this.payTypeTo = payment.payType
    },
    changeAccumulationAmt (accumulationAmt) {
      this.$refs.orderCouponApplyNew.useAccumulationAmt = accumulationAmt
      this.$refs.orderPaymentConfirmNew.accumulationAmt = accumulationAmt
      this.orderData.subPayAmt = accumulationAmt
      const orderSheetNo = this.orderSheetNo
      this.$store.dispatch('ordersheet/calculateOrderAccumulation', { orderSheetNo, accumulationAmt })
    },
    paymentsClicks (payKey, pgType, payType) {
      switch (payKey) {
        case 'card':
          this.paymentsKey = 'card'
          this.pgTypeTo = pgType
          this.payTypeTo = payType
          break
        case 'CONVENIENCE':
          Alert({
            message: '準備中です。'
          })
          break
        case 'line':
          this.paymentsKey = 'line'
          this.pgTypeTo = pgType
          this.payTypeTo = payType
          break
      }
    },
    // payments (pgType, payType) {
    //   if (payType === 'CONVENIENCE') {
    //     Alert({
    //       message: '準備中です。'
    //     })
    //   } else {
    //     this.$emit('payments', pgType, payType)
    //   }
    // },
    goBack () {
      this.$router.go(-1)
    },
    agreeInformation (type, order) {
      this.$emit('open', { type, order })
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
    },
    showCouponPopup () {
      if (!this.orderCouponCnt) {
        Alert({
          message: '適用可能なクーポンがありません。'
        })
      } else {
        this.useAccumulationAmt = 0
        this.$emit('changeAccumulationAmt', 0)
        this.$store.dispatch('ordersheet/calculateConpons', { orderSheetNo: this.orderSheetNo, couponRequest: this.couponRequest })
        this.couponSelect = true
      }
    }
  },
  components: {
    OrderDeliveryInfo,
    OrderPaymentConfirm,
    OrderConfirm,
    PrivacyUsageAgreement,
    Coupon
  },
  created() {
        $('html').css('overflow', 'scroll')
  }
}
</script>
