<template>
  <div id="container" class="cart-order">
    <div class="order-success_header">
      <h1>注文を完了いたしました。</h1>
      <p class="order-success_number">
        <router-link :to="`/m/mypage/orderdetail/${orderNo}`">{{orderNo}}</router-link>
      </p>
      <p><img src="@/assets/img/order/img_order_scuess.png" alt=""></p>
    </div>

    <!-- ↓↓↓↓↓ cart_wrapper ↓↓↓↓↓ -->
    <div class="cart_wrapper">
      <div class="order-success_info">
        <!--<div class="order-info_address">-->
        <!--<dl>-->
        <!--<dt>注文者</dt>-->
        <!--<dd>{{this.order.orderer.ordererName}}</dd>-->
        <!--</dl>-->
        <!--<dl>-->
        <!--<dt>お届け先情報</dt>-->
        <!--<dd>{{this.order.shippingAddress.receiverName}}<span>{{this.order.orderer.ordererContact1}}</span><span>({{this.order.shippingAddress.receiverZipCd}}) {{this.order.shippingAddress.receiverAddress}} {{this.order.shippingAddress.receiverDetailAddress}}</span></dd>-->
        <!--</dl>-->
        <!--<dl>-->
        <!--<dt>ご希望のお届け日</dt>-->
        <!--<dd>{{this.order.deliveryWishYmdt}}<span v-if="this.dayOfWeeks" style="display: inline !important;">({{this.dayOfWeeks}})</span></dd>-->
        <!--</dl>-->
        <!--<dl>-->
        <!--<dt>ご希望のお届け時間帯</dt>-->
        <!--<dd>{{this.order.deliveryTimeText}}</dd>-->
        <!--</dl>-->
        <!--<dl>-->
        <!--<dt>配送コメント</dt>-->
        <!--<dd>{{this.order.deliveryMemo}}</dd>-->
        <!--</dl>-->
        <!--&lt;!&ndash;<dl>&ndash;&gt;-->
        <!--&lt;!&ndash;<dt>決済情報</dt>&ndash;&gt;-->
        <!--&lt;!&ndash;<dd>{{this.order.payTypeLabel}}</dd>&ndash;&gt;-->
        <!--&lt;!&ndash;</dl>&ndash;&gt;-->
        <!--</div>-->

        <div class="cart_footer pt-0">
          <!--<div class="product_detail">-->
          <!--<dl class="product_detail_list dark">-->
          <!--<dt>総注文金額</dt>-->
          <!--<dd>-->
          <!--<div class="bx_price">-->
          <!--<p><span class="number"><span>￥</span>{{MyMiliForma(this.order.lastOrderAmount.standardAmt + this.order.lastOrderAmount.deliveryAmt + this.order.lastOrderAmount.remoteDeliveryAmt - this.order.lastOrderAmount.deliveryCouponDiscountAmt)}}</span></p>-->
          <!--</div>-->
          <!--</dd>-->
          <!--</dl>-->
          <!--<dl class="product_detail_list">-->
          <!--<dt>総合計</dt>-->
          <!--<dd>-->
          <!--<div class="bx_price">-->
          <!--<p><strong class="number"><span>-￥</span>{{MyMiliForma(this.order.lastOrderAmount.standardAmt)}}</strong></p>-->
          <!--</div>-->
          <!--</dd>-->
          <!--</dl>-->
          <!--<dl class="product_detail_list">-->
          <!--<dt>送料</dt>-->
          <!--<dd v-if="this.order.lastOrderAmount.deliveryAmt > 0">-->
          <!--<div class="bx_price">-->
          <!--<p><span class="number"><span>￥</span>{{MyMiliForma(this.order.lastOrderAmount.deliveryAmt + this.order.lastOrderAmount.remoteDeliveryAmt - this.order.lastOrderAmount.deliveryCouponDiscountAmt)}}</span></p>-->
          <!--</div>-->
          <!--</dd>-->
          <!--<dd v-else>-->
          <!--<div class="bx_price">-->
          <!--<p><span class="txt">送料無料</span></p>-->
          <!--</div>-->
          <!--</dd>-->
          <!--</dl>-->
          <!--<dl class="product_detail_list dark spec">-->
          <!--<dt>総割引金額</dt>-->
          <!--<dd>-->
          <!--<div class="bx_price">-->
          <!--<p><span class="number"><span>-￥</span>{{MyMiliForma(this.totalDiscountAmt)}}</span></p>-->
          <!--</div>-->
          <!--</dd>-->
          <!--</dl>-->
          <!--<dl class="product_detail_list">-->
          <!--<dt>割引</dt>-->
          <!--<dd>-->
          <!--<div class="bx_price">-->
          <!--<p><span class="number"><span>-￥</span>{{MyMiliForma(this.order.lastOrderAmount.immediateDiscountAmt)}}</span></p>-->
          <!--</div>-->
          <!--</dd>-->
          <!--</dl>-->
          <!--<dl class="product_detail_list">-->
          <!--<dt>特別割引</dt>-->
          <!--<dd>-->
          <!--<div class="bx_price">-->
          <!--<p><span class="number"><span>￥</span>{{MyMiliForma(this.order.lastOrderAmount.additionalDiscountAmt)}}</span></p>-->
          <!--</div>-->
          <!--</dd>-->
          <!--</dl>-->
          <!--<dl class="product_detail_list">-->
          <!--<dt>商品クーポン</dt>-->
          <!--<dd>-->
          <!--<div class="bx_price">-->
          <!--<p><span class="number"><span>￥</span>{{MyMiliForma(this.order.lastOrderAmount.productCouponDiscountAmt)}}</span></p>-->
          <!--</div>-->
          <!--</dd>-->
          <!--</dl>-->
          <!--<dl class="product_detail_list">-->
          <!--<dt>カートクーポン</dt>-->
          <!--<dd>-->
          <!--<div class="bx_price">-->
          <!--<p><span class="number"><span>￥</span>{{MyMiliForma(this.order.lastOrderAmount.cartCouponDiscountAmt)}}</span></p>-->
          <!--</div>-->
          <!--</dd>-->
          <!--</dl>-->
          <!--<dl class="product_detail_list dark total">-->
          <!--<dt>お支払金額</dt>-->
          <!--<dd>-->
          <!--<div class="bx_price">-->
          <!--<p><span class="number red"><span>￥</span>{{MyMiliForma(this.order.lastOrderAmount.chargeAmt)}}</span></p>-->
          <!--</div>-->
          <!--</dd>-->
          <!--</dl>-->
          <!--</div>-->

          <p class="order-notes">マイページで注文履歴及び配送状況を確認することができます。</p>

          <ul class="product_active">
            <li><button class="btn" @click.prevent="goToPage('MYPAGE')">マイページへ</button></li>
            <li><button class="btn btn_green" @click.prevent="goToPage('HOME')">トップページへ戻る</button></li>
          </ul>
        </div>
      </div>
    </div>
    <!-- ↑↑↑↑↑ cart_wrapper ↑↑↑↑↑ -->
  </div>
</template>

<script>
/* eslint-disable */
import PaymentConfirmNew from '@/components/mixins/order/PaymentConfirmNew'

export default {
  name: 'Complete',
  components: {
  },
  mixins: [PaymentConfirmNew],
  created () {
    this.deliveryYmt()
    // setTimeout(function () {
    // }, 300)
  },
  data () {
    return {
      dayOfWeeks: ''
    }
  },
  computed: {
    deliveryWish () {
      return this.order.deliveryWishYmdt
    }
  },
  methods: {
    goToPage (path) {
      if (path === 'HOME') {
        window.location.replace('/m')
      } else {
        window.location.replace('/m/mypage')
      }
    },
    deliveryYmt: function () {
      if (this.deliveryWish || this.deliveryWish !== '指定なし') {
        let date = new Date(this.deliveryWish)
        let year = date.getFullYear()
        let month = ('0' + (date.getMonth() + 1)).slice(-2)
        let day = date.getDate()
        day = day >= 10 ? day : '0' + day
        let dayOfWeek = date.getDay()
        this.dayOfWeeks = ['日', '月', '火', '水', '木', '金', '土'][dayOfWeek]
      }
    }
  }
}
</script>
