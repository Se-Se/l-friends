<template>
  <div class="" :class="{ '': true, 'close': privacySelectYn === false }">
    <div class="other bb_1">
      <p class="ttl">
        <span class="bx_input">
          <input id="all" type="checkbox" v-model="agreeCheckAll">
          <label for="all">IDを保存</label>
          <label class="txt" for="all">お支払に関する内容に同意する</label>
        </span>
      </p>
      <p class="drawer1 close">
        <a href="#" @click.prevent="privacySelectYn=!privacySelectYn"></a>
      </p>
    </div>
    <div class="menuItems">
      <div class="product_detail mt-12">
        <dl class="product_detail_list" v-if="PRIVACY_USAGE_AGREEMENT">
          <dt>
            <span class="bx_input">
              <input id="check-item-1" type="checkbox" v-model="agree.privacyUsageAgreement" :v-model="agree.confirmPayment ? agreeCheckAll : agree.privacyUsageAgreement">
              <label for="check-item-1">IDを保存</label>
              <label class="txt" for="check-item-1">個人情報の第三者提供に同意する</label>
            </span>
          </dt>
          <dd>
            <a href="#" @click.prevent="privateUsageAgreementSelectYn=!privateUsageAgreementSelectYn">表示</a>
          </dd>
        </dl>
        <dl class="product_detail_list">
          <dt>
            <span class="bx_input" v-if="PRIVACY_USAGE_AGREEMENT">
              <input id="check-item-2" type="checkbox" v-model="agree.confirmPayment" :v-model="agree.privacyUsageAgreement ? agreeCheckAll : agree.confirmPayment">
              <label for="check-item-2">IDを保存</label>
              <label class="txt" for="check-item-2">購入に同意する</label>
            </span>
            <span class="bx_input" v-else>
              <input id="check-item-3" type="checkbox" v-model="agreeCheckAll">
              <label for="check-item-3">IDを保存</label>
              <label class="txt" for="check-item-3">購入に同意する</label>
            </span>
          </dt>
          <dd>
            <a href="#" @click.prevent="confirmPaymentSelectYn=!confirmPaymentSelectYn">表示</a>
          </dd>
        </dl>
      </div>
    </div>
    <div v-show="privateUsageAgreementSelectYn">
      <privacy-usage-agreement @close="privateUsageAgreementSelectYn = false" />
    </div>
    <div v-show="confirmPaymentSelectYn">
      <confirm-payment @close="confirmPaymentSelectYn = false" />
     </div>
  </div>
</template>

<script>
/* eslint-disable */
import PrivacyUsageAgreement from '@/components/escrow/order/PrivacyUsageAgreement'
import ConfirmPayment from '@/components/escrow/order/ConfirmPayment'

export default {
  name: 'OrderConfirm',
  props: ['order'],
  components: {
      ConfirmPayment,
    PrivacyUsageAgreement
  },
  data () {
    return {
      agree: {
        // 최초 1회만 받음
        privacyUsageAgreement: false,
        // 비회원일 경우에만 활성화
        termsOfUse: false,
        // 비회원일 경우에만 활성화
        nonMemberPrivacyUsageAgreement: false,
        sellerPrivacyUsageAgreement: false,
        // 해외배송 상품이 있을 경우만 활성화
        customsClearanceAgreement: false,
        // 해외공급사가 제공하는 상품이 포함되어 있는 경우만 활성화t
        overseaPrivacyUsageAgreement: false,
        // 결제진행 동의
        confirmPayment: false
      },
      privacySelectYn: true,
      open: false,
      privateUsageAgreementSelectYn: false,
      confirmPaymentSelectYn: false
    }
  },
  computed: {
    agreeCheckAll: {
      get () {
        return (this.agree.privacyUsageAgreement === this.PRIVACY_USAGE_AGREEMENT) &&
          // (this.agree.nonMemberPrivacyUsageAgreement === this.NONE_MEMBER_PRIVACY_USAGE_AGREEMENT) &&
          // (this.agree.sellerPrivacyUsageAgreement === this.SELLER_PRIVACY_USAGE_AGREEMENT) &&
          // (this.agree.customsClearanceAgreement === this.CUSTOMS_CLEARANCE_AGREEMENT) &&
          // (this.agree.overseaPrivacyUsageAgreement === this.OVERSEA_PRIVACY_USAGE_AGREEMENT) &&
          // (this.agree.termsOfUse === this.TERMS_OF_USE) &&
          (this.agree.confirmPayment === true)
      },
      set (value) {
        this.agreeAll(value)
      }
      // set (next) {
      //   for (const key in this.agree) {
      //     Vue.set(this.agree, key, next)
      //   }
      // }
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
    }
  },
  methods: {
    agreeInformation (type, order) {
      this.$emit('open', { type, order })
    },
    agreeAll (value) {
      if (this.PRIVACY_USAGE_AGREEMENT) {
        this.agree.privacyUsageAgreement = value
      }
      if (this.NONE_MEMBER_PRIVACY_USAGE_AGREEMENT) {
        this.agree.nonMemberPrivacyUsageAgreement = value
      }
      if (this.SELLER_PRIVACY_USAGE_AGREEMENT) {
        this.agree.sellerPrivacyUsageAgreement = value
      }
      if (this.CUSTOMS_CLEARANCE_AGREEMENT) {
        this.agree.customsClearanceAgreement = value
      }
      if (this.OVERSEA_PRIVACY_USAGE_AGREEMENT) {
        this.agree.overseaPrivacyUsageAgreement = value
      }
      if (this.TERMS_OF_USE) {
        this.agree.termsOfUse = value
      }
      this.agree.confirmPayment = value
    }
  }
}
</script>
