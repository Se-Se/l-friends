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
          {{ $t('button.orderCancel') }}
        </button>
      </li>
      <li class="order-btn">
        <button
          v-if="button === 'VIEW_DELIVERY'"
          @click.prevent="deliveryTracking"
          class="white-button shorty btn_horizontal"
          :key="button"
        >
          {{ $t('button.deliveryInfo') }}
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
          {{ $t('button.reviewAdd') }}
        </button>
      </li>
      <li class="order-btn">
        <button
          v-if="button === 'CANCEL_VIEW_CLAIM_ING'"
          @click.prevent="showCancelDetailPopup"
          class="white-button shorty btn_horizontal"
          :key="button"
        >
          {{ $t('button.cancelStatus') }}
        </button>
      </li>
      <li class="order-btn">
        <button
          v-if="button === 'CANCEL_VIEW_CLAIM'"
          @click.prevent="showCancelDetailPopup"
          class="white-button shorty btn_horizontal"
          :key="button"
        >
          {{ $t('button.cancelClaim') }}
        </button>
      </li>
      <li class="order-btn">
        <button
          v-if="button === 'RETURN_VIEW_CLAIM_ING'"
          @click.prevent="showReturnDetailPopup"
          class="white-button shorty btn_horizontal"
          :key="button"
        >
          {{ $t('button.returnStatus') }}
        </button>
      </li>
      <li class="order-btn">
        <button
          v-if="button === 'RETURN_VIEW_CLAIM'"
          @click.prevent="showReturnDetailPopup"
          class="white-button shorty btn_horizontal"
          :key="button"
        >
          {{ $t('button.returnClaim') }}
        </button>
      </li>
      <li class="order-btn">
        <button
          v-if="button === 'RETURN'"
          @click.prevent="requestReturn"
          class="white-button shorty btn_horizontal"
          :key="button"
        >
          {{ $t('button.returnAdd') }}
        </button>
      </li>
      <li class="order-btn">
        <button
          v-if="button === 'WITHDRAW_CANCEL'"
          @click.prevent="withdrawClaim"
          class="white-button shorty btn_horizontal"
          :key="button"
        >
          {{ $t('button.cancelWithdrawal') }}
        </button>
      </li>
      <li class="order-btn">
        <button
          v-if="button === 'WITHDRAW_RETURN'"
          @click.prevent="withdrawClaim"
          class="white-button shorty btn_horizontal"
          :key="button"
        >
          {{ $t('button.returnWithdrawal') }}
        </button>
      </li>
      <li class="order-btn">
        <button
          v-if="button === 'DEPOSIT_WAIT'"
          @click.prevent="cancelAllOrder"
          class="white-button shorty btn_horizontal"
          :key="button"
        >
          {{ $t('button.orderCancel') }}
        </button>
      </li>
    </template>
    <li class="order-btn">
      <button
        @click.prevent="showInquiryPopup"
        class="white-button shorty btn_horizontal"
        v-if="!nonMember"
      >
        {{ $t('button.contactAdd') }}
      </button>
    </li>
  </ul>
</template>

<script>
import OrderButton from '@/components/mixins/button/Orderbutton'

export default {
  mixins: [OrderButton]
}
</script>
