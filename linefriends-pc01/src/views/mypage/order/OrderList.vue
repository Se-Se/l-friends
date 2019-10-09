<template>
  <div id="container" class="mypage">
    <div class="wrap">
      <bread-crumbs breadCrumbs="注文履歴"/>
      <OrderItem :type="'order'"></OrderItem>
    </div>
  </div>
</template>
<script>
import OrderItem from '@/components/mypage/order/list/OrderItem'
import BreadCrumbs from '@/components/common/BreadCrumbs'
export default {
  components: {
    OrderItem,
    BreadCrumbs
  }
}
</script>
