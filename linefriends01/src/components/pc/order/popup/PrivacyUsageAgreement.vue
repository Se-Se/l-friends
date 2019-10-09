<template>
  <modal-layer-popup :visible.sync="active" :popup_size_class="'popup_size_11'">
    <div class="order-layerpopup">
      <h2 class="order-layerpopup__title" slot="title" v-if="type === 'privacyUsageAgreement'">개인정보 수집 · 이용 동의</h2>
      <h2 class="order-layerpopup__title" slot="title" v-if="type === 'customsClearanceAgreement'">통관정보 수집 · 이용 동의</h2>
      <h2 class="order-layerpopup__title" slot="title" v-if="type === 'overseaPrivacyUsageAgreement'">개인정보 국외 이전 동의</h2>
      <h2 class="order-layerpopup__title" slot="title" v-if="type === 'sellerPrivacyUsageAgreement'">개인정보 판매자 제공 동의</h2>
      <h2 class="order-layerpopup__title" slot="title" v-if="type === 'confirmPayment'">구매동의</h2>
      <div class="con">
        <div class="info_txtarea">
          <ul class="txt_list" v-if="type === 'privacyUsageAgreement'">
            <li>
              <span>1.</span>수집목적<br>
              물품 구매 및 배송처리
            </li>
            <li>
              <span>2.</span>수집항목<br>
              수령인의 이름, 수령인의 연락처, 배송지 주소
            </li>
            <li class="li-bold" style="font-size: 17px">
              <span>3.</span>보유이용기간<br>
              서비스 탈퇴시까지 보관함. 단 관련 법령에 따라 보관이 필요한 정보의 경우 해당 기간 동안 보관함.
            </li>
            <li>
              <span>4.</span>쇼핑몰 이용을 위한 필요 최소한의 개인정보이므로 동의를 해주셔야 서비스를  이용하실 수 있습니다.
            </li>
          </ul>
          <ul class="txt_list" v-if="type === 'customsClearanceAgreement'">
            <li>
              <span>1.</span>수집목적<br>
              해외 구매대행 상품의 통관(수입신고)
            </li>
            <li>
              <span>2.</span>수집항목<br>
              개인통관고유부호
            </li>
            <li>
              <span>3.</span>보유이용기간<br>
              물품구매 및 배송처리완료 또는 서비스 운영종료시까지
            </li>
          </ul>
          <ul class="txt_list" v-if="type === 'overseaPrivacyUsageAgreement'">
            <li>
              <span>1.</span>이전받는 자와 국적<br>
              <template v-if="foreignPartners.length > 0" v-for="foreign in foreignPartners">
                회사명: {{foreign.partnerName}}<br> 
                국적: {{foreign.countryCd}}<br> 
                정보관리책임자: {{foreign.privacyManagerName }}({{foreign.privacyManagerPhoneNo}})<br>
              </template>
            </li>
            <li>
              <span>2.</span>이전목적<br>
              판매자와 구매자의 원활한 거래 진행, 본인의사의 확인, 고객상담 및 불만처리, 물품배송
            </li>
            <li>
              <span>3.</span>이전되는 개인정보 항목<br>
              주문자 성명, 주문자 이메일, 주문자 휴대전화, 상품구매정보, 상품 수령인정보(이름, 주소, 연락처), 개인통관고유부호
            </li>
            <li>
              <span>4.</span>이전 시기 및 이전 방법<br>
              주문완료 시 전용 관리자페이지를 통한 조회 및 출력
            </li>
            <li>
              <span>5.</span>개인정보를 이전받는 자의 개인정보 보유 및 이용기간<br>
              배송 및 관련 CS처리 완료시까지
            </li>
            <li>
              <span>6.</span>귀하는 동의를 거부할 권리가 있습니다. 다만 동의를 거부하시는 경우 주문 및 결제가 제한될 수 있습니다.
            </li>
          </ul>
          <ul class="txt_list" v-if="type === 'sellerPrivacyUsageAgreement'">
            <li class="li-bold" style="font-size: 17px">
              <span>1.</span>제공받는 자<br>
              <template v-if="partners" v-for="partner in partners">
              {{partner.partnerName}}<br>
              </template>
            </li>
            <li class="li-bold" style="font-size: 17px">
              <span>2.</span>제공목적<br>
              판매자와 구매자의 원활한 거래 진행, 본인의사의 확인, 고객상담 및 불만처리, 물품배송
            </li>
            <li style="font-size: 14px">
              <span>3.</span>제공하는 개인정보 항목<br>
              주문자 성명, 주문자 이메일, 주문자 휴대폰번호, 상품구매정보, 상품 수령인 정보(이름, 주소, 연락처)
            </li>
            <li class="li-bold" style="font-size: 17px">
              <span>4.</span>개인정보를 제공받는자의 개인정보보유 및 이용기간<br>
              배송 및 관련 CS처리 완료시까지
            </li>
            <li>
              <span>5.</span>귀하는 동의를 거부할 권리가 있습니다. 다만 동의를 거부하시는 경우 주문 및 배송이 제한될 수 있습니다.
            </li>
          </ul>
          <ul class="txt_list" v-if="type === 'confirmPayment'">
            <li><span></span>주문할 상품의 상품명, 상품가격, 배송 정보를 확인하였으며, 구매에 동의하시겠습니까?<br/>(전자상거래법 제 8조 2항)</li>
          </ul>
        </div>
      </div>
    </div>
  </modal-layer-popup>
</template>
<script>
import ModalLayerPopup from '@/components/pc/popup/ModalLayerPopupNew'
import { addClass, removeClass } from '@/utils/utils'
// import { mapState } from 'vuex'

export default {
  data () {
    return {
      active: false,
      type: '',
      foreignPartners: [],
      partners: []
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
    }
  },
  computed: {
    // ...mapState('ordersheet', ['ordersheet']),
    // partner () {
    //   let partnerMap = this.ordersheet.deliveryGroups.reduce((partnerMap, data) => {
    //     partnerMap[data.partnerNo] = data.partnerName
    //     return partnerMap
    //   }, {})
    //   return Object.values(partnerMap).join(',')
    // }
  },
  components: {
    ModalLayerPopup
  },
  watch: {
    active (status) {
      let doc = document.documentElement || document.body
      let body = document.querySelector('body')
      if (status) {
        body.style.top = -1 * parseInt(doc.scrollTop) + 'px'
        addClass(document.body, 'no_scroll')
      } else {
        let top = parseInt(body.style.top) * -1
        body.style.cssText = ''
        removeClass(document.body, 'no_scroll')
        doc.scrollTop = top
      }
    }
  }
}
</script>
<style scoped>
.popup_wrap .info {
  padding: 0 !important;
  background: #ffffff !important;
}
.li-bold {
  font-weight: bold;
}
</style>


