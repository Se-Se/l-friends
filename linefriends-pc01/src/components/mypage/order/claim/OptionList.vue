<template>
  <div class="table_wrap">
    <table class="table_data myorder_table">
      <colgroup>
        <col style="width:120px;">
        <col style="width:610px;">
        <col style="width:140px;">
        <col style="width:170px;">
        <col style="width:140px;">
      </colgroup>
      <thead>
        <tr>
          <th>選択</th>
          <th>商品情報</th>
          <th>小計 (税込)</th>
          <th>注文数量</th>
          <th v-if="type === 'cancel'">キャンセル数量</th>
          <th v-else>返品する数量</th>
        </tr>
      </thead>
      <tbody>
        <claim-item v-for="(option, idx) in options" :key="`option_${idx}`" :option="option" :type="type" @estimate="estimate" />
      </tbody>
    </table>
  </div>
</template>

<script>
import ClaimItem from '@/components/mypage/order/claim/ClaimItem'

export default {
  props: ['options', 'type'],
  methods: {
    estimate () {
      this.$emit('estimate')
    }
  },
  components: {
    ClaimItem
  }
}
</script>
