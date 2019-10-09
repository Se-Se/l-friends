<template>
  <div
    v-if="product"
    class="detail-info"
  >
    <template v-if="product.partnerNotice">
      <div v-html="product.partnerNotice.content"></div>
    </template>
    <template v-if="product.baseInfo.contentHeader">
      <div v-html="product.baseInfo.contentHeader" />
    </template>
    <div v-html="product.baseInfo.content" />
    <template v-if="product.baseInfo.contentFooter">
      <div v-html="product.baseInfo.contentFooter" />
    </template>

    <div class="detail-info__product">
      <p class="detail-info__product-title">{{ $t('goods.detail.info.title') }}</p>
      <table class="detail-info__tbl">
        <colgroup>
          <col span="1" style="width: 200px;"/>
          <col span="1" style="width: 980px;"/>
        </colgroup>
        <tbody>
          <tr
            v-for="(item, key) in baseInfo"
            :key="key"
          >
            <th>{{ Object.keys(item)[0] }}</th>
            <td><pre>{{ Object.values(item)[0] }}</pre></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      v-if="deliveryCustomerInfo"
      class="detail-info__warning"
    >
      <h2 class="detail-info__warning-title">{{ $t('goods.detailInfo.title') }}</h2>
      <div class="detail-info__warning-description">
        <p
          v-for="(info, key) in deliveryCustomerInfo"
          :key="key"
        >
          {{ info }}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'detail-info',
  props: {
    product: {
      type: Object,
      required: false
    }
  },
  computed: {
    ...mapState('productrecommand', { recommands: 'list' }),
    baseInfo () {
      const baseInfoJSON = this.product.baseInfo.baseInfoByJSON
      const contents = (baseInfoJSON && baseInfoJSON.contents) || {}
      return this.product ? contents : {}
    },
    deliveryCustomerInfo () {
      return this.product && this.product.deliveryFee && this.product.deliveryFee.deliveryCustomerInfo ? this.product.deliveryFee.deliveryCustomerInfo.split('\n') : null
    }
  }
}
</script>
