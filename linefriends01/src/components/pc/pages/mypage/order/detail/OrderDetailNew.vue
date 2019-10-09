<template>
  <div v-if="order">
    <order-detail-order-info
      :order="order"
      @showInquiryPopup="showInquiryPopup"
      @showAddReviewPopup="showAddReviewPopup"
      @showReturnDetailPopup="showReturnDetailPopup"
      @showCancelDetailPopup="showCancelDetailPopup"
    />
    <order-detail-payment-info :order="order" v-if="order.showPriceInfo" />
    <refund-info :refundInfos="order.refundInfos" v-if="order.showPriceInfo && order.refundInfos && order.refundInfos.length > 0">
      <h2 class="horizontal__header--title" slot="title">환불정보</h2>
    </refund-info>
    <order-detail-delivery-info v-if="order.orderAddress" :orderNo="order.orderNo" :shippingAddress="order.orderAddress" :showCustomsID="order.requireCustomsIdNumber" />
    <product-inquiry-popup :inquiryTypes="productInquiryTypes" :productNo="inquiryProductNo" ref="productInquiryPopup" :isShowContact.sync="isShowContact" />
    <order-addreview-popup :orderOption="orderOption" ref="orderAddreviewPopup" :isShowReview.sync="isShowReview" />
    <order-claim-detail-popup :showClaimType="'CANCEL'" ref="orderClaimCancelDetailPopup" />
    <order-claim-detail-popup :showClaimType="'RETURN'" ref="orderClaimReturnDetailPopup" />
    <div class="default-center">
      <button class="default-button active" @click="enterBeforePage">목록</button>
    </div>
  </div>
</template>

<script>
import OrderDetailOrderInfo from '@/components/pc/pages/mypage/order/detail/OrderDetailOrderInfoNew'
import OrderDetailPaymentInfo from '@/components/pc/pages/mypage/order/detail/OrderDetailPaymentInfoNew'
import RefundInfo from '@/components/pc/pages/mypage/order/common/RefundInfoNew'
import OrderDetailDeliveryInfo from '@/components/pc/pages/mypage/order/detail/OrderDetailDeliveryInfoNew'
import ProductInquiryPopup from '@/components/pc/order/ProductInquiryPopupNew'
import OrderClaimDetailPopup from '@/components/pc/pages/mypage/order/claim/OrderClaimDetailPopupNew'
import OrderAddreviewPopup from '@/components/pc/order/OrderAddreviewPopupNew'
import OrderDetailNew from '@/components/mixins/mypage/order/detail/OrderDetailNew'

export default {
  mixins: [OrderDetailNew],
  components: {
    OrderDetailOrderInfo,
    OrderDetailPaymentInfo,
    RefundInfo,
    OrderDetailDeliveryInfo,
    ProductInquiryPopup,
    OrderClaimDetailPopup,
    OrderAddreviewPopup
  }
}
</script>

