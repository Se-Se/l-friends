<template>
  <tr>
    <td :rowspan="firstRowspan" v-if="showFirstTd">
      <router-link :to="`/mypage/orderdetail/${option.orderNo}?type=${showOrderType}`">
        <dl class="ttl_date">
          <dt><span class="num">{{option.orderYmdt.substring(0, 10).split('-').join('.')}}</span></dt>
          <dd><span class="num">{{option.orderNo}}</span></dd>
          <dd><span class="link_blue">상세보기</span></dd>
        </dl>
      </router-link>
    </td>
    <td class="part2">
      <router-link :to="`/goods/detail/${option.productNo}`" class="item_info">
        <div class="table-item table-item__left">
          <figure class="table__fig table-cell">
            <img :src="option.imageUrl" alt="상품 썸네일">
          </figure>
          <div class="table--info table-cell">
            <template v-if="option.reservation">
              <div class="goods-detail__info__status-item">
                <p class="reserve">예약상품</p>
              </div>
              <div class="goods-detail__info__status-item">
                <p class="datedelivery">{{option.reservationDeliveryYmdt | dateFormatStr('yyyy-MM-dd')}}일 부터 순차 배송</p>
              </div>
            </template>
            <h2 class="table--info__title">
              {{(option.showBrandName + option.productName) | wordsFormat(!isDetail ? 50 : 70)}}
            </h2>
            <span class="table--info__value">
              <template v-for="showOption, index in option.showOptions">
                <template v-if="index === 0">{{showOption}}</template>
                <template v-else> / {{showOption}}</template>
              </template>
              <template v-if="option.showAddPrice">
                {{option.showAddPrice}}
              </template>
              <template v-if="option.showOrderCnt">
                {{option.showOrderCnt}}
              </template>
            </span>
          </div>
        </div>
      </router-link>
    </td>
    <td>
      <p>{{option.orderCnt}}개</p>
    </td>
    <td class="part4">
      <p><span>{{option.showPrice}}</span>원</p>
    </td>
    <td>
      <h2 class="table__status" :class="option.statusLabel === '배송완료' || option.statusLabel === '구매완료' || option.statusLabel === '취소확정'  ? 'txt_color_blue' : ''">{{option.statusLabel}}</h2>
      <h2 class="table__status" v-if="showDisable >= 0">환불불가</h2>
    </td>
    <template v-if="showOrderType === 'CANCEL'">
      <td :rowspan="option.btnRowspan" v-if="option.claimButton">
        <order-button :option="option" :nonMember="nonMember" @showInquiryPopup="showInquiryPopup" @showAddReviewPopup="showAddReviewPopup" @showReturnDetailPopup="showReturnDetailPopup" @showCancelDetailPopup="showCancelDetailPopup" />
      </td>
    </template>
    <template v-else>
      <td class="part6">
        <order-button :option="option" :nonMember="nonMember" @showInquiryPopup="showInquiryPopup" @showAddReviewPopup="showAddReviewPopup" @showReturnDetailPopup="showReturnDetailPopup" @showCancelDetailPopup="showCancelDetailPopup" />
      </td>
    </template>
  </tr>
</template>

<script>
import OrderButton from '@/components/pc/pages/mypage/order/OrderButton'
import OrderOptionNew from '@/components/mixins/mypage/order/OrderOptionNew'

export default {
  mixins: [OrderOptionNew],
  components: {
    OrderButton
  }
}
</script>

<style>
</style>
