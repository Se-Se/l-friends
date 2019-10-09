<template>
  <div class="order-confirm">
    <app-checkbox v-model="agreeCheckAll">
      <p class="order-agree-label__wrapper">
        <span class="order-agree-label">
          주문결제 전체 동의
        </span>
        <img
          class="order-agree-open"
          :class="{ opened: open }"
          src="~@/assets/images/mobile/ic-small-down.svg"
          @click.prevent.stop="open = !open"
        >
      </p>
    </app-checkbox>
    <div
      v-if="open"
      class="order-agree-childs"
    >
      <app-checkbox
        v-if="PRIVACY_USAGE_AGREEMENT"
        v-model="agree.privacyUsageAgreement"
        :id="'Checkbox___' + Math.floor(Math.random() * 100000)"
      >
        <span class="order-agree-childs-label">
          개인정보 수집 · 이용 동의
          <a
            href="#"
            @click.prevent="agreeInformation('privacyUsageAgreement')"
          >
            보기
          </a>
        </span>
      </app-checkbox>
      <app-checkbox
        v-if="SELLER_PRIVACY_USAGE_AGREEMENT"
        v-model="agree.sellerPrivacyUsageAgreement"
        :id="'Checkbox___' + Math.floor(Math.random() * 100000)"
      >
        <span class="order-agree-childs-label">
          개인정보 판매자 제공 동의
          <a
            href="#"
            @click.prevent="agreeInformation('sellerPrivacyUsageAgreement', order)"
          >
            보기
          </a>
        </span>
      </app-checkbox>
      <app-checkbox
        v-if="CUSTOMS_CLEARANCE_AGREEMENT"
        v-model="agree.customsClearanceAgreement"
        :id="'Checkbox___' + Math.floor(Math.random() * 100000)"
      >
        <span class="order-agree-childs-label">
          통관정보 수집 · 이용 동의
          <a
            href="#"
            @click.prevent="agreeInformation('customsClearanceAgreement')"
          >
            보기
          </a>
        </span>
      </app-checkbox>
      <app-checkbox
        v-if="OVERSEA_PRIVACY_USAGE_AGREEMENT"
        v-model="agree.overseaPrivacyUsageAgreement"
        :id="'Checkbox___' + Math.floor(Math.random() * 100000)"
      >
        <span class="order-agree-childs-label">
          개인정보 국외 이전 동의
          <a
            href="#"
            @click.prevent="agreeInformation('overseaPrivacyUsageAgreement', order)"
          >
            보기
          </a>
        </span>
      </app-checkbox>
      <app-checkbox
        v-model="agree.confirmPayment"
        :id="'Checkbox___' + Math.floor(Math.random() * 100000)"
      >
        <span class="order-agree-childs-label">
          구매동의
          <a
            href="#"
            @click.prevent="agreeInformation('confirmPayment')"
          >
            보기
          </a>
        </span>
      </app-checkbox>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import AppCheckbox from '@/components/mobile/common/input/Checkbox'

export default {
  name: 'OrderConfirm',
  props: ['order'],
  components: {
    AppCheckbox
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
      open: false
    }
  },
  computed: {
    agreeCheckAll: {
      get () {
        return (this.agree.privacyUsageAgreement === this.PRIVACY_USAGE_AGREEMENT) &&
          (this.agree.nonMemberPrivacyUsageAgreement === this.NONE_MEMBER_PRIVACY_USAGE_AGREEMENT) &&
          (this.agree.sellerPrivacyUsageAgreement === this.SELLER_PRIVACY_USAGE_AGREEMENT) &&
          (this.agree.customsClearanceAgreement === this.CUSTOMS_CLEARANCE_AGREEMENT) &&
          (this.agree.overseaPrivacyUsageAgreement === this.OVERSEA_PRIVACY_USAGE_AGREEMENT) &&
          (this.agree.termsOfUse === this.TERMS_OF_USE) &&
          (this.agree.confirmPayment === true)
      },
      set (value) {
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
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .checkbox--wrap {
  display: flex;
}

.order-agree {
  &-label {
    &__wrapper {
      width: calc(100% - 2rem);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    font-family: 'Noto Sans KR';
    font-size: 1.4rem;
    font-weight: bold;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #00d664;
  }

  &-open {
    width: 2rem;
    height: 2rem;
    transition: transform .2s;

    &.opened {
      transform: rotate(-180deg);
    }
  }

  &-childs {
    margin-top: 2rem;
    border-top: 1px solid #eee;
    padding: 2rem 0 2rem;

    > *:not(:last-child) {
      margin-bottom: 0.7rem;
    }

    &-label {
      width: calc(100% - 2rem);
      display: flex;
      justify-content: space-between;
      align-items: center;

      margin-left: 1.2rem;
      font-family: 'Noto Sans KR';
      font-size: 1.4rem;
      font-weight: normal;
      line-height: normal;
      letter-spacing: -0.01rem;
      color: #333333;

      a {
        font-family: 'Noto Sans KR';
        font-size: 1.4rem;
        font-weight: normal;
        line-height: normal;
        letter-spacing: -0.01rem;
        color: #999999;
        text-decoration: underline;
      }
    }
  }
}
</style>

