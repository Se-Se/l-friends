<template>
  <div class="table_wrap">
    <table class="table_data item2 bor_top-1">
      <caption class="blind">장바구니 목록표</caption>
      <colgroup>
        <col class="width-60p">
        <col class="width-13p">
        <col class="width-15p">
        <col class="width-12p">
      </colgroup>
      <OrderTableHeader />
      <OrderTableBodyNew :orderProductOptions="orderProductOptions"/>
    </table>
  </div>
</template>

<script>
import OrderTableHeader from '@/components/pc/order/OrderTableHeader'
import OrderTableBodyNew from '@/components/pc/order/OrderTableBodyNew'

export default {
  props: ['orderProductOptions'],
  components: {
    OrderTableHeader,
    OrderTableBodyNew
  }
}
</script>
