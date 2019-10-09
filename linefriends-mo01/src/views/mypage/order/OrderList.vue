<template>
  <!-- ↓↓↓↓↓ container ↓↓↓↓↓ -->
  <div id="container" class="cart-order">
    <Breadcrumb :title="'注文履歴'"></Breadcrumb>
    <OrderItem :type="'order'"></OrderItem>
  </div>
  <!-- ↑↑↑↑↑ container ↑↑↑↑↑ -->
</template>
<script>
import OrderItem from '@/components/mypage/order/list/OrderItem'
import Breadcrumb from '@/components/common/Breadcrumb'
export default {
  components: {
    OrderItem,
    Breadcrumb
  }
}
</script>
