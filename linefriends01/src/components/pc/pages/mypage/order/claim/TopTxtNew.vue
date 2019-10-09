<template>
  <div class="txt_area" v-if="isReturn">
    <h2>반품신청</h2>
    <div class="txt_ex_1 sp_1">
      <ul class="list_det">
        <li>
          반품 사유 구분에 따라 반품 배송비의 부담 주체가 구매자 또는 판매자로 구분됩니다.
        </li>
        <li>
          사유가 불명확 한 경우 반드시 <router-link to="/etc/faq">고객센터(1544-5921)</router-link> 또는 <router-link to="/mypage/inquiry">1:1 문의</router-link>를 통해 협의 후 반품 신청
          을 해주세요. 올바르지 않은 사유를 선택한 경우 판매자에 의해 반품이 거부될 수 있습니다.
        </li>
        <li>
          쿠폰을 사용한 경우 반품한 금액에 따라 쿠폰 적용이 취소될 수 있습니다. 이 때, 쿠폰은 유효기간 내에서 복원됩니다.
        </li>
        <li>
          반품 신청 시 판매자의 승인 후 환불됩니다. 단, 카드사의 상황에 따라 환불기간이 다소 길어질 수 있습니다.
        </li>
      </ul>
    </div>
  </div>
  <div class="txt_area" v-else>
    <h2>취소신청</h2>
    <div class="txt_ex_1 sp_1">
      <ul class="list_det">
        <li>상품이 발송되기 전 단계인 경우 취소신청을 할 수 있습니다. 다만, 취소신청을 하였더라도 판매자가 이미 상품을 발송한 경우에는 취소가 거부될 수 있습니다.</li>
        <li>쿠폰을 사용한 경우 취소한 금액에 따라 쿠폰적용이 취소될 수 있습니다. 이 때, 쿠폰은 유효기간 내에서 복원됩니다.</li>
        <li>결제완료 상태에서 취소신청 하는 경우 즉시 환불되며, 상품/배송준비중 상태에서 취소신청 하는 경우 판매자의 승인 후 환불됩니다. 단, 카드사의 상황에 따라 환불기간이 다소 길어질
          수있습니다.
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import TopTxtNew from '@/components/mixins/mypage/order/claim/TopTxtNew'

export default {
  mixins: [TopTxtNew]
}
</script>

