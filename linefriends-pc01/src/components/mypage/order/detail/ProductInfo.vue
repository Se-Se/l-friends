<template>
  <div class="table_wrap">
    <table class="table_data myorder_table">
      <colgroup>
        <col style="width:590px;">
        <col style="width:140px;">
        <col style="width:140px;">
        <col style="width:170px;">
        <col style="width:140px;">
      </colgroup>
      <thead>
        <tr>
          <th>商品情報</th>
          <th>個数</th>
          <th>小計 (税込)</th>
          <th>ステータス</th>
          <th>管理</th>
        </tr>
      </thead>
      <tbody>
        <product-card v-for="(option, idx) in productInfo" :key="idx" :option="option" :options="productInfo" @writeReview="writeReview" @showInquiryPop="showInquiryPop" />
      </tbody>
    </table>
  </div>
</template>

<script>
import ProductCard from '@/components/mypage/order/detail/ProductCard'

export default {
  props: ['productInfo'],
  methods: {
    writeReview (review) {
      this.$emit('writeReview', review)
    },
    showInquiryPop (productNo) {
      this.$emit('showInquiryPop', productNo)
    }
  },
  components: {
    ProductCard
  }
}
</script>
