<template>
  <ul class="btn_style_1">
    <template v-for="button in option.buttons">
      <li class="order-btn">
        <button
          v-if="button === 'CANCEL'"
          @click.prevent="cancelOrder"
          class="white-button shorty btn_horizontal"
          :key="button"
        >
          주문취소
        </button>
      </li>
      <li class="order-btn">
        <button
          v-if="button === 'VIEW_DELIVERY'"
          @click.prevent="deliveryTracking"
          class="white-button shorty btn_horizontal"
          :key="button"
        >
          배송조회
        </button>
      </li>
      <li class="order-btn">
        <button
          v-if="button === 'WRITE_REVIEW' && !nonMember"
          @click.prevent="reviewOption"
          class="white-button shorty btn_horizontal"
          :class="{btn_color: reviewState}"
          :key="button"
        >
          상품평작성
        </button>
      </li>
      <li class="order-btn">
        <button
          v-if="button === 'CANCEL_VIEW_CLAIM_ING'"
          @click.prevent="showCancelDetailPopup"
          class="white-button shorty btn_horizontal"
          :key="button"
        >
          취소처리현황
        </button>
      </li>
      <li class="order-btn">
        <button
          v-if="button === 'CANCEL_VIEW_CLAIM'"
          @click.prevent="showCancelDetailPopup"
          class="white-button shorty btn_horizontal"
          :key="button"
        >
          취소처리결과
        </button>
      </li>
      <li class="order-btn">
        <button
          v-if="button === 'RETURN_VIEW_CLAIM_ING'"
          @click.prevent="showReturnDetailPopup"
          class="white-button shorty btn_horizontal"
          :key="button"
        >
          반품처리현황
        </button>
      </li>
      <li class="order-btn">
        <button
          v-if="button === 'RETURN_VIEW_CLAIM'"
          @click.prevent="showReturnDetailPopup"
          class="white-button shorty btn_horizontal"
          :key="button"
        >
          반품처리결과
        </button>
      </li>
      <li class="order-btn">
        <button
          v-if="button === 'RETURN'"
          @click.prevent="requestReturn"
          class="white-button shorty btn_horizontal"
          :key="button"
        >
          반품신청
        </button>
      </li>
      <li class="order-btn">
        <button
          v-if="button === 'WITHDRAW_CANCEL'"
          @click.prevent="withdrawClaim"
          class="white-button shorty btn_horizontal"
          :key="button"
        >
          취소철회
        </button>
      </li>
      <li class="order-btn">
        <button
          v-if="button === 'WITHDRAW_RETURN'"
          @click.prevent="withdrawClaim"
          class="white-button shorty btn_horizontal"
          :key="button"
        >
          반품철회
        </button>
      </li>
      <li class="order-btn">
        <button
          v-if="button === 'DEPOSIT_WAIT'"
          @click.prevent="cancelAllOrder"
          class="white-button shorty btn_horizontal"
          :key="button"
        >
          주문취소
        </button>
      </li>
    </template>
    <li class="order-btn">
      <button
        @click.prevent="showInquiryPopup"
        class="white-button shorty btn_horizontal"
        v-if="!nonMember"
      >
        문의하기
      </button>
    </li>
  </ul>
</template>

<script>
import OrderButton from '@/components/mixins/mypage/order/OrderButton'

export default {
  mixins: [OrderButton]
}
</script>
