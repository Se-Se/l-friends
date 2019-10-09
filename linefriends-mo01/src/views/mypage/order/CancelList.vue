<template>
  <!-- ↓↓↓↓↓ container ↓↓↓↓↓ -->
  <div id="container" class="cart-order">
    <Breadcrumb :title="'キャンセル/返品'"></Breadcrumb>
    <OrderItem :type="'cancel'"></OrderItem>
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
