<template>
  <ul class="order-info__tools">
    <template v-for="(button,key) in option.buttons">
      <li
        v-if="button === 'CANCEL'"
        :key="key">
        <app-button
          @click="cancelOrder"
          size="middle-small"
          bold
        >
          주문취소
        </app-button>
      </li>
      <li
        v-if="button === 'VIEW_DELIVERY'"
        :key="key">
        <app-button
          @click="deliveryTracking"
          size="middle-small"
          bold
        >
          배송조회
        </app-button>
      </li>
      <li
        v-if="button === 'WRITE_REVIEW' && !nonMember"
        :key="key"
        :class="{btn_color: reviewState}">
        <app-button
          @click="reviewOption"
          size="middle-small"
          bold
        >
          상품평작성
        </app-button>
      </li>
      <li
        v-if="button === 'CANCEL_VIEW_CLAIM_ING'"
        :key="key">
        <app-button
          @click="showCancelDetailPopup"
          size="middle-small"
          bold
        >
          취소처리현황
        </app-button>
      </li>
      <li
        v-if="button === 'CANCEL_VIEW_CLAIM'"
        :key="key">
        <app-button
          @click="showCancelDetailPopup"
          size="middle-small"
          bold
        >
          취소처리결과
        </app-button>
      </li>
      <li
        v-if="button === 'RETURN_VIEW_CLAIM_ING'"
        :key="key">
        <app-button
          @click="showReturnDetailPopup"
          size="middle-small"
          bold
        >
          반품처리현황
        </app-button>
      </li>
      <li
        v-if="button === 'RETURN_VIEW_CLAIM'"
        :key="key">
        <app-button
          @click="showReturnDetailPopup"
          size="middle-small"
          bold
        >
          반품처리결과
        </app-button>
      </li>
      <li
        v-if="button === 'RETURN'"
        :key="key">
        <app-button
          @click="requestReturn"
          size="middle-small"
          bold
        >
          반품신청
        </app-button>
      </li>
      <li
        v-if="button === 'WITHDRAW_CANCEL'"
        :key="key">
        <app-button
          @click="withdrawClaim"
          size="middle-small"
          bold
        >
          취소철회
        </app-button>
      </li>
      <li
        v-if="button === 'WITHDRAW_RETURN'"
        :key="key">
        <app-button
          @click="withdrawClaim"
          size="middle-small"
          bold
        >
          반품철회
        </app-button>
      </li>
      <li
        v-if="button === 'DEPOSIT_WAIT'"
        :key="key">
        <app-button
          @click="cancelAllOrder"
          size="middle-small"
          bold
        >
          주문취소
        </app-button>
      </li>
    </template>
    <li>
      <app-button
        @click="showInquiryPopup"
        v-if="!nonMember"
        size="middle-small"
        bold
      >
        문의하기
      </app-button>
    </li>
  </ul>
</template>

<script>
import AppButton from '@/components/mobile/common/button/Button'
import OrderButton from '@/components/mixins/button/Orderbutton'

export default {
  name: 'OrderButtons',
  mixins: [OrderButton],
  components: {
    AppButton
  }
}
</script>

<style lang="scss" scoped>
.order-info__tools {
  margin-top: 2.4rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  > li {
    width: calc(50% - 0.35rem);

    &:not(:first-child):not(:nth-of-type(2)) {
      margin-top: 0.7rem;
    }
  }
}
</style>
