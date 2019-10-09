<template>
  <tbody>
    <OrderProductNew v-for="option in orderProductOptions" :key="option.optionNo" :option="option"/>
  </tbody>
</template>

<script>
  import OrderProductNew from '@/components/pc/order/OrderProductNew'

  export default {
    props: ['orderProductOptions'],
    components: {
      OrderProductNew
    }
  }
</script>
