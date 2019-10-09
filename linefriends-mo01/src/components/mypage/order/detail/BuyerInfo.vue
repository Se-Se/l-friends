<template>
  <div class="settlement_information">
    <div class="settlement_information_ttl">
      <p class="ttl">ご購入者様情報</p>
    </div>
    <div class="menuItems order_new_margin_bottom order_font_family_kr">
      <div class="pay_info">
        <div class="product_detail">
          <dl class="product_detail_list dark">
            <dt>ご購入者様</dt>
            <dd>{{buyer.ordererName}}</dd>
          </dl>
          <dl class="product_detail_list dark" v-if="buyer.ordererContact1 && buyer.ordererContact1 !== ''">
            <dt>電話番号</dt>
            <dd>{{theMobile}}</dd>
          </dl>
          <dl class="product_detail_list dark">
            <dt>メールアドレス</dt>
            <dd>{{buyer.ordererEmail}}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['buyer'],
  computed: {
    theMobile () {
      let mobileNo = ''
      if (this.buyer && this.buyer.ordererContact1) {
        if (this.buyer.ordererContact1.indexOf('-') > -1) {
          mobileNo = this.buyer.ordererContact1
        } else {
          let thelength = this.buyer.ordererContact1.length
          let contactOne = this.buyer.ordererContact1.substring(0, thelength - 8)
          let contactTwo = this.buyer.ordererContact1.substring(thelength - 8, thelength - 4)
          let contactThree = this.buyer.ordererContact1.substring(thelength - 4, thelength)
          mobileNo = `${contactOne}-${contactTwo}-${contactThree}`
        }
      }
      return mobileNo
    }
  }
}
</script>
