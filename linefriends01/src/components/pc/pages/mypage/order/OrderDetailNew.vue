<template>
  <div class="table-list table-list__padding">
    <div class="table-list--header">
      <h2 class="table-list--header__title">
        주문배송 조회
      </h2>
    </div>
    <table class="table">
      <colgroup>
        <col style="width: 30%;">
        <col style="width: 10%;">
        <col style="width: 10%;">
        <col style="width: 10%;">
        <col style="width: 10%;">
      </colgroup>
      <thead>
        <tr>
          <th>상품정보</th>
          <th>수량</th>
          <th>상품금액</th>
          <th>상태</th>
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="showOrderType === 'BOTH'">
          <template v-for="(item, index) in order">
            <order-option v-for="option in item.viewOptions" :key="option.orderOptionNo" :option="option" @showInquiryPopup="showInquiryPopup" @showAddReviewPopup="showAddReviewPopup" @showReturnDetailPopup="showReturnDetailPopup" @showCancelDetailPopup="showCancelDetailPopup" :nonMember="nonMember" :showOrderType="'CANCEL'" :isDetail="true" />
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>
<script>
import OrderOption from '@/components/pc/pages/mypage/order/OrderOptionNew'
import OrderDetailNew from '@/components/mixins/mypage/order/OrderDetailNew'

export default {
  mixins: [OrderDetailNew],
  components: {
    OrderOption
  }
}
</script>
