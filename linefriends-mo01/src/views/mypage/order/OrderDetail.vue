<template>
  <div id="container" class="cart-order">
    <breadcrumb :title="'注文の詳細'" />

    <div class="cart_wrapper" v-if="order">
      <div class="cart_main">
        <div>
          <div class="head_ttl change-child_font_size order_detail_ground_color">
            <p class="ttl ttl_order_new_size">注文番号 : {{order.orderNo}}</p>
            <span class="user_info">
              <p class="user_email">{{order.orderYmdt | dateFormatStr('yyyy-MM-dd')}}</p>
            </span>
          </div>
          <product-card v-for="(option, idx) in productInfo" :key="idx" :option="option" :options="productInfo" />
        </div>
        <div>
          <price-info :price="order.firstOrderAmount" :order="order" />
          <buyer-info :buyer="order.orderer" v-if="!order.refundInfos || order.refundInfos.length === 0"/>
          <refund-info :refundInfos="order.refundInfos" v-if="order.refundInfos && order.refundInfos.length > 0"/>
          <adderss-info :order="order" :address="order.shippingAddress" :productInfo="productInfo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Breadcrumb from '@/components/common/Breadcrumb'
import ProductCard from '@/components/mypage/order/detail/ProductCard'
import PriceInfo from '@/components/mypage/order/detail/PriceInfo'
import BuyerInfo from '@/components/mypage/order/detail/BuyerInfo'
import AdderssInfo from '@/components/mypage/order/detail/AdderssInfo'
import RefundInfo from '@/components/mypage/order/detail/RefundInfo'

export default {
  name: 'OrderDetail',
  data () {
    return {
      popFlg: false
    }
  },
  computed: {
    ...mapState('myorder', ['order']),
    ...mapGetters('myorder', ['productInfo'])
  },
  components: {
    Breadcrumb,
    ProductCard,
    PriceInfo,
    BuyerInfo,
    AdderssInfo,
    RefundInfo
  }
}
</script>
