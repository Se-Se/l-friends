<template>
  <tr>
    <td>
      <router-link :to="'/product/detail/' + option.productNo" class="product_info">
        <div class="product_img">
          <img :src="option.imageUrl">
        </div>
        <div class="detail_txt detail">
          <dl class="badge_area" v-if="option.reservation">
            <dt><span class="badge badge_reserved">予約商品</span></dt>
            <dd>{{option.reservationDeliveryYmdt | dateFormatStr('yyyy-MM-dd')}}日から順次発送</dd>
          </dl>
          <p class="sup_info" style="word-break: break-all;">{{option.productName | bytesFormat(92)}}</p>
          <p class="sub_info">{{option.optionTitle}}</p>
        </div>
      </router-link>
    </td>
    <td>
      <p class="mix_box"><span class="num">{{option.orderCnt}}</span> 件</p>
    </td>
    <td>
      <p class="mix_box">￥<span class="num">{{option.price.buyAmt | formatCurrency}}</span></p>
    </td>
    <td>
      <p class="state">{{{orderType : option.orderStatusType, claimType : option.claimStatusType} | showStatus}}</p>
    </td>
    <td>
      <order-btn :option="option" :options="options" @writeReview="writeReview" @showInquiryPop="showInquiryPop" @showReturnDetailPopup="showReturnDetailPopup" @showCancelDetailPopup="showCancelDetailPopup"/>
      <order-claim-detail-popup :showClaimType="'CANCEL'" ref="orderClaimCancelDetailPopup"></order-claim-detail-popup>
      <order-claim-detail-popup :showClaimType="'RETURN'" ref="orderClaimReturnDetailPopup"></order-claim-detail-popup>
    </td>
  </tr>
</template>

<script>
import OrderBtn from '@/components/mypage/order/OrderBtn'
import OrderClaimDetailPopup from '@/components/mypage/order/OrderClaimDetailPopup'

export default {
  props: ['option', 'options'],
  methods: {
    writeReview (review) {
      this.$emit('writeReview', review)
    },
    showInquiryPop (productNo) {
      this.$emit('showInquiryPop', productNo)
    },
    showCancelDetailPopup (orderOptionNo) {
      this.$refs.orderClaimCancelDetailPopup.openOrderClaimDetailPopup(orderOptionNo, false)
    },
    showReturnDetailPopup (orderOptionNo) {
      this.$refs.orderClaimReturnDetailPopup.openOrderReturnDetailPopup(orderOptionNo, false)
    }
  },
  components: {
    OrderBtn,
    OrderClaimDetailPopup
  }
}
</script>
