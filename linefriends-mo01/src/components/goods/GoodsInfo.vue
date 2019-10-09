<template>
  <div>
    <div class="detail_info">
      <template v-if="product && product.partnerNotice && product.partnerNotice">
        <div v-html=" product.partnerNotice.content"></div>
      </template>
      <template v-if="product && product.baseInfo && product.baseInfo.contentHeader">
        <div v-html="product.baseInfo.contentHeader" />
      </template>
      <template v-if="product && product.baseInfo">
        <div v-html="product.baseInfo.content" />
      </template>
      <template v-if="product && product.baseInfo && product.baseInfo.contentFooter">
        <div v-html="product.baseInfo.contentFooter" />
      </template>
    </div>
    <div class="commodity_info">
      <h3 class="ttl_h3">商品情報</h3>
      <div class="info_con">
        <dl v-for="(item, key) in baseInfo" :key="key">
          <dt>{{ Object.keys(item)[0] }}</dt>
          <dd>{{ Object.values(item)[0] }}</dd>
        </dl>
      </div>
      <h3 class="ttl_h3" v-if="deliveryCustomerInfo">取り扱い上の注意</h3>
      <ul class="info_con_list">
        <li v-for="(info, key) in deliveryCustomerInfo" :key="key">{{ info }}</li>
      </ul>
    </div>
    <template v-if="recommands&&recommands.length!=0">
      <goods-recommands :goods="recommands" />
    </template>

  </div>

</template>

<script>
import GoodsRecommands from '@/components/goods/GoodsRecommands'
import { mapState } from 'vuex'

export default {
  name: 'GoodsInfo',
  props: ['product'],
  computed: {
    ...mapState('productrecommand', { recommands: 'list' }),
    baseInfo () {
      if (this.product) {
        const baseInfoJSON = this.product.baseInfo.baseInfoByJSON
        const contents = (baseInfoJSON && baseInfoJSON.contents) || {}
        return this.product ? contents : {}
      } else {
        return {}
      }
    },
    deliveryCustomerInfo () {
      return this.product && this.product.deliveryFee && this.product.deliveryFee.deliveryCustomerInfo ? this.product.deliveryFee.deliveryCustomerInfo.split('\n') : null
    }
  },
  components: {
    // MainArticle,
    GoodsRecommands
  }
}
</script>

<style  scoped>
</style>
