<template>
  <div id="container" class="mypage">
    <div class="wrap">
      <bread-crumbs breadCrumbs="キャンセル/返品"/>
      <OrderItem :type="'cancel'"></OrderItem>
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
