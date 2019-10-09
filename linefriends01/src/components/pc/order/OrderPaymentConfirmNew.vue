<template>
  <div>
    <privacy-usage-agreement ref="privacyUsageAgreement"></privacy-usage-agreement>
    <div id="area_order_option" class="table-grid__right width-340 pad_left_40" :class="{stop_fixed: meetFooterWithAreaOrderInformation, top_fixed: underAreaOrderInformation}">
      <h2 class="ttl_h2">최종 결제 정보</h2>
      <div class="settlement">
        <div class="info">
          <table class="table_set">
            <tbody>
              <tr>
                <th>총 주문금액</th>
                <td>
                  <span>{{order.paymentInfo.totalStandardAmt + order.paymentInfo.deliveryAmt + order.paymentInfo.remoteDeliveryAmt - order.paymentInfo.deliveryCouponAmt | formatCurrency}}</span>원
                </td>
              </tr>
              <tr class="sub">
                <th>총 상품 금액</th>
                <td>
                  <span class="num">{{order.paymentInfo.totalStandardAmt | formatCurrency}}</span>원
                </td>
              </tr>
              <tr class="sub last">
                <th>
                  총 배송비
                  <div class="tip">
                    <div class="tip_popup size_1">
                      <dl>
                        <dt>배송비</dt>
                        <dd><span class="num">{{order.paymentInfo.deliveryAmt | formatCurrency}}</span>원</dd>
                      </dl>
                      <dl>
                        <dt>배송비할인쿠폰</dt>
                        <dd><span class="num">{{showDeliveryCouponAmt | formatCurrency}}</span>원</dd>
                      </dl>
                      <dl>
                        <dt>지역 별 추가 배송비</dt>
                        <dd><span class="num">{{order.paymentInfo.remoteDeliveryAmt | formatCurrency}}</span>원</dd>
                      </dl>
                      <div class="total_pop">
                        <dl>
                          <dt>총 배송비</dt>
                          <dd><span class="num">{{showTotalDeliveryAmt | formatCurrency}}</span>원</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </th>
                <td>
                  <span class="num">{{showTotalDeliveryAmt | formatCurrency}}</span>원
                </td>
              </tr>
              <tr>
                <th>
                  총 할인금액
                  <div class="tip">
                    <div class="tip_popup size_1">
                      <dl>
                        <dt>즉시 할인</dt>
                        <dd><span class="num">{{order.paymentInfo.totalImmediateDiscountAmt | formatCurrency}}</span>원</dd>
                      </dl>
                      <dl v-if="isSaleExec">
                        <dt>임직원할인</dt>
                        <dd><span class="num">{{order.paymentInfo.totalAdditionalDiscountAmt | formatCurrency}}</span>원</dd>
                      </dl>
                      <dl>
                        <dt>상품쿠폰할인</dt>
                        <dd><span class="num">{{order.paymentInfo.productCouponAmt | formatCurrency}}</span>원</dd>
                      </dl>
                      <dl>
                        <dt>장바구니 쿠폰</dt>
                        <dd><span class="num">{{order.paymentInfo.cartCouponAmt | formatCurrency}}</span>원</dd>
                      </dl>
                      <div class="total_pop">
                        <dl>
                          <dt>총 할인금액</dt>
                          <dd><span class="num">{{totalDiscountAmt | formatCurrency}}</span>원</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </th>
                <td>
                  <span class="num">{{showTotalDiscountAmt | formatCurrency}}</span>원
                </td>
              </tr>
              <tr v-if="isExec">
                <th>임직원 포인트 결제</th>
                <td>
                  <span class="num">{{accumulationAmt > 0 ? accumulationAmt * -1 : accumulationAmt | formatCurrency}}</span>원
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th>결제 금액</th>
                <td>
                  <span class="num">{{order.paymentInfo.paymentAmt | formatCurrency}}</span>원
                </td>
              </tr>
            </tfoot>
          </table>
          <div class="agree">
            <div class="option mar-btm-2">
              <span class="bx_input check2">
                <input id="all_agree" type="checkbox" v-model="agreeCheckAll">
                <label for="all_agree">
                  <p class="text-green">주문 결제 전체 동의</p>
                </label>
              </span>
              <div class="bx_select" @click="showOption = !showOption" v-toggle="active.order">
                <span class="ico_arrow">목록 열기</span>
              </div>
            </div>
            <div class="option" v-if="showOption">
              <ul>
                <li :class="agree.privacyUsageAgreement ? 'on' : ''" v-if="PRIVACY_USAGE_AGREEMENT">
                  <span class="bx_input check2">
                    <input id="personal_1" type="checkbox" v-model="agreeCheck.privacyUsageAgreement">
                    <label for="personal_1">개인정보 수집 · 이용 동의</label>
                  </span>
                  <a class="view" href="javascript:void(0)" @click="agreeInformation('privacyUsageAgreement')">보기</a>
                </li>
                <li :class="agree.sellerPrivacyUsageAgreement ? 'on' : ''" v-if="SELLER_PRIVACY_USAGE_AGREEMENT">
                  <span class="bx_input check2">
                    <input id="personal_2" type="checkbox" v-model="agreeCheck.sellerPrivacyUsageAgreement">
                    <label for="personal_2">개인정보 판매자 제공 동의</label>
                  </span>
                  <a class="view" href="javascript:void(0)" @click="agreeInformation('sellerPrivacyUsageAgreement', order)">보기</a>
                </li>
                <li :class="agree.customsClearanceAgreement ? 'on' : ''" v-if="CUSTOMS_CLEARANCE_AGREEMENT">
                  <span class="bx_input check2">
                    <input id="personal_3" type="checkbox" v-model="agreeCheck.customsClearanceAgreement">
                    <label for="personal_3">통관정보 수집 · 이용 동의</label>
                  </span>
                  <a class="view" href="javascript:void(0)" @click="agreeInformation('customsClearanceAgreement')">보기</a>
                </li>
                <li :class="agree.overseaPrivacyUsageAgreement ? 'on' : ''" v-if="OVERSEA_PRIVACY_USAGE_AGREEMENT">
                  <span class="bx_input check2">
                    <input id="personal_4" type="checkbox" v-model="agreeCheck.overseaPrivacyUsageAgreement">
                    <label for="personal_4">개인정보 국외 이전 동의</label>
                  </span>
                  <a class="view" href="javascript:void(0)" @click="agreeInformation('overseaPrivacyUsageAgreement', order)">보기</a>
                </li>
                <li class="on">
                  <span class="bx_input check2">
                    <input id="personal_4" type="checkbox" v-model="agreeCheck.confirmPayment">
                    <label for="personal_4">구매동의</label>
                  </span>
                  <a class="view" href="javascript:void(0)" @click="agreeInformation('confirmPayment')">보기</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <ul class="mode">
          <li
            v-if="!usePaycoCoupon && order.paymentInfo.paymentAmt !== 0"
            class="left"
          >
            <button class="btn_card" v-not-double-click @click.prevent="payments('INICIS', 'CREDIT_CARD')">신용카드 결제</button>
          </li>
          <li v-if="!usePaycoCoupon && order.paymentInfo.paymentAmt !== 0">
            <button class="btn_card" v-not-double-click @click.prevent="payments('INICIS', 'REALTIME_ACCOUNT_TRANSFER')">실시간 계좌이체</button>
          </li>
          <li
            v-if="!usePaycoCoupon && order.paymentInfo.paymentAmt !== 0"
            class="left bottom"
          >
            <button class="btn_card" v-not-double-click @click.prevent="payments('INICIS', 'MOBILE')">휴대폰 소액결제</button>
          </li>
          <li
            class="bottom"
            :class="paycoBtnClass"
            v-if="order.paymentInfo.paymentAmt !== 0"
          >
            <button class="btn_payco" v-not-double-click @click.prevent="payments('NAVER_EASY_PAY', 'NAVER_EASY_PAY')">네이버 페이</button>
          </li>
          <li class="full" v-if="order.paymentInfo.paymentAmt === 0">
            <button class="btn_payco" v-not-double-click @click.prevent="payments('INICIS', 'ACCUMULATION')">결제하기</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { Alert } from '@/utils/event-bus'
import $ from 'jquery'
import PrivacyUsageAgreement from './popup/PrivacyUsageAgreement'

export default {
  props: ['order', 'orderProductOptions'],
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
      }
    }
  },
  computed: {
    ...mapGetters('profile', ['isExec', 'isSaleExec']),
    ...mapState('fixedItems', ['meetFooterWithAreaOrderInformation', 'underAreaOrderInformation']),
    ...mapState('ordersheet', ['usePaycoCoupon']),
    ...mapState('myorder', ['pointName']),
    agreeCheckAll: {
      get () {
        let flag = (this.agreeCheck.privacyUsageAgreement === this.PRIVACY_USAGE_AGREEMENT) &&
          (this.agreeCheck.nonMemberPrivacyUsageAgreement === this.NONE_MEMBER_PRIVACY_USAGE_AGREEMENT) &&
          (this.agreeCheck.sellerPrivacyUsageAgreement === this.SELLER_PRIVACY_USAGE_AGREEMENT) &&
          (this.agreeCheck.customsClearanceAgreement === this.CUSTOMS_CLEARANCE_AGREEMENT) &&
          (this.agreeCheck.overseaPrivacyUsageAgreement === this.OVERSEA_PRIVACY_USAGE_AGREEMENT) &&
          (this.agreeCheck.termsOfUse === this.TERMS_OF_USE) &&
          (this.agreeCheck.confirmPayment === true)
        return flag
      },
      set (value) {
        this.agreeAll(value)
      }
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
    totalDeliveryAmt () {
      return this.order.paymentInfo.deliveryAmt
    },
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
      this.$emit('payments', pgType, payType)
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
      this.$refs.privacyUsageAgreement.show(type, order)
      // this.agree[type] = !this.agree[type]
    }
  },
  components: {
    PrivacyUsageAgreement
  }
}
</script>

<style scoped>
.text-green {
  color: #00D664;
  font-weight: bold;
}

.top_fixed {
  position: fixed;
  top: 0;
}

.stop_fixed {
  position: absolute;
  top: auto;
  bottom: 0;
}

#wrap.pc #container.payco .escrow .mode li.left {
  margin-right: 10px;
}

#wrap.pc #container.payco .escrow .mode li.bottom {
  margin-top: 10px;
}
</style>

