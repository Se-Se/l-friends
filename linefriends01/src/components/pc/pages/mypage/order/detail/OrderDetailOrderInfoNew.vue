<template>
  <div class="filter">
    <div class="order-detail-header">
      <p class="order-detail-header__date">
        {{order.orderYmdt.substring(0, 10)}}
      </p>
      <h2 class="order-detail-header__ordno">
        주문번호 :{{order.orderNo}}
      </h2>
    </div>
    <order-item
      :key="order.orderNo"
      :order="orderArr"
      :showOrderType="'BOTH'"
      @showInquiryPopup="showInquiryPopup"
      @showAddReviewPopup="showAddReviewPopup"
      @showReturnDetailPopup="showReturnDetailPopup"
      @showCancelDetailPopup="showCancelDetailPopup"
      :nonMember="nonMember"
    />
  </div>
</template>

<script>
import OrderItem from '@/components/pc/pages/mypage/order/OrderDetailNew'
import OrderDetailOrderInfoNew from '@/components/mixins/mypage/order/detail/OrderDetailOrderInfoNew'

export default {
  mixins: [OrderDetailOrderInfoNew],
  name: 'OrderDetailOrderInfo',
  components: {
    OrderItem
  }
}
</script>