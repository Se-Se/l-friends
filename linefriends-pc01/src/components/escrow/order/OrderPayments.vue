<template>
  <div>
  <privacy-usage-agreement ref="privacyUsageAgreement"></privacy-usage-agreement>
  <confirm-payment ref="ConfirmPayment"></confirm-payment>
  <div class="final-payment_info">
    <div class="filter">
      <h2>最終お支払い情報</h2>
    </div>

    <div class="info">
      <table class="table_set ta_pl_0">
        <tbody>
          <tr>
            <th><span class="">小計(税込)</span>
              <div class="tip">
                <div class="tip_popup tip_popup_position size_1 size_5 size_7">
                  <dl>
                    <dt>商品価格(税抜)</dt>
                    <dd><i class="uom2">￥</i><span class="num">{{totalCartTaxAmt | formatCurrency}}</span></dd>
                  </dl>
                  <dl class="opt_pb_4">
                    <dt>割引</dt>
                    <dd v-if="order.paymentInfo.totalImmediateDiscountAmt !== 0">
                        <i class="uom2">-￥</i><span class="num">{{order.paymentInfo.totalImmediateDiscountAmt | formatCurrency}}</span>
                    </dd>
                      <dd v-else>
                          <i class="uom2">￥</i><span class="num">0</span>
                      </dd>
                  </dl>
                  <dl>
                    <dt>特別割引</dt>
                    <dd v-if="order.paymentInfo.totalAdditionalDiscountAmt !== 0">
                        <i class="uom2">-￥</i><span class="num">{{ order.paymentInfo.totalAdditionalDiscountAmt | formatCurrency }}</span>
                    </dd>
                    <dd v-else>
                        <i class="uom2">￥</i><span class="num">0</span>
                    </dd>
                  </dl>
                  <dl>
                    <dt>商品割引クーポン</dt>
                    <dd v-if="order.paymentInfo.productCouponAmt !== 0">
                        <i class="uom2">-￥</i><span class="num">{{order.paymentInfo.productCouponAmt | formatCurrency}}</span>
                    </dd>
                    <dd v-else>
                        <i class="uom2">￥</i><span class="num">0</span>
                    </dd>
                  </dl>
                  <dl>
                    <dt>カートクーポン</dt>
                    <dd v-if="order.paymentInfo.cartCouponAmt !== 0">
                        <i class="uom2">-￥</i><span class="num">{{order.paymentInfo.cartCouponAmt | formatCurrency}}</span>
                    </dd>
                    <dd v-else>
                        <i class="uom2">￥</i><span class="num">0</span>
                    </dd>
                  </dl>
                  <dl>
                    <dt>消費税</dt>
                    <dd><i class="uom2">￥</i><span class="num">{{ order.paymentInfo.salesTaxAmt | formatCurrency }}</span></dd>
                  </dl>
                </div>
              </div>
            </th>
            <td>
              <i class="uom2">￥</i><span class="num" v-if="order.paymentInfo">{{totalCartAmt | formatCurrency}}</span>
            </td>
          </tr>
          <th>
            送料
            <div class="tip">
              <div class="tip_popup size_1">
                <dl class="opt_pb_4">
                  <dt>送料</dt>
                  <dd><i class="uom2">￥</i><span class="num">{{totalDeliveryAmt | formatCurrency}}</span></dd>
                </dl>
                <dl class="opt_pb_4">
                  <dt class="warm-grey">└ 基本送料</dt>
                  <dd class="warm-grey"><i class="uom2">￥</i><span class="num">{{this.order.paymentInfo.deliveryAmt | formatCurrency}}</span></dd>
                </dl>
                <dl class="opt_pb_4">
                  <dt class="warm-grey">└ 地域別追加送料</dt>
                  <dd class="warm-grey"><i class="uom2">￥</i><span class="num">{{ this.order.paymentInfo.remoteDeliveryAmt || 0 | formatCurrency }}</span></dd>
                </dl>
              </div>
            </div>
          </th>
          <td>
            <i class="uom2">￥</i><span class="num">{{totalDeliveryAmt | formatCurrency}}</span>
          </td>
        </tbody>
        <tfoot>
          <tr>
            <th>お支払金額</th>
            <td>
              <i class="uom2">￥</i><span class="num">{{order.paymentInfo.paymentAmt | formatCurrency}}</span>
            </td>
          </tr>
        </tfoot>
      </table>
      <div class="agree ag_bg_white" :class="showOption ? 'off' : ''">
        <div class="option opt_mg_20">
          <span class="bx_input text-green">
            <input id="personal-2" type="checkbox" v-model="agreeCheckAll">
            <label for="personal-2">お支払に関する内容に同意する</label>
          </span>
          <div class="bx_select" @click="showOption = !showOption">
            <span class="ico_arrow"></span>
          </div>
        </div>
        <div class="option border-bt-1 opt_mg_20" v-if="showOption" style="display: block;">
          <ul>
            <li :class="agree.privacyUsageAgreement ? 'on' : ''" v-if="PRIVACY_USAGE_AGREEMENT">
              <span class="bx_input">
                <input id="personal-3" type="checkbox" checked="" v-model="agreeCheck.privacyUsageAgreement" :v-model="agreeCheck.confirmPayment ? agreeCheckAll : agreeCheck.privacyUsageAgreement">
                <label for="personal-3">個人情報の第三者提供に<br>同意する</label>
              </span>
              <a class="view" href="javascript:void(0)" @click="agreeInformation('privacyUsageAgreement')">表示</a>
            </li>
            <li>
              <span class="bx_input" v-if="PRIVACY_USAGE_AGREEMENT">
                <input id="personal-4" type="checkbox" checked="" v-model="agreeCheck.confirmPayment" :v-model="agreeCheck.privacyUsageAgreement ? agreeCheckAll : agreeCheck.confirmPayment">
                <label for="personal-4">購入に同意する</label>
              </span>
              <span class="bx_input" v-else>
                <input id="personal-5" type="checkbox" checked="" v-model="agreeCheckAll">
                <label for="personal-5">購入に同意する</label>
              </span>
              <a class="view" href="javascript:void(0)" @click="agreeInformation('confirmPayment')">表示</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <ul class="mode">
      <li>
        <button class="btn btn_black" @click.prevent="payments(`GMO`,`CARD`)" >クレジットカード</button>
      </li>
      <!--<li>-->
        <!--<button class="btn btn_black" @click.prevent="payments(`NONE`,`CONVENIENCE`)">コンビニ決済</button>-->
      <!--</li>-->
      <li>
        <button class="btn btn_green" @click.prevent="payments(`LINE`,`LINEPAY`)" >LINE Pay</button>
      </li>
    </ul>
  </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState, mapGetters } from 'vuex'
import { Alert } from '@/components/common/modal'
import $ from 'jquery'
import PrivacyUsageAgreement from './popup/PrivacyUsageAgreement'
import ConfirmPayment from './popup/ConfirmPayment'

export default {
  props: ['order', 'orderProductOptions', 'paymentInfo'],
  data () {
    return {
      active: {
        order: false,
        payment: false
      },
      accumulationAmt: 0,
      showOption: false,
      agree: {
        agreement: false,
        // 최초 1회만 받음
        privacyUsageAgreement: false,
        // 비회원일 경우에만 활성화
        termsOfUse: false,
        // 비회원일 경우에만 활성화
        nonMemberPrivacyUsageAgreement: false,
        sellerPrivacyUsageAgreement: false,
        // 해외배송 상품이 있을 경우만 활성화
        customsClearanceAgreement: false,
        // 해외공급사가 제공하는 상품이 포함되어 있는 경우만 활성화
        overseaPrivacyUsageAgreement: false
      },
      agreeCheck: {
        // 최초 1회만 받음
        privacyUsageAgreement: false,
        // 비회원일 경우에만 활성화
        termsOfUse: false,
        // 비회원일 경우에만 활성화
        nonMemberPrivacyUsageAgreement: false,
        sellerPrivacyUsageAgreement: false,
        // 해외배송 상품이 있을 경우만 활성화
        customsClearanceAgreement: false,
        // 해외공급사가 제공하는 상품이 포함되어 있는 경우만 활성화
        overseaPrivacyUsageAgreement: false,
        // 결제진행 동의
        confirmPayment: false
      },
      payClickCheck: false
    }
  },
  computed: {
    ...mapGetters('profile', ['isExec']),
    ...mapState('fixedItems', ['meetFooterWithAreaOrderInformation', 'underAreaOrderInformation']),
    ...mapState('ordersheet', ['usePaycoCoupon']),
    ...mapState('myorder', ['pointName']),
    agreeCheckAll: {
      get () {
        let flag = (this.agreeCheck.privacyUsageAgreement === this.PRIVACY_USAGE_AGREEMENT) &&
          // (this.agreeCheck.nonMemberPrivacyUsageAgreement === this.NONE_MEMBER_PRIVACY_USAGE_AGREEMENT) &&
          // (this.agreeCheck.sellerPrivacyUsageAgreement === this.SELLER_PRIVACY_USAGE_AGREEMENT) &&
          // (this.agreeCheck.customsClearanceAgreement === this.CUSTOMS_CLEARANCE_AGREEMENT) &&
          // (this.agreeCheck.overseaPrivacyUsageAgreement === this.OVERSEA_PRIVACY_USAGE_AGREEMENT) &&
          // (this.agreeCheck.termsOfUse === this.TERMS_OF_USE) &&
          (this.agreeCheck.confirmPayment === true)
        return flag
      },
      set (value) {
        this.agreeAll(value)
      }
    },
    totalCartAmt () {
      return this.order.paymentInfo.totalStandardAmt- this.order.paymentInfo.totalImmediateDiscountAmt - this.order.paymentInfo.totalAdditionalDiscountAmt - this.order.paymentInfo.productCouponAmt - this.order.paymentInfo.cartCouponAmt
    },
    totalCartTaxAmt () {
      return this.order.paymentInfo.totalStandardAmt - this.order.paymentInfo.salesTaxAmt
    },
    totalDeliveryAmt () {
      return this.order.paymentInfo.deliveryAmt + this.order.paymentInfo.remoteDeliveryAmt
    },
    totalStandardAmt () {
      return this.order.paymentInfo.totalStandardAmt
    },
    totalDiscountAmt () {
      return this.order.paymentInfo.totalAdditionalDiscountAmt +
        this.order.paymentInfo.totalImmediateDiscountAmt +
        this.order.paymentInfo.productCouponAmt +
        this.order.paymentInfo.cartCouponAmt
    },
    // totalDeliveryAmt () {
    //   return this.order.paymentInfo.deliveryAmt
    // },
    payAmt () {
      return this.totalStandardAmt - this.totalDiscountAmt + this.totalDeliveryAmt
    },
    showTotalDiscountAmt () {
      return this.totalDiscountAmt > 0 ? this.totalDiscountAmt * -1 : this.totalDiscountAmt
    },
    showDeliveryCouponAmt () {
      return this.order.paymentInfo.deliveryCouponAmt > 0 ? this.order.paymentInfo.deliveryCouponAmt * -1 : this.order.paymentInfo.deliveryCouponAmt
    },
    showTotalDeliveryAmt () {
      return this.order.paymentInfo.deliveryAmt + this.order.paymentInfo.remoteDeliveryAmt - this.order.paymentInfo.deliveryCouponAmt
    },
    TERMS_OF_USE: {
      get () {
        if (this.order) {
          return this.order.agreementTypes.some(item => item === 'TERMS_OF_USE')
        }
      }
    },
    // 개인정보 이용동의
    PRIVACY_USAGE_AGREEMENT: {
      get () {
        if (this.order) {
          return this.order.agreementTypes.some(item => item === 'PRIVACY_USAGE_AGREEMENT')
        }
      }
    },
    // 비회원 개인정보 수집 및 이용 동의
    NONE_MEMBER_PRIVACY_USAGE_AGREEMENT: {
      get () {
        if (this.order) {
          return this.order.agreementTypes.some(item => item === 'NONE_MEMBER_PRIVACY_USAGE_AGREEMENT')
        }
      }
    },
    // 개인정보 판매자 제공 동의
    SELLER_PRIVACY_USAGE_AGREEMENT: {
      get () {
        if (this.order) {
          return this.order.agreementTypes.some(item => item === 'SELLER_PRIVACY_USAGE_AGREEMENT')
        }
      }
    },
    // 통관정보 수집 및 이용 동의
    CUSTOMS_CLEARANCE_AGREEMENT: {
      get () {
        if (this.order) {
          return this.order.agreementTypes.some(item => item === 'CUSTOMS_CLEARANCE_AGREEMENT')
        }
      }
    },
    // 개인정보 국외 이전 동의
    OVERSEA_PRIVACY_USAGE_AGREEMENT: {
      get () {
        if (this.order) {
          return this.order.agreementTypes.some(item => item === 'OVERSEA_PRIVACY_USAGE_AGREEMENT')
        }
      }
    },
    paycoBtnClass () {
      return {
        full: this.usePaycoCoupon
      }
    }
  },
  watch: {
    'active.order': 'orderOptionScroll',
    'active.payment': 'orderOptionScroll'
  },
  methods: {
    payments (pgType, payType) {
      this.payClickCheck = true
      if (payType === 'CONVENIENCE') {
        Alert({
          message: '準備中です。'
        })
      } else {
        this.$emit('payments', pgType, payType)
      }
      setTimeout(() => this.payClickCheck = false, 5000);
    },
    orderOptionScroll () {
      this.$nextTick(() => {
        if ($('#area_order_option').height() >= $('footer')[0].getBoundingClientRect().top) {
          this.$store.commit('fixedItems/UNDER_AREA_ORDER_INFORMATION', false)
          this.$store.commit('fixedItems/MEET_FOOTER_WITH_AREA_ORDER_INFORMATION', true)
        } else {
          this.$store.commit('fixedItems/UNDER_AREA_ORDER_INFORMATION', true)
          this.$store.commit('fixedItems/MEET_FOOTER_WITH_AREA_ORDER_INFORMATION', false)
        }
        if ($('#area_order_option').offset().top <= $('#area_order_information').offset().top) {
          this.$store.commit('fixedItems/UNDER_AREA_ORDER_INFORMATION', false)
          this.$store.commit('fixedItems/MEET_FOOTER_WITH_AREA_ORDER_INFORMATION', false)
        }
      })
    },
    agreeAll (value) {
      if (this.PRIVACY_USAGE_AGREEMENT) {
        this.agreeCheck.privacyUsageAgreement = value
      }
      if (this.NONE_MEMBER_PRIVACY_USAGE_AGREEMENT) {
        this.agreeCheck.nonMemberPrivacyUsageAgreement = value
      }
      if (this.SELLER_PRIVACY_USAGE_AGREEMENT) {
        this.agreeCheck.sellerPrivacyUsageAgreement = value
      }
      if (this.CUSTOMS_CLEARANCE_AGREEMENT) {
        this.agreeCheck.customsClearanceAgreement = value
      }
      if (this.OVERSEA_PRIVACY_USAGE_AGREEMENT) {
        this.agreeCheck.overseaPrivacyUsageAgreement = value
      }
      if (this.TERMS_OF_USE) {
        this.agreeCheck.termsOfUse = value
      }
      this.agreeCheck.confirmPayment = value
    },
    agreeInformation (type, order) {
      if (type === 'privacyUsageAgreement') {
        this.$refs.privacyUsageAgreement.show(type, order)
      } else {
        this.$refs.ConfirmPayment.show(type, order)
      }

      // this.agree[type] = !this.agree[type]
    }
  },
  components: {
    PrivacyUsageAgreement,
    ConfirmPayment
  }
}
</script>
