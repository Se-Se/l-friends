<template>
  <div class="product_item_cont">
    <router-link :to="'/m/product/detail/' + option.productNo">
      <div class="thumbnail_inner size_m">
        <div class="thumbnail">
          <img :src="option.imageUrl" alt="">
        </div>
      </div>
    </router-link>
    <div class="product_info">
      <ul class="product_info_status" v-if="option.reservation">
        <li class="product_info_status_item">
          <span class="badge badge_reserved">予約商品</span>
        </li>
        <li class="product_info_status_item">
          <span class="product_delivery_date">{{option.reservationDeliveryYmdt.substring(0, 10)}}日から順次発送</span>
        </li>
      </ul>
      <router-link :to="'/m/product/detail/' + option.productNo" class="product_title mt-0">
        <p class="product_title mt-0">{{option.productName}}</p>
        <p class="product_options" v-if="optionTitle">
          <span>{{ optionTitle }}</span>
        </p>
      </router-link>
      <div class="product_detail size_s">
        <dl class="product_detail_list dark">
          <dt><span class="order_new_font_weight">{{ option.orderCnt }}</span> 件</dt>
        </dl>
        <dl class="product_detail_list dark">
          <dt>￥ <span class="order_new_font_weight">{{option.price.buyAmt | formatCurrency}}</span></dt>
        </dl>
        <dl class="product_detail_list dark">
          <dt class="order_new_font_color">{{{orderType : option.orderStatusType, claimType : option.claimStatusType} | showStatus}}</dt>
        </dl>
        <order-btn :option="option" :options="order.orderOptions" />
      </div>
    </div>
  </div>
</template>
<script>
import OrderBtn from '@/components/mypage/order/OrderBtn'
import { formatOptionTitle } from '@/utils/utils'
export default {
  props: ['order', 'option', 'index', 'type'],
  computed: {
    optionTitle () {
      let label = ''
      label = formatOptionTitle(this.option.optionUsed, this.option.optionType, this.option.optionName, this.option.optionValue, this.option.price.addPrice)
      return label
    }
  },
  components: {
    OrderBtn
  }
}
</script>
