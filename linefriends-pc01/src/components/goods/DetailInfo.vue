<template>
  <div class="item_detail_contents">
    <template v-if="product && product.partnerNotice && product.partnerNotice">
      <div v-html="_xssFilter(product.partnerNotice.content)" class="tab_contents"></div>
    </template>
    <template v-if="product && product.baseInfo && product.baseInfo.contentHeader">
      <div v-html="_xssFilter(product.baseInfo.contentHeader)" class="tab_contents" />
    </template>
    <template v-if="product && product.baseInfo">
      <div v-html="_xssFilter(product.baseInfo.content)" class="tab_contents" />
    </template>
    <template v-if="product && product.baseInfo && product.baseInfo.contentFooter">
      <div v-html="_xssFilter(product.baseInfo.contentFooter)" class="tab_contents" />
    </template>
    <div class="item_info_area">
      <p class="item_info_ttl">商品情報</p>
      <table class="table_style_1">
        <colgroup>
          <col width="200px">
          <col class="">
        </colgroup>
        <thead></thead>
        <tbody>
          <tr v-for="(item, key) in baseInfo" :key="key">
            <th>{{ Object.keys(item)[0] }}</th>
            <td>{{ Object.values(item)[0] }}</td>
          </tr>
        </tbody>
      </table>
      <dl class="item_note" v-if="deliveryCustomerInfo">
        <dt>取り扱い上の注意</dt>
        <dd v-for="(info, key) in deliveryCustomerInfo" :key="key"> {{info}}</dd>
      </dl>
    </div>
  </div>

</template>
<script>
import { xssFilter } from '@/utils/utils'
export default {
  name: 'detail-info',
  props: {
    product: {
      type: Object,
      required: false
    }
  },
  methods: {
    _xssFilter (str) {
      return xssFilter(str)
    }
  },
  computed: {
    baseInfo () {
      const baseInfoJSON = this.product ? this.product.baseInfo.baseInfoByJSON : null
      const contents = (baseInfoJSON && baseInfoJSON.contents) || {}
      return this.product ? contents : {}
    },
    deliveryCustomerInfo () {
      return this.product && this.product.deliveryFee && this.product.deliveryFee.deliveryCustomerInfo ? this.product.deliveryFee.deliveryCustomerInfo.split('\n') : null
    }
  }
}
</script>
