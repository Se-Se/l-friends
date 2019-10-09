<template>
  <td>
    <span class="num">
      <template v-if="!option.deliverable">
        {{option.showShippingFee}}
      </template>
      <template v-else-if="!option.free">
        {{option.showShippingFee}}원<template v-if="option.deliveryPayType === 'PAY_ON_DELIVERY'">(착불)</template>
      </template>
      <template v-else>
        무료배송
      </template>
    </span>
  </td>
</template>

<script>
export default {
  props: ['option']
}
</script>
