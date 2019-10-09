<template>
  <tr>
    <td :rowspan="firstRowspan" v-if="showFirstTd">
      <router-link :to="`/mypage/orderdetail/${option.orderNo}?type=${showOrderType}`">
        <div class="table-item">
          <p class="table-item__date">
            {{option.orderYmdt.substring(0, 10).split('-').join('.')}}
          </p>
          <p class="table-item__ordno">
            {{option.orderNo}}
          </p>
          <a
            href="#"
            class="table-item__action"
          >{{ $t('order.detailOrder') }}</a>
        </div>
      </router-link>
    </td>
    <td>
      <router-link :to="`/goods/detail/${option.productNo}`" class="item_info">
        <div class="table-item table-item__left">
          <figure class="table__fig">
            <img :src="option.imageUrl" width="80" height="80" alt="상품 썸네일">
          </figure>
          <div class="table--info table--info__size">
            <template v-if="option.reservation">
              <div class="goods-detail__info__status-item">
                <p class="reserve">예약상품</p>
              </div>
              <div class="goods-detail__info__status-item">
                <p class="datedelivery">{{option.reservationDeliveryYmdt | dateFormatStr('yyyy-MM-dd')}}일 부터 순차 배송</p>
              </div>
            </template>
            <h2 class="table--info__title review-table__ellipse">
              {{(option.productName) | wordsFormat(!isDetail ? 50 : 70)}}
            </h2>
            <template v-for="showOption, index in option.showOptions">
              <span
                v-if="index === 0"
                class="table--info__value"
              >
                {{ $t('orderInfo.size') }} : {{showOption}}
              </span>
            </template>
            <template v-if="option.showOrderCnt">
              <span class="table--info__value">
                {{ $t('orderInfo.buyCnt') }} : {{option.showOrderCnt}}
              </span>
            </template>
          </div>
        </div>
      </router-link>
    </td>
    <td>
      <p>
        {{ option.orderCnt }}{{ $t('orderInfo.unit') }}
      </p>
    </td>
    <td class="part4">
      <p><span>{{option.showPrice}}</span>{{ $t('currency') }}</p>
    </td>
    <td>
      <h2
        class="table__status"
        :class="
          option.statusLabel === '배송완료' || option.statusLabel === '구매완료' || option.statusLabel === '취소확정'  ? 'txt_color_blue' : ''
        "
      >{{option.statusLabel}}</h2>
      <h2 class="table__status" v-if="showDisable >= 0">환불불가</h2>
    </td>
    <template v-if="showOrderType === 'CANCEL'">
      <td :rowspan="option.btnRowspan" v-if="option.claimButton">
        <order-button
          :option="option"
          :nonMember="nonMember"
          @showInquiryPopup="showInquiryPopup"
          @showAddReviewPopup="showAddReviewPopup"
          @showReturnDetailPopup="showReturnDetailPopup"
          @showCancelDetailPopup="showCancelDetailPopup"
        />
      </td>
    </template>
    <template v-else>
      <td class="part6">
        <order-button
          :option="option"
          :nonMember="nonMember"
          @showInquiryPopup="showInquiryPopup"
          @showAddReviewPopup="showAddReviewPopup"
          @showReturnDetailPopup="showReturnDetailPopup"
          @showCancelDetailPopup="showCancelDetailPopup"
        />
      </td>
    </template>
  </tr>
</template>

<script>
import OrderButton from '@/components/pc/button/OrderButton'
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
