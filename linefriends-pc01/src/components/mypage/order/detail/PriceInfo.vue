<template>
  <div class="order_detail_table">
    <h1>決済情報</h1>
    <table class="economic_info">
      <colgroup>
        <col style="width:393px;">
        <col style="width:394px;">
        <col style="width:393px;">
      </colgroup>
      <tr>
        <th>
          <dl>
            <dt>
              小計(税込)
              <div class="tip">
                <div class="tip_popup size_1">
                  <dl>
                    <dt>商品価格(税抜)</dt>
                    <dd>
                      <i class="uom-14">￥</i>
                      <span class="num">{{(price.standardAmt - price.salesTaxAmt) | formatCurrency}}</span>
                    </dd>
                  </dl>
                  <dl>
                    <dt>割引</dt>
                    <dd v-if="price.immediateDiscountAmt !== 0">
                      <i class="uom-14">-￥</i>
                      <span class="num">{{price.immediateDiscountAmt | formatCurrency}}</span>
                    </dd>
                    <dd v-else>
                      <i class="uom-14">￥</i>
                      <span class="num">0</span>
                    </dd>
                  </dl>
                  <dl>
                    <dt>特別割引</dt>
                    <dd v-if="price.additionalDiscountAmt !== 0">
                      <i class="uom-14">-￥</i>
                      <span class="num">{{price.additionalDiscountAmt | formatCurrency}}</span>
                    </dd>
                    <dd v-else>
                      <i class="uom-14">￥</i>
                      <span class="num">0</span>
                    </dd>
                  </dl>
                  <dl>
                    <dt>商品割引クーポン</dt>
                    <dd v-if="price.productCouponDiscountAmt !== 0">
                      <i class="uom-14">-￥</i>
                      <span class="num">{{price.productCouponDiscountAmt | formatCurrency}}</span>
                    </dd>
                    <dd v-else>
                      <i class="uom-14">￥</i>
                      <span class="num">0</span>
                    </dd>
                  </dl>
                  <dl>
                    <dt>カートクーポン</dt>
                    <dd v-if="price.cartCouponDiscountAmt !== 0">
                      <i class="uom-14">-￥</i>
                      <span class="num">{{price.cartCouponDiscountAmt | formatCurrency}}</span>
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
                      <span class="num">{{price.salesTaxAmt | formatCurrency}}</span>
                    </dd>
                  </dl>
                </div>
              </div>
            </dt>
            <dd>
              <i class="uom-16">￥</i>{{price.standardAmt- price.immediateDiscountAmt - price.additionalDiscountAmt - price.productCouponDiscountAmt - price.cartCouponDiscountAmt | formatCurrency}}
            </dd>
          </dl>
        </th>
        <th class="ico_result ico_plus">
          <dl>
            <dt>
              送料
              <div class="tip">
                <div class="tip_popup size_1">
                  <dl class="opt_pb_4">
                    <dt>送料</dt>
                    <dd><i class="uom2">￥</i><span class="num">{{(price.deliveryAmt + price.remoteDeliveryAmt) | formatCurrency}}</span></dd>
                  </dl>
                  <dl class="opt_pb_4">
                    <dt class="warm-grey">└ 基本送料</dt>
                    <dd class="warm-grey">
                      <i class="uom2">￥</i><span class="num">{{price.deliveryAmt | formatCurrency}}</span>
                    </dd>
                  </dl>
                  <dl class="opt_pb_4">
                    <dt class="warm-grey">└ 地域別追加送料</dt>
                    <dd class="warm-grey"><i class="uom2">￥</i><span class="num">{{price.remoteDeliveryAmt | formatCurrency}}</span>
                    </dd>
                  </dl>
                </div>
              </div>
            </dt>
            <dd><i class="uom-16">￥</i>{{(price.deliveryAmt + price.remoteDeliveryAmt) | formatCurrency}}</dd>
          </dl>
        </th>
        <th>
          <dl class="payment">
            <dt>お支払金額</dt>
            <dd class="color-red"><i>￥</i><span class="num_nine">{{price.payAmt | formatCurrency}}</span></dd>
          </dl>
          <dl class="payment have-ico">
            <dt class="color_grey">決済方法</dt>
            <dd class="color_grey">{{order.payTypeLabel}}</dd>
          </dl>
        </th>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: ['price', 'order']
}
</script>
