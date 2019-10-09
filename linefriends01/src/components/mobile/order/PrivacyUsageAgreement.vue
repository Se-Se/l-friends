<template>
  <transition name="terms-detail">
    <div
      v-show="active"
      class="terms-detail__wrapper"
    >
      <div
        ref="TermsDetail"
        class="terms-detail"
      >
        <sub-page-header
          :title="title"
          :close="true"
          :onClose="() => { close() }"
        />
        <div id="container">
          <template v-if="type === 'privacyUsageAgreement'">
            <p><strong>1.수집목적</strong></p>
            <p>물품 구매 및 배송처리</p>
            <br>
            <p><strong>2.수집항목</strong></p>
            <p>수령인의 이름, 수령인의 연락처, 배송지 주소</p>
            <br>
            <p><strong>3.보유이용기간</strong></p>
            <p>서비스 탈퇴시까지 보관함. 단 관련 법령에 따라 보관이 필요한 정보의 경우 해당 기간 동안 보관함.</p>
            <br>
            <p><strong>4.쇼핑몰 이용을 위한 필요 최소한의 개인정보이므로 동의를 해주셔야 서비스를  이용하실 수 있습니다.</strong></p>
          </template>
          <template class="txt_list" v-if="type === 'customsClearanceAgreement'">
            <p><strong>1.수집목적</strong></p>
            <p>해외 구매대행 상품의 통관(수입신고)</p>
            <br>
            <p><strong>2.수집항목</strong></p>
            <p>개인통관고유부호</p>
            <br>
            <p><strong>3.보유이용기간</strong></p>
            <p>물품구매 및 배송처리완료 또는 서비스 운영종료시까지</p>
          </template>
          <ul class="txt_list" v-if="type === 'overseaPrivacyUsageAgreement'">
            <p><strong>1.이전받는 자와 국적</strong></p>
            <template v-if="foreignPartners.length > 0" v-for="foreign in foreignPartners">
              <p>회사명: {{foreign.partnerName}}</p>
              <p>국적: {{foreign.countryCd}}</p>
              <p>정보관리책임자: {{foreign.privacyManagerName }}({{foreign.privacyManagerPhoneNo}})</p>
            </template>
            <br>
            <p><strong>2.이전목적</strong></p>
            <p>판매자와 구매자의 원활한 거래 진행, 본인의사의 확인, 고객상담 및 불만처리, 물품배송</p><br>
            <p><strong>3.이전되는 개인정보 항목</strong></p>
            <p>주문자 성명, 주문자 이메일, 주문자 휴대전화, 상품구매정보, 상품 수령인정보(이름, 주소, 연락처), 개인통관고유부호</p><br>
            <p><strong>4.이전 시기 및 이전 방법</strong></p>
            <p>주문완료 시 전용 관리자페이지를 통한 조회 및 출력</p><br>
            <p><strong>5.개인정보를 이전받는 자의 개인정보 보유 및 이용기간</strong></p>
            <p>배송 및 관련 CS처리 완료시까지</p><br>
            <p><strong>6.귀하는 동의를 거부할 권리가 있습니다. 다만 동의를 거부하시는 경우 주문 및 결제가 제한될 수 있습니다.</strong></p>
          </ul>
          <template v-if="type === 'sellerPrivacyUsageAgreement'">
            <p><strong>1.제공받는 자</strong></p>
            <template v-if="partners" v-for="partner in partners">
              <p>{{partner.partnerName}}</p>
            </template>
            <br>
            <p><strong>2.제공목적</strong></p>
            <p>판매자와 구매자의 원활한 거래 진행, 본인의사의 확인, 고객상담 및 불만처리, 물품배송</p><br>
            <p><strong>3.제공하는 개인정보 항목</strong></p>
            <p>주문자 성명, 주문자 이메일, 주문자 휴대폰번호, 상품구매정보, 상품 수령인 정보(이름, 주소, 연락처)</p><br>
            <p><strong>4.개인정보를 제공받는자의 개인정보보유 및 이용기간</strong></p>
            <p>배송 및 관련 CS처리 완료시까지</p><br>
            <p><strong>5.귀하는 동의를 거부할 권리가 있습니다. 다만 동의를 거부하시는 경우 주문 및 배송이 제한될 수 있습니다.</strong></p>
          </template>
          <template v-if="type === 'confirmPayment'">
            <p>주문할 상품의 상품명, 상품가격, 배송 정보를 확인하였으며, 구매에 동의하시겠습니까?<br/>(전자상거래법 제 8조 2항)</p>
          </template>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import $ from 'jquery'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'

const $elem = $('html, body')

export default {
  components: {
    SubPageHeader
  },
  data () {
    return {
      active: false,
      type: '',
      foreignPartners: [],
      partners: []
    }
  },
  computed: {
    title () {
      if (this.type === 'privacyUsageAgreement') {
        return '개인정보 수집 · 이용 동의'
      } else if (this.type === 'customsClearanceAgreement') {
        return '통관정보 수집 · 이용 동의'
      } else if (this.type === 'overseaPrivacyUsageAgreement') {
        return '개인정보 국외 이전 동의'
      } else if (this.type === 'sellerPrivacyUsageAgreement') {
        return '개인정보 판매자 제공 동의'
      } else if (this.type === 'confirmPayment') {
        return '구매동의'
      }
      return ''
    }
  },
  watch: {
    active (status) {
      if (status) {
        disablePageScroll(this.$refs.TermsDetail)
        $elem.css('overflow', 'hidden')
      } else {
        enablePageScroll(this.$refs.TermsDetail)
        $elem.css('overflow', '')
      }
    }
  },
  methods: {
    show (type, order) {
      if (order && order.foreignPartners && order.foreignPartners.length > 0) {
        this.foreignPartners = order.foreignPartners
      }
      if (order && order.sellerPrivacyUsagePartners && order.sellerPrivacyUsagePartners.length > 0) {
        this.partners = order.sellerPrivacyUsagePartners
      }
      this.type = type
      this.active = true
    },
    close () {
      this.active = false
    }
  }
}
</script>
<style lang="scss" scoped>
.terms-detail {
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  &__wrapper {
    position: fixed;
    z-index: 1005;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #fff;
  }

  &-enter-active,
  &-leave-active {
    transition: 0.3s;
  }

  &-enter,
  &-leave-to {
    opacity: 0;
    transform: translateY(5rem);
  }
}

#container {
  padding: 2rem 2rem;
  font-family: 'Noto Sans KR';
  font-size: 1.4rem;
  line-height: 1.5;
  letter-spacing: -0.01rem;
  color: #666;

  strong {
    color: #333;
    font-weight: 500;
    padding-bottom: 1rem;
    font-size: 1.6rem;
  }
  .privacy_title {
    font-weight: 500;
  }
  .p1 {
    font-size: 1.4rem;
  }
  .p1 b {
    display: inline-block;
    padding-bottom: 1rem;
    font-size: 1.6rem;
    font-weight: 500;
  }
}
</style>
