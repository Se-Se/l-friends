<template>
  <div class="table">
    <table class="table_data item-3 bor_top-1">
      <colgroup>
        <col style="width: 80px">
        <col style="width: 600px">
        <col style="width: 220px">
        <col style="width: 100px">
        <col style="width: 180px">
      </colgroup>
      <thead>
        <tr>
          <th>선택</th>
          <th>상품정보</th>
          <th>상품금액</th>
          <th>주문 수량</th>
          <th>{{isReturn ? '반품 수량' : '취소 수량'}}</th>
        </tr>
      </thead>
      <tbody>
        <refund-item :option="firstOption" :index="0" :firstOption="true" @updateOption="updateOption" :key="`refund_${firstOption.orderOptionNo}_0`" />
        <template v-for="(optionInfo, index) in addOptions" v-if="addOptions && addOptions.length > 0">
          <refund-item :option="optionInfo" :index="index + 1" :key="`refund_${optionInfo.orderOptionNo}_${index + 1}`" @updateOption="updateOption" />
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import RefundItem from '@/components/pc/pages/mypage/order/claim/RefundItemNew'
import RefundListNew from '@/components/mixins/mypage/order/claim/RefundListNew'

export default {
  mixins: [RefundListNew],
  components: {
    RefundItem
  }
}
</script>
