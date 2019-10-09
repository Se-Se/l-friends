<template>
  <div class="nodata">
    <p><img src="~@/assets/img/order/img_none.png" alt=""></p>
    <p class="text" v-if="theType === 'order'">注文・発送履歴がありません。<br>
      注文はこちらから</p>
      <p class="text" v-else>キャンセル/返品履歴がありません。</p>
    <p class="all_btn"><button class="btn btn_primary size_m" @click="goGood()">すべての商品</button></p>
  </div>
</template>
<script>
export default {
  props: ['theType'],
  methods: {
    goGood () {
      this.$router.push('/goods')
    }
  }
}
</script>
