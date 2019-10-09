<template>
  <div class="settlement_information">
    <div class="settlement_information_ttl cf">
      <p class="ttl new_ttl1">お届け先情報</p>
      <div class="order_new_button_width_10">
        <button class="btn btn_primary size_s order_button_padding_new" @click.prevent="editAddress" v-if="showBtn">お届け先の変更</button>
      </div>
    </div>
    <div class="menuItems order_new_margin_bottom order_font_family_kr">
      <div class="pay_info">
        <div class="product_detail">
          <dl class="product_detail_list dark">
            <dt>受取人</dt>
            <dd>{{address.receiverName}}</dd>
          </dl>
          <dl class="product_detail_list dark">
            <dt>住所</dt>
            <dd>
              ({{address.receiverZipCd}}) {{address.receiverAddress}}<br>
              {{address.receiverDetailAddress}}
            </dd>
          </dl>
          <dl class="product_detail_list dark">
            <dt>電話番号</dt>
            <dd>{{address.receiverContact1}}</dd>
          </dl>
          <dl class="product_detail_list dark">
            <dt>ご希望のお届け日</dt>
            <dd>{{order.deliveryWishYmdt}}</dd>
          </dl>
          <dl class="product_detail_list dark">
            <dt class="meta_se">ご希望のお届け時間帯</dt>
            <dd>{{order.deliveryTimeText}}</dd>
          </dl>
          <dl class="product_detail_list dark">
            <dt>配送コメント</dt>
            <dd v-if="order.deliveryMemo">{{order.deliveryMemo}}</dd>
            <dd v-else>なし</dd>
          </dl>
        </div>
      </div>
    </div>
    <div class="order_remind_new">商品準備中又は出荷準備中の場合、お届け先を変更することができません。変更のご希望がある場合は、
      1：1お問い合わせをご利用ください。</div>
    <button class="btn btn_green order_button_margin_new" @click.prevent="toList">注文一覧</button>
  </div>
</template>

<script>
export default {
  props: ['order', 'address', 'productInfo'],
  computed: {
    showBtn () {
      let isShow = !this.productInfo.some(item => {
        return item.orderStatusType !== 'DEPOSIT_WAIT' && item.orderStatusType !== 'PAY_DONE'
      })
      return isShow
    }
  },
  methods: {
    editAddress () {
      this.$router.push(`/m/mypage/editAddress/${this.$route.params.orderNo}`)
    },
    toList () {
      this.$router.push('/m/mypage/orderlist')
    }
  }
}
</script>
