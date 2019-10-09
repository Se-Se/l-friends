<template>
  <div class="main">
    <div class="order_ser">
      <p>{{order.orderYmdt | dateFormatStr('yyyy-MM-dd')}}</p>
      <p class="order_ser_no">注文番号 : {{order.orderNo}}</p>
    </div>

    <h3 class="detail_ttl">注文履歴・配送状況</h3>
    <product-info :productInfo="productInfo" @writeReview="writeReview" @showInquiryPop="showInquiryPop" v-if="productInfo" />

    <div class="order-content">
      <div class="order_detail_table_area">
        <price-info :price="order.firstOrderAmount" :order="order" />
        <refund-info :refundInfos="order.refundInfos" v-if="order.refundInfos && order.refundInfos.length > 0" />
        <div class="order_detail_table" v-else>
          <h1>ご購入者様情報</h1>
          <table>
            <tr>
              <th>ご購入者様</th>
              <td>{{order.orderer.ordererName}}</td>
            </tr>
            <tr v-if="order.orderer.ordererContact1 && order.orderer.ordererContact1 !== ''">
              <th>電話番号</th>
              <td>{{theMobile}}</td>
            </tr>
            <tr>
              <th>メールアドレス</th>
              <td>{{order.orderer.ordererEmail}}</td>
            </tr>
          </table>
        </div>
        <delivery-info :order="order" :productInfo="productInfo" @openPop="openPop" />
      </div>
      <div class="order_detail_hint">
        <span class="order-new_fc">
          商品準備中又は出荷準備中の場合、お届け先を変更することができません。変更のご希望がある場合は、1：1お問い合わせをご利用ください。
        </span>
      </div>
      <div class="order_detail_btn_area margin_top_8">
        <button class="btn btn_green" @click.prevent="toList">注文一覧</button>
      </div>
    </div>
  </div>
</template>

<script>
import ProductInfo from '@/components/mypage/order/detail/ProductInfo'
import PriceInfo from '@/components/mypage/order/detail/PriceInfo'
import DeliveryInfo from '@/components/mypage/order/detail/DeliveryInfo'
import RefundInfo from '@/components/mypage/order/detail/RefundInfo'
export default {
  props: ['order', 'productInfo'],
  methods: {
    openPop () {
      this.$emit('openPop')
    },
    writeReview (review) {
      this.$emit('writeReview', review)
    },
    showInquiryPop (productNo) {
      this.$emit('showInquiryPop', productNo)
    },
    toList () {
      if (this.$route.query.type === 'cancel') {
        this.$router.push('/mypage/cancellist')
      } else {
        this.$router.push('/mypage/orderlist')
      }
    }
  },
  computed: {
    theMobile () {
      let mobileNo = ''
      if (this.order && this.order.orderer && this.order.orderer.ordererContact1) {
        if (this.order.orderer.ordererContact1.indexOf('-') > -1) {
          mobileNo = this.order.orderer.ordererContact1
        } else {
          let thelength = this.order.orderer.ordererContact1.length
          let contactOne = this.order.orderer.ordererContact1.substring(0, thelength - 8)
          let contactTwo = this.order.orderer.ordererContact1.substring(thelength - 8, thelength - 4)
          let contactThree = this.order.orderer.ordererContact1.substring(thelength - 4, thelength)
          mobileNo = `${contactOne}-${contactTwo}-${contactThree}`
        }
      }
      return mobileNo
    }
  },
  components: {
    ProductInfo,
    PriceInfo,
    DeliveryInfo,
    RefundInfo
  }
}
</script>
<style scoped>
.order-content .order_detail_btn_area.margin_top_8{
  margin-top:80px;
}
</style>
