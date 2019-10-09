<template>
  <div style="margin-top: 50px;">
    <!-- TODO 약관을 넣어야 합니다. -->
    <h3 class="tit tit_check">
      <span class="txt">주문결제동의</span>
      <span class="bx_input">
        <input type="checkbox" id="all_agree2" v-model="agreeCheckAll">
        <label for="all_agree2">전체 동의</label>
      </span>
    </h3>
    <div class="payment_agree">
      <ul class="lst_description check">
        <li :class="agree.privacyUsageAgreement ? 'on' : ''" v-if="PRIVACY_USAGE_AGREEMENT">
          <div class="bx_tit">
            <span class="bx_input">
              <input type="checkbox" id="personal2" v-model="agreeCheck.privacyUsageAgreement">
              <label for="personal2">개인정보 수집 · 이용 동의</label>
            </span>
            <button type="button" class="btn_status" @click="agreeInformation('privacyUsageAgreement')">
              <span class="ico_arrow">목록 열림</span>
            </button>
          </div>
          <div class="area_txt">
            <p class="dsc_terms">
              1. 수집목적<br>물품 구매 및 배송처리<br>
              2. 수집항목<br>수령인의 이름, 수령인의 연락처, 배송지 주소<br>
              3. 보유이용기간<br>서비스 탈퇴시 또는 서비스 운영종료시까지<br>
              4. 쇼핑몰 이용을 위한 필요 최소한의 개인정보이므로 동의를 해주셔야 서비스를  이용하실 수 있습니다.
            </p>
          </div>
        </li>
        <!-- <li :class="agree.privacyConsignAgreement ? 'on' : ''" v-if="PRIVACY_USAGE_AGREEMENT">
          <div class="bx_tit">
            <span class="bx_input">
              <input type="checkbox" id="personal3" v-model="agreeCheck.privacyUsageAgreement">
              <label for="personal2">개인정보 처리 위탁 동의</label>
            </span>
            <button type="button" class="btn_status" @click="agreeInformation('privacyUsageAgreement')">
              <span class="ico_arrow">목록 열림</span>
            </button>
          </div>
          <div class="area_txt">
            <p class="dsc_terms">
              회사는 원활한 서비스 제공을 위해 다음과 같은 업무를 수탁 업체에 처리 위탁함에 동의합니다.<br>
              &nbsp;&nbsp;* 주문 결제 처리  - 엔에이치엔페이코(주)<br>
              &nbsp;&nbsp;&nbsp;&nbsp;구매 상품 배송  - 다다지엘에스<br>
              &nbsp;&nbsp;&nbsp;&nbsp;상담 문의 지원  - 엔에이치엔서비스(주)
            </p>
          </div>
        </li> -->
        <li :class="agree.sellerPrivacyUsageAgreement ? 'on' : ''" v-if="SELLER_PRIVACY_USAGE_AGREEMENT">
          <div class="bx_tit">
            <span class="bx_input">
              <input type="checkbox" id="personal4" v-model="agreeCheck.sellerPrivacyUsageAgreement">
              <label for="personal4">개인정보판매자 제공 동의</label>
            </span>
            <button type="button" class="btn_status" @click="agreeInformation('sellerPrivacyUsageAgreement')">
              <span class="ico_arrow">목록 닫힘</span>
            </button>
          </div>
          <div class="area_txt">
            <p class="dsc_terms">
              <span class="txt_em">
                1. 제공받는자<br>
                <template v-for="txt in sellerList">
                  {{txt}}<br :key="txt" />
                </template>
                2. 제공목적<br>판매자와 구매자의 원활한 거래진행, 본인 의사의 확인, 고객상담 및 불만처리, 물품배송
              </span><br>
                3. 제공하는 개인정보 항목<br>주문자 성명, 주문자 이메일, 주문자 휴대전화, 상품 구매정보, 상품 수령인 정보(이름, 주소, 연락처)<br>
              <span class="txt_em">4. 개인정보를 제공받는자의 개인정보보유 및 이용기간<br>배송 및 관련 CS처리 완료시까지</span><br>
                5. 귀하는 동의를 거부할 권리가 있습니다. 다만 동의를 거부하시는 경우 주문 및 배송이 제한될 수 있습니다.
            </p>
          </div>
        </li>
        <li :class="agree.customsClearanceAgreement ? 'on' : ''" v-if="CUSTOMS_CLEARANCE_AGREEMENT">
          <div class="bx_tit">
            <span class="bx_input">
              <input type="checkbox" id="personal5" v-model="agreeCheck.customsClearanceAgreement">
              <label for="personal5">통관정보 수집 · 이용 동의</label>
            </span>
            <button type="button" class="btn_status" @click="agreeInformation('customsClearanceAgreement')">
              <span class="ico_arrow">목록 닫힘</span>
            </button>
          </div>
          <div class="area_txt">
            <p class="dsc_terms">
              1. 수집 목적: 해외 구매 대행 상품의 통관(수입신고)<br>
              2. 수집 항목: 수령자 이름,수령자의 개인통관고유번호<br>
              <span class="txt_em">3. 보유·이용 기간: 서비스 탈퇴 시까지 보관함. 단, 관련 법령에 따라 보관이 필요한 정보의 경우 해당 기간 동안 보관함.</span><br>
              4. 귀하는 동의를 거부할 권리가 있습니다. 다만 동의를 거부하시는 경우 주문 및 결제가 제한될 수 있습니다.
            </p>
          </div>
        </li>
        <li :class="agree.overseaPrivacyUsageAgreement ? 'on' : ''" v-if="OVERSEA_PRIVACY_USAGE_AGREEMENT">
          <div class="bx_tit">
            <span class="bx_input">
              <input type="checkbox" id="personal6" v-model="agreeCheck.overseaPrivacyUsageAgreement">
              <label for="personal6">개인정보 국외 이전 동의</label>
            </span>
            <button type="button" class="btn_status" @click="agreeInformation('overseaPrivacyUsageAgreement')">
              <span class="ico_arrow">목록 닫힘</span>
            </button>
          </div>
          <div class="area_txt">
            <p class="dsc_terms">
              1. 이전 받는 자와 국적<br>
              <template v-if="order && order.foreignPartners.length > 0">
                <p
                  v-for="(foreign, key) in order.foreignPartners"
                  :key="key"
                >
                  회사명: {{foreign.partnerName}}<br>
                  국적: {{foreign.countryCd}}<br>
                  정보관리책임자: {{foreign.privacyManagerName }}({{foreign.privacyManagerPhoneNo}})<br><br>
                </p>
              </template>
              2. 이전 목적: 판매자와 구매자의 원활한 거래진행, 본인 의사의 확인, 고객 상담 및 불만 처리, 물품 배송<br>
              3. 이전되는 개인정보 항목: 주문자 성명, 주문자 이메일, 주문자 휴대전화, 상품 구매정보, 상품 수령인 정보(이름, 주소, 연락처), 해외 배송 상품인 경우 ‘고유통관부호’<br>
              4. 이전 시기 및 이전 방법: 주문 완료 시 전용관리자 페이지를 통한 조회 및 출력<br>
              5. 개인정보를 이전받는 자의 개인정보 보유 및 이용 기간: 개인정보 이용 목적 달성 시까지 보존함<br>
              6. 귀하는 동의를 거부할 권리가 있습니다. 다만 동의를 거부하시는 경우 주문 및 결제가 제한될 수 있습니다.
            </p>
          </div>
        </li>
      </ul>
      <span class="bx_input">
        <input type="checkbox" id="all_agree_dsc" v-model="agreeCheck.confirmPayment">
        <label for="all_agree_dsc">위 구매조건을 확인하였으며, 결제진행에 동의합니다.</label>
      </span>
    </div>
  </div>

</template>

<script>
export default {
  props: ['checkState', 'order'],
  data () {
    return {
      logined: this.$store.getters.isLogined,
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
        // 해외공급사가 제공하는 상품이 포함되어 있는 경우만 활성화t
        overseaPrivacyUsageAgreement: false,
        // 결제진행 동의
        confirmPayment: false
      }
    }
  },
  methods: {
    agreeInformation (type) {
      this.agree[type] = !this.agree[type]
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
    }
  },
  computed: {
    agreeCheckAll: {
      get () {
        let flag = (this.agreeCheck.privacyUsageAgreement === this.PRIVACY_USAGE_AGREEMENT) &&
          (this.agreeCheck.nonMemberPrivacyUsageAgreement === this.NONE_MEMBER_PRIVACY_USAGE_AGREEMENT) &&
          (this.agreeCheck.sellerPrivacyUsageAgreement === this.SELLER_PRIVACY_USAGE_AGREEMENT) &&
          (this.agreeCheck.customsClearanceAgreement === this.CUSTOMS_CLEARANCE_AGREEMENT) &&
          (this.agreeCheck.overseaPrivacyUsageAgreement === this.OVERSEA_PRIVACY_USAGE_AGREEMENT) &&
          (this.agreeCheck.termsOfUse === this.TERMS_OF_USE) && (this.agreeCheck.confirmPayment)
        this.$emit('changeCheckState', flag)
        return flag
      },
      set (value) {
        this.$emit('checkAll', value)
      }
    },
    sellerList: {
      get () {
        if (this.order) {
          return this.order.deliveryGroups.map(item => item.partnerName)
        }
      }
    },
    // 이용약관
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
  }
}
</script>
