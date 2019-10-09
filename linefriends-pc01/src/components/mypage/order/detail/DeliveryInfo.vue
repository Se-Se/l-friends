<template>
  <div class="order_detail_table" v-if="deliveryCheck">
    <dl>
      <dt>
        <h1>お届け先情報</h1>
      </dt>
      <dd>
        <a href="javascript:" @click.prevent="openPop" v-if="showBtn">
          お届け先の変更
          <img alt="" src="@/assets/img/icon/ico_more.png" class="change_shipping_addr">
        </a>
      </dd>
    </dl>
    <table>
      <tr>
        <th>受取人</th>
        <td>{{order.shippingAddress.receiverName}}</td>
      </tr>
      <tr>
        <th>住所</th>
        <td>({{order.shippingAddress.receiverZipCd}}) {{order.shippingAddress.receiverAddress}} {{order.shippingAddress.receiverDetailAddress}}</td>
      </tr>
      <tr>
        <th>電話番号</th>
        <td>{{order.shippingAddress.receiverContact1}}</td>
      </tr>
      <tr>
        <th>ご希望のお届け日</th>
        <td>{{order.deliveryWishYmdt}}</td>
      </tr>
      <tr>
        <th>ご希望のお届け時間帯</th>
        <td>{{order.deliveryTimeText}}</td>
      </tr>
      <tr>
        <th>配送コメント</th>
        <td v-if="order.deliveryMemo">{{order.deliveryMemo}}</td>
        <td v-else>なし</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: ['order', 'productInfo'],
  computed: {
    showBtn () {
      let isShow = !this.productInfo.some(item => {
        return item.orderStatusType !== 'DEPOSIT_WAIT' && item.orderStatusType !== 'PAY_DONE'
      })
      return isShow
    },
    deliveryCheck () {
      return this.order.orderOptionsGroupByPartner[0].orderOptionsGroupByDelivery[0].orderOptions[0].deliverable
    }
  },
  methods: {
    openPop () {
      this.$emit('openPop')
    }
  }
}
</script>
