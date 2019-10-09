<template>
  <div class="settlement_information">
    <div class="settlement_information_ttl">
      <p class="ttl">返金情報</p>
    </div>
    <div class="menuItems order_new_margin_bottom">
      <div class="pay_info">
        <div class="product_detail order_settle_detail">
          <dl class="product_detail_list">
            <dt><span class="c-333">小計(税込)</span> <span class="tax"></span></dt>
            <dd>
              <div>
                <p class="bold c-333">￥<span class="common-V V-9">{{(productAmtInfo.totalAmt - subtractionAmtInfo.cartCouponAmt) | formatCurrency}}</span>
                </p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list new-size_6">
            <dt>商品価格(税抜)</dt>
            <dd>
              <div class="bx_price">
                <p><span class="number new-size_7"><span class="new-font_bold">￥</span>{{(productAmtInfo.standardPrice - refundSalesTaxAmt) | formatCurrency}}</span></p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list new-size_6">
            <dt>割引</dt>
            <dd>
              <div class="bx_price">
                <p>
                  <span class="number new-size_7">
                    <template v-if="productAmtInfo.immediateDiscountAmt">-</template>
                    <span class="new-font_bold">￥</span>{{productAmtInfo.immediateDiscountAmt | formatCurrency}}
                  </span>
                </p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list new-size_6">
            <dt>特別割引</dt>
            <dd>
              <div class="bx_price">
                <p>
                  <span class="number new-size_7">
                    <template v-if="productAmtInfo.additionalDiscountAmt">-</template>
                    <span class="new-font_bold">￥</span>{{productAmtInfo.additionalDiscountAmt | formatCurrency}}
                  </span>
                </p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list new-size_6">
            <dt>商品割引クーポン</dt>
            <dd>
              <div class="bx_price">
                <p>
                  <span class="number new-size_7">
                    <template v-if="productAmtInfo.productCouponDiscountAmt">-</template>
                    <span class="new-font_bold">￥</span>{{productAmtInfo.productCouponDiscountAmt | formatCurrency}}
                  </span>
                </p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list new-size_6">
            <dt>カートクーポン</dt>
            <dd>
              <div class="bx_price">
                <p>
                  <span class="number new-size_7">
                    <template v-if="subtractionAmtInfo.cartCouponAmt">-</template>
                    <span class="new-font_bold">￥</span>{{subtractionAmtInfo.cartCouponAmt | formatCurrency}}
                  </span>
                </p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list new-size_6">
            <dt>返金時の差し引き額</dt>
            <dd>
              <div class="bx_price">
                <p>
                  <span class="number new-size_7">
                    <template v-if="subtractionAmtInfo.refundAdjustAmt">-</template>
                    <span class="new-font_bold">￥</span>{{subtractionAmtInfo.refundAdjustAmt | formatCurrency}}
                  </span>
                </p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list new-size_6">
            <dt>消費税</dt>
            <dd>
              <div class="bx_price">
                <p><span class="number new-size_7"><span class="new-font_bold">￥</span>{{refundSalesTaxAmt | formatCurrency}}</span></p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list mt-20">
            <dt class="c-333">送料</dt>
            <dd>
              <div>
                <p class="bold c-333">
                  <template v-if="deliveryAmtInfo.totalAmt < 0">-</template>
                  ￥<span class="common-V V-9">{{Math.abs(deliveryAmtInfo.totalAmt) | formatCurrency}}</span>
                </p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list mt-12">
            <dt class="c-333">返金額 </dt>
            <dd>
              <div>
                <p class="bold f-13">￥<span class="common-V V-14">{{refundPayAmt | formatCurrency}}</span></p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list mt-5">
            <dt>{{refundInfos[0].refundTypeLabel}}決済取消</dt>
            <dd>
              <div>
                <p class="bold">￥<span class="common-V V-9">{{refundPayAmt | formatCurrency}}</span></p>
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['refundInfos'],
  data () {
    return {
      productAmtInfo: {
        totalAmt: 0,
        standardPrice: 0,
        immediateDiscountAmt: 0,
        additionalDiscountAmt: 0,
        productCouponDiscountAmt: 0
      },
      subtractionAmtInfo: {
        refundAdjustReason: [],
        refundAdjustAmt: 0,
        deliveryCouponAmt: 0,
        cartCouponAmt: 0,
        totalAmt: 0
      },
      deliveryAmtInfo: {
        totalAmt: 0
      },
      refundPayAmt: 0,
      refundMainPayAmt: 0,
      refundSubPayAmt: 0,
      refundSalesTaxAmt: 0
    }
  },
  methods: {
    setAmt () {
      this.refundInfos.forEach(data => {
        this.productAmtInfo.totalAmt += data.productAmtInfo.totalAmt
        this.productAmtInfo.standardPrice += data.productAmtInfo.standardPrice
        this.productAmtInfo.immediateDiscountAmt += data.productAmtInfo.immediateDiscountAmt
        this.productAmtInfo.additionalDiscountAmt += data.productAmtInfo.additionalDiscountAmt
        this.productAmtInfo.productCouponDiscountAmt += data.productAmtInfo.productCouponDiscountAmt
        this.deliveryAmtInfo.totalAmt += data.deliveryAmtInfo.totalAmt
        let totalAmt = data.subtractionAmtInfo.cartCouponAmt + data.subtractionAmtInfo.deliveryCouponAmt + data.productAmtInfo.immediateDiscountAmt + data.productAmtInfo.additionalDiscountAmt + data.productAmtInfo.productCouponDiscountAmt
        this.subtractionAmtInfo.totalAmt += totalAmt
        if (data.subtractionAmtInfo.refundAdjustReason) {
          this.subtractionAmtInfo.refundAdjustReason.push(data.subtractionAmtInfo.refundAdjustReason)
        }
        this.subtractionAmtInfo.refundAdjustAmt += data.subtractionAmtInfo.refundAdjustAmt
        this.subtractionAmtInfo.deliveryCouponAmt += data.subtractionAmtInfo.deliveryCouponAmt
        this.subtractionAmtInfo.cartCouponAmt += data.subtractionAmtInfo.cartCouponAmt
        this.refundPayAmt += data.refundPayAmt
        this.refundMainPayAmt += data.refundMainPayAmt
        this.refundSubPayAmt += data.refundSubPayAmt
        this.refundSalesTaxAmt += data.refundSalesTaxAmt
      })
    }
  },
  watch: {
    refundInfos () {
      this.productAmtInfo.totalAmt = 0
      this.productAmtInfo.standardPrice = 0
      this.productAmtInfo.immediateDiscountAmt = 0
      this.productAmtInfo.additionalDiscountAmt = 0
      this.productAmtInfo.productCouponDiscountAmt = 0
      this.deliveryAmtInfo.totalAmt = 0
      this.subtractionAmtInfo.totalAmt = 0
      this.subtractionAmtInfo.refundAdjustReason = []
      this.subtractionAmtInfo.refundAdjustAmt = 0
      this.subtractionAmtInfo.deliveryCouponAmt = 0
      this.subtractionAmtInfo.cartCouponAmt = 0
      this.refundPayAmt = 0
      this.refundMainPayAmt = 0
      this.refundSubPayAmt = 0
      this.setAmt()
    }
  },
  created () {
    this.setAmt()
  }
}
</script>
