<template>
  <div class="order_detail_table">
    <h1>返金情報</h1>
    <table class="economic_info">
      <colgroup>
        <col style="width:393px;">
        <col style="width:394px;">
        <col style="width:393px;">
      </colgroup>
      <tbody>
        <tr>
          <th>
            <dl>
              <dt>
                小計 (税込)
                <div class="tip">
                  <div class="tip_popup size_1">
                    <dl>
                      <dt>商品価格(税抜)</dt>
                      <dd>
                        <i class="uom-14">￥</i>
                        <span class="num">{{(productAmtInfo.standardPrice - refundSalesTaxAmt) | formatCurrency}}</span>
                      </dd>
                    </dl>
                    <dl>
                      <dt>割引</dt>
                      <dd v-if="productAmtInfo.immediateDiscountAmt !== 0">
                        <i class="uom-14">-￥</i>
                        <span class="num">{{productAmtInfo.immediateDiscountAmt | formatCurrency}}</span>
                      </dd>
                      <dd v-else>
                        <i class="uom-14">￥</i>
                        <span class="num">0</span>
                      </dd>
                    </dl>
                    <dl>
                      <dt>特別割引</dt>
                      <dd v-if="productAmtInfo.additionalDiscountAmt !== 0">
                        <i class="uom-14">-￥</i>
                        <span class="num">{{productAmtInfo.additionalDiscountAmt | formatCurrency}}</span>
                      </dd>
                      <dd v-else>
                        <i class="uom-14">￥</i>
                        <span class="num">0</span>
                      </dd>
                    </dl>
                    <dl>
                      <dt>商品割引クーポン</dt>
                      <dd v-if="productAmtInfo.productCouponDiscountAmt !== 0">
                        <i class="uom-14">-￥</i>
                        <span class="num">{{productAmtInfo.productCouponDiscountAmt | formatCurrency}}</span>
                      </dd>
                      <dd v-else>
                        <i class="uom-14">￥</i>
                        <span class="num">0</span>
                      </dd>
                    </dl>
                    <dl>
                      <dt>カートクーポン</dt>
                      <dd v-if="subtractionAmtInfo.cartCouponAmt !== 0">
                        <i class="uom-14">-￥</i>
                        <span class="num">{{subtractionAmtInfo.cartCouponAmt | formatCurrency}}</span>
                      </dd>
                      <dd v-else>
                        <i class="uom-14">￥</i>
                        <span class="num">0</span>
                      </dd>
                    </dl>
                    <dl>
                      <dt>返金時の差し引き額</dt>
                      <dd v-if="subtractionAmtInfo.refundAdjustAmt !== 0">
                        <i class="uom-14">-￥</i>
                        <span class="num">{{subtractionAmtInfo.refundAdjustAmt | formatCurrency}}</span>
                      </dd>
                      <dd v-else>
                        <i class="uom-14">￥</i>
                        <span class="num">0</span>
                      </dd>
                    </dl>
                    <dl>
                      <dt>消費税</dt>
                      <dd>
                        <i class="uom-14">￥</i>
                        <span class="num">{{refundSalesTaxAmt | formatCurrency}}</span>
                      </dd>
                    </dl>
                  </div>
                </div>
              </dt>
              <dd>
                <i class="uom-16">￥</i>{{(productAmtInfo.totalAmt - subtractionAmtInfo.cartCouponAmt) | formatCurrency}}
              </dd>
            </dl>
          </th>
          <th class="ico_result ico_plus">
            <dl>
              <dt>送料</dt>
              <dd>
                <i class="uom-16"><template v-if="deliveryAmtInfo.totalAmt < 0">-</template>￥</i>
                {{Math.abs(deliveryAmtInfo.totalAmt) | formatCurrency}}
              </dd>
            </dl>
          </th>
          <th>
            <dl class="payment">
              <dt>返金額</dt>
              <dd class="color-red"><i>￥</i><span class="num_nine">{{refundPayAmt | formatCurrency}}</span></dd>
            </dl>
            <dl class="payment have-ico">
              <dt class="color_grey">{{refundInfos[0].refundTypeLabel}}<br>決済取消</dt>
              <dd class="color_grey price"><i>￥</i><span class="num">{{refundPayAmt | formatCurrency}}</span></dd>
            </dl>
          </th>
        </tr>
      </tbody>
    </table>
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
