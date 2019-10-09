<template>
  <div class="product_item">
    <div class="product_item_cont">
      <router-link :to="'/m/product/detail/' + option.productNo" class="thumbnail_inner size_m">
        <div class="thumbnail">
          <img :src="option.imageUrl">
        </div>
      </router-link>
      <div class="product_info">
        <ul class="product_info_status" v-if="option.reservation">
          <li class="product_info_status_item">
            <span class="badge badge_reserved">予約商品</span>
          </li>
          <li class="product_info_status_item">
            <span class="product_delivery_date">{{option.reservationDeliveryYmdt | dateFormatStr('yyyy-MM-dd')}}日から順次発送</span>
          </li>
        </ul>
        <router-link :to="'/m/product/detail/' + option.productNo" class="product_title mt-0">{{option.productName}}</router-link>
        <p class="product_options">
          <span>{{option.optionTitle}}</span>
        </p>
        <div class="product_detail size_s">
          <dl class="product_detail_list dark">
            <dt><span class="order_new_font_weight">{{option.orderCnt}}</span> 件</dt>
          </dl>
          <dl class="product_detail_list dark">
            <dt>￥<span class="order_new_font_weight">{{option.price.buyAmt | formatCurrency}}</span></dt>
          </dl>
          <dl class="product_detail_list dark">
            <dt class="order_new_font_color">{{{orderType : option.orderStatusType, claimType : option.claimStatusType} | showStatus}}</dt>
          </dl>
          <order-btn :option="option" :options="options" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrderBtn from '@/components/mypage/order/OrderBtn'
export default {
  props: ['option', 'options'],
  components: {
    OrderBtn
  }
}
</script>
