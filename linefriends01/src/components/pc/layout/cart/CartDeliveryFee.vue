<template>
  <td>
    <template v-if="!option.free">
      <template v-if="option.isInValid || !option.deliverable">
        {{option.showShippingFee}}
      </template>
      <template v-else>
        <span class="num">
          {{option.showShippingFee}}
          <em class="add_txt" v-if="option.deliveryPayType === 'PAY_ON_DELIVERY'">({{ $t('layout.cart.cashOnDelivery') }})</em>
        </span>
      </template>
    </template>
    <template v-else>
      {{option.showShippingFee}}
    </template>
  </td>
</template>

<script>
export default {
  props: ['option']
}
</script>
