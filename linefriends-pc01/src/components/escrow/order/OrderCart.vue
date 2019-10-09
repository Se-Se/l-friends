<template>
    <OrderCartBody :orderProductOptions="orderProductOptions"/>
</template>

<script>
import OrderCartBody from '@/components/escrow/order/OrderCartBody'

export default {
  props: ['orderProductOptions'],
  components: {
    OrderCartBody
  }
}
</script>
