<template>
  <tbody>
    <OrderCartProductItem v-for="(option, index) in orderProductOptions" :key="option.optionNo+'_'+index" :option="option" />
  </tbody>
</template>

<script>
import OrderCartProductItem from '@/components/escrow/order/OrderCartProductItem'

export default {
  props: ['orderProductOptions'],
  components: {
    OrderCartProductItem
  }
}
</script>
