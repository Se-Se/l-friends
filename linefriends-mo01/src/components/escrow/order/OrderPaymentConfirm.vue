<template>
  <div class="settlement_information">
    <div class="menuItems order_new_margin_bottom">
      <div class="pay_info">
        <div class="product_detail order_settle_detail">
          <dl class="product_detail_list">
            <dt><span class="c-333">小計(税込)</span> <span class="tax"></span></dt>
            <dd>
              <div>
                <p class="bold c-333">￥<span class="common-V V-9" v-if="order.paymentInfo">{{ totalCartAmt | formatCurrency }}</span>
                </p>
              </div>
            </dd>
          </dl>
          <!--<dl class="product_detail_list mt-5">-->
          <!--<dt>総合計</dt>-->
          <!--<dd>-->
          <!--<div>-->
          <!--<p class="bold">- ￥<span class="common-V V-9" v-if="order.paymentInfo">{{ order.paymentInfo.totalStandardAmt | formatCurrency }}</span></p>-->
          <!--</div>-->
          <!--</dd>-->
          <!--</dl>-->
          <dl class="product_detail_list new-size_6">
            <dt>商品価格(税抜)</dt>
            <dd>
              <div class="bx_price">
                <p><span class="number new-size_7"><span class="new-font_bold">￥</span>{{totalCartTaxAmt | formatCurrency}}</span></p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list new-size_6">
            <dt>割引</dt>
            <dd v-if="order.paymentInfo.totalImmediateDiscountAmt !== 0">
              <div class="bx_price">
                <p><span class="number new-size_7" v-if="order.paymentInfo">-<span class="new-font_bold">￥</span>{{ order.paymentInfo.totalImmediateDiscountAmt | formatCurrency }}</span></p>
              </div>
            </dd>
            <dd v-else>
              <div class="bx_price">
                <p><span class="number new-size_7" v-if="order.paymentInfo"><span class="new-font_bold">￥</span>0</span></p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list new-size_6">
            <dt>特別割引</dt>
            <dd v-if="order.paymentInfo.totalAdditionalDiscountAmt !== 0">
              <div class="bx_price">
                <p><span class="number new-size_7" v-if="order.paymentInfo">-<span class="new-font_bold">￥</span>{{ order.paymentInfo.totalAdditionalDiscountAmt | formatCurrency }}</span></p>
              </div>
            </dd>
            <dd v-else>
              <div class="bx_price">
                <p><span class="number new-size_7" v-if="order.paymentInfo"><span class="new-font_bold">￥</span>0</span></p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list new-size_6">
            <dt>商品割引クーポン</dt>
            <dd v-if="order.paymentInfo.productCouponAmt !== 0">
              <div class="bx_price">
                <p><span class="number new-size_7" v-if="order.paymentInfo">-<span class="new-font_bold">￥</span>{{ order.paymentInfo.productCouponAmt | formatCurrency }}</span></p>
              </div>
            </dd>
            <dd v-else>
              <div class="bx_price">
                <p><span class="number new-size_7" v-if="order.paymentInfo"><span class="new-font_bold">￥</span>0</span></p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list new-size_6">
            <dt>カートクーポン</dt>
            <dd v-if="order.paymentInfo.cartCouponAmt !== 0">
              <div class="bx_price">
                <p><span class="number new-size_7" v-if="order.paymentInfo">-<span class="new-font_bold">￥</span>{{ order.paymentInfo.cartCouponAmt | formatCurrency }}</span></p>
              </div>
            </dd>
            <dd v-else>
              <div class="bx_price">
                <p><span class="number new-size_7" v-if="order.paymentInfo"><span class="new-font_bold">￥</span>0</span></p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list new-size_6">
            <dt>消費税</dt>
            <dd>
              <div class="bx_price">
                <p><span class="number new-size_7" v-if="order.paymentInfo"><span class="new-font_bold">￥</span>{{ order.paymentInfo.salesTaxAmt | formatCurrency }}</span></p>
              </div>
            </dd>
          </dl>
          <!--<dl class="product_detail_list mt-5">-->
          <!--<dt class="c-333">税込</dt>-->
          <!--<dd>-->
          <!--<div>-->
          <!--<p class="bold c-333">￥<span class="common-V V-9" v-if="order.paymentInfo">{{ order.paymentInfo.salesTaxAmt | formatCurrency }}</span></p>-->
          <!--</div>-->
          <!--</dd>-->
          <!--</dl>-->
          <dl class="product_detail_list mt-20">
            <dt class="c-333">送料</dt>
            <dd>
              <div>
                <p class="bold c-333">￥<span class="common-V V-9" v-if="order.paymentInfo">{{ order.paymentInfo.deliveryAmt + order.paymentInfo.remoteDeliveryAmt | formatCurrency }}</span></p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list f-6-area mt-2">
            <dt>- 基本送料</dt>
            <dd>
              <div>
                <p class="bold">￥<span class="common-V V-7" v-if="order.paymentInfo">{{ order.paymentInfo.deliveryAmt || 0 | formatCurrency }}</span></p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list f-6-area mt-2">
            <dt>- 地域別追加送料</dt>
            <dd>
              <div>
                <p class="bold">￥<span class="common-V V-7" v-if="order.paymentInfo">{{ order.paymentInfo.remoteDeliveryAmt  || 0 | formatCurrency }}</span></p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list mt-12">
            <dt class="c-333">お支払金額</dt>
            <dd>
              <div>
                <p class="bold f-13">￥<span class="common-V V-14" v-if="order.paymentInfo">{{ order.paymentInfo.paymentAmt | formatCurrency }}</span></p>
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

export default {
  name: 'OrderPaymentConfirm',
  props: ['order'],
  data () {
    return {
      active: {
        order: false,
        payment: false
      },
      accumulationAmt: 0
    }
  },
  computed: {
    totalCartAmt () {
      return this.order.paymentInfo.totalStandardAmt- this.order.paymentInfo.totalImmediateDiscountAmt - this.order.paymentInfo.totalAdditionalDiscountAmt - this.order.paymentInfo.productCouponAmt - this.order.paymentInfo.cartCouponAmt
    },
    totalCartTaxAmt () {
      return this.order.paymentInfo.totalStandardAmt - this.order.paymentInfo.salesTaxAmt
    },
    totalStandardAmt () {
      if (this.order.paymentInfo) {
        return this.order.paymentInfo.totalStandardAmt
      }
    },
    totalDiscountAmt () {
      if (this.order.paymentInfo) {
        return this.order.paymentInfo.totalAdditionalDiscountAmt +
          this.order.paymentInfo.totalImmediateDiscountAmt +
          this.order.paymentInfo.productCouponAmt +
          this.order.paymentInfo.cartCouponAmt
      }
    },
    totalDeliveryAmt () {
      if (this.order.paymentInfo) {
        return this.order.paymentInfo.deliveryAmt
      }
    },
    payAmt () {
      return this.totalStandardAmt - this.totalDiscountAmt + this.totalDeliveryAmt
    },
    showTotalDiscountAmt () {
      return this.totalDiscountAmt > 0 ? this.totalDiscountAmt * -1 : this.totalDiscountAmt
    },
    showDeliveryCouponAmt () {
      return this.order.paymentInfo.deliveryCouponAmt > 0 ? this.order.paymentInfo.deliveryCouponAmt * -1 : this.order.paymentInfo.deliveryCouponAmt
    },
    showTotalDeliveryAmt () {
      return this.order.paymentInfo.deliveryAmt + this.order.paymentInfo.remoteDeliveryAmt - this.order.paymentInfo.deliveryCouponAmt
    }
  }
}
</script>
