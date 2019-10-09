<template>
  <div>
    <div class="table_wrap">
      <table class="table_data item bor-1">
        <colgroup>
          <col style="width: 180px;">
          <col style="width: 510px;">
          <col style="width: 60px;">
          <col style="width: 160px;">
          <col style="width: 120px;">
          <col style="width: 150px;">
        </colgroup>
        <thead>
          <tr>
            <th class="part1">주문정보</th>
            <th class="part2">상품정보</th>
            <th>수량</th>
            <th class="part4">상품금액</th>
            <th>상태</th>
            <th class="part6">관리</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="showOrderType === 'ORDER'">
            <template v-for="(item, index) in order">
              <order-option v-for="option in item.viewOptions" :key="option.orderOptionNo" :option="option" @showInquiryPopup="showInquiryPopup" @showAddReviewPopup="showAddReviewPopup" @showReturnDetailPopup="showReturnDetailPopup" @showCancelDetailPopup="showCancelDetailPopup" :nonMember="nonMember" v-if="!option.claimStatusType" :showOrderType="'ORDER'" />
            </template>
          </template>
          <template v-if="showOrderType === 'CANCEL'">
            <template v-for="(item, index) in order">
              <order-option v-for="option in item.viewOptions" :key="option.orderOptionNo" :option="option" @showInquiryPopup="showInquiryPopup" @showAddReviewPopup="showAddReviewPopup" @showReturnDetailPopup="showReturnDetailPopup" @showCancelDetailPopup="showCancelDetailPopup" :nonMember="nonMember" v-if="option.claimStatusType" :showOrderType="'CANCEL'" />
            </template>
          </template>
          <template v-if="showOrderType === 'BOTH'">
            <template v-for="(item, index) in order">
              <order-option v-for="option in item.viewOptions" :key="option.orderOptionNo" :option="option" @showInquiryPopup="showInquiryPopup" @showAddReviewPopup="showAddReviewPopup" @showReturnDetailPopup="showReturnDetailPopup" @showCancelDetailPopup="showCancelDetailPopup" :nonMember="nonMember" :showOrderType="'CANCEL'" />
            </template>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import OrderOption from '@/components/pc/pages/mypage/order/OrderOptionNew'
import OrderNew from '@/components/mixins/mypage/order/OrderNew'

export default {
  mixins: [OrderNew],
  components: {
    OrderOption
  }
}
</script>
