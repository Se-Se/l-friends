<template>
  <ul class="cancellation-list">
    <li class="cancellation-list__item">
      <order-claim-option
        :option="firstOption"
        :key="firstOption.orderOptionNo"
        @updateOption="updateOption"
      />
    </li>
    <template v-if="addOptions && addOptions.length > 0">
      <li
        v-for="option in addOptions"
        :key="option.orderOptionNo"
        class="cancellation-list__item"
      >
        <order-claim-option
          :option="option"
          :key="option.orderOptionNo"
          @updateOption="updateOption"
        />
      </li>
    </template>
  </ul>
</template>

<script>
import OrderClaimOption from '@/components/mobile/order/OrderClaimOption'
import RefundListNew from '@/components/mixins/mypage/order/claim/RefundListNew'

export default {
  mixins: [RefundListNew],
  components: {
    OrderClaimOption
  }
}
</script>
