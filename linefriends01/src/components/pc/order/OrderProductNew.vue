<template>
  <tr>
    <td>
      <router-link :to="`/goods/detail/${option.productNo}`" class="item_info" target="_blank">
        <span class="bx_thumb">
          <img :src="option.imageUrl" width="80" height="80" alt="상품 썸네일">
        </span>
        <div class="bx_info">
          <template v-if="option.reservation">
            <span class="goods-detail__info__status-item">
              <p class="reserve">예약상품</p>
            </span>
            <span class="goods-detail__info__status-item">
              <p class="datedelivery">{{option.reservationDeliveryYmdt | dateFormatStr('yyyy-MM-dd')}}일 부터 순차 배송</p>
            </span>
          </template>
          <span class="name">
            {{(option.showProductName) | wordsFormat(68)}}
          </span>
          <span class="option">
            <template v-for="showOption, index in option.showOptions">
              <span class="bar" v-if="index != 0">/</span> {{showOption}}
            </template>
            <template v-if="option.showAddPrice">
              {{option.showAddPrice}}
            </template>
            <!-- <template v-if="option.showOrderCnt">
              {{option.showOrderCnt}}
            </template> -->
          </span>
        </div>
      </router-link>
    </td>
    <td>
      <span class="num">{{option.orderCnt}}</span>
    </td>
    <td>
      <span class="num">{{option.showPrice}}</span>
      <div class="tip">
        <!-- [D] 할인적용금액 안내글 팝업 -->
        <div class="tip_popup size_1">
          <dl>
            <dt>상품 금액</dt>
            <dd><span class="num">{{option.showStandardAmt}}</span>원</dd>
          </dl>
          <dl>
            <dt>할인 금액</dt>
            <dd><span class="num">{{option.showDiscountAmt == 0 ? option.showDiscountAmt : '- ' + option.showDiscountAmt}}</span>원</dd>
          </dl>
          <div class="total_pop">
            <dl>
              <dt>할인 적용 금액</dt>
              <dd><span class="num">{{option.showPrice}}</span>원</dd>
            </dl>
          </div>
        </div>
        <!-- // [D] 할인적용금액 안내글 팝업 -->
      </div>
    </td>
    <template v-if="option.bundledFlg">
      <order-delivery-fee v-if="option.bundledFirst" :rowspan="option.bundledSize" :option="option" class="merge"/>
    </template>
    <template v-else>
      <order-delivery-fee :option="option" />
    </template>
  </tr>
</template>

<script>
import OrderDeliveryFee from '@/components/pc/order/OrderDeliveryFee'

export default {
  props: ['option'],
  components: {
    OrderDeliveryFee
  }
}
</script>

<style>
</style>
