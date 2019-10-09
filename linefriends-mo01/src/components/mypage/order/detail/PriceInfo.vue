<template>
  <div class="settlement_information">
    <div class="settlement_information_ttl">
      <p class="ttl">決済情報</p>
    </div>
    <div class="menuItems order_new_margin_bottom">
      <div class="pay_info">
        <div class="product_detail order_settle_detail">
          <dl class="product_detail_list">
            <dt><span class="c-333">小計(税込)</span> <span class="tax"></span></dt>
            <dd>
              <div>
                <p class="bold c-333">￥<span class="common-V V-9">{{price.standardAmt - price.immediateDiscountAmt - price.additionalDiscountAmt - price.productCouponDiscountAmt - price.cartCouponDiscountAmt | formatCurrency}}</span>
                </p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list new-size_6">
            <dt>商品価格(税抜)</dt>
            <dd>
              <div class="bx_price">
                <p><span class="number new-size_7"><span class="new-font_bold">￥</span>{{(price.standardAmt - price.salesTaxAmt) | formatCurrency}}</span></p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list new-size_6">
            <dt>割引</dt>
            <dd>
              <div class="bx_price">
                <p>
                  <span class="number new-size_7">
                    <template v-if="price.immediateDiscountAmt">-</template>
                    <span class="new-font_bold">￥</span>{{price.immediateDiscountAmt | formatCurrency}}
                  </span>
                </p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list new-size_6">
            <dt>特別割引</dt>
            <dd>
              <div class="bx_price">
                <p><span class="number new-size_7">
                    <template v-if="price.additionalDiscountAmt">-</template>
                    <span class="new-font_bold">￥</span>{{price.additionalDiscountAmt | formatCurrency}}
                  </span>
                </p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list new-size_6">
            <dt>商品割引クーポン</dt>
            <dd>
              <div class="bx_price">
                <p><span class="number new-size_7">
                    <template v-if="price.productCouponDiscountAmt">-</template>
                    <span class="new-font_bold">￥</span>{{price.productCouponDiscountAmt | formatCurrency}}
                  </span>
                </p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list new-size_6">
            <dt>カートクーポン</dt>
            <dd>
              <div class="bx_price">
                <p><span class="number new-size_7">
                    <template v-if="price.cartCouponDiscountAmt">-</template>
                    <span class="new-font_bold">￥</span>{{price.cartCouponDiscountAmt | formatCurrency}}
                  </span>
                </p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list new-size_6">
            <dt>消費税</dt>
            <dd>
              <div class="bx_price">
                <p><span class="number new-size_7"><span class="new-font_bold">￥</span>{{price.salesTaxAmt | formatCurrency}}</span></p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list mt-20">
            <dt class="c-333">送料</dt>
            <dd>
              <div>
                <p class="bold c-333">￥<span class="common-V V-9">{{(price.deliveryAmt + price.remoteDeliveryAmt) | formatCurrency}}</span></p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list f-6-area mt-2">
            <dt>- 基本送料</dt>
            <dd>
              <div>
                <p class="bold">￥<span class="common-V V-7">{{price.deliveryAmt | formatCurrency}}</span></p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list f-6-area mt-2">
            <dt>- 地域別追加送料</dt>
            <dd>
              <div>
                <p class="bold">￥<span class="common-V V-7">{{price.remoteDeliveryAmt | formatCurrency}}</span></p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list mt-12">
            <dt class="c-333">お支払金額</dt>
            <dd>
              <div>
                <p class="bold f-13">￥<span class="common-V V-14">{{price.payAmt | formatCurrency}}</span></p>
              </div>
            </dd>
          </dl>
          <dl class="product_detail_list mt-5">
            <dt>決済方法</dt>
            <dd>{{order.payTypeLabel}}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['price', 'order']
}
</script>
