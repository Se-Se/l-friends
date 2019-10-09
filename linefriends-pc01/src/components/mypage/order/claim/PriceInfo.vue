<template>
  <div class="order_detail_table">
    <h1>返金予定の詳細</h1>
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
              小計 (税込)
              <div class="tip" v-if="type === 'return'">
                <div class="tip_popup size_1">
                  <dl>
                    <dt>商品価格(税抜)</dt>
                    <dd><i class="uom-14">￥</i><span class="num">{{price.standardPrice | formatCurrency}}</span></dd>
                  </dl>
                  <dl>
                    <dt>割引</dt>
                    <dd><i class="uom-14">-￥</i><span class="num">{{price.immediateDiscountAmt | formatCurrency}}</span></dd>
                  </dl>
                  <dl>
                    <dt>特別割引</dt>
                    <dd><i class="uom-14">-￥</i><span class="num">{{price.additionalDiscountAmt | formatCurrency}}</span></dd>
                  </dl>
                  <dl>
                    <dt>商品割引クーポン</dt>
                    <dd><i class="uom-14">-￥</i><span class="num">{{price.productCouponDiscountAmt | formatCurrency}}</span></dd>
                  </dl>
                  <dl>
                    <dt>カートクーポン</dt>
                    <dd><i class="uom-14">-￥</i><span class="num">{{price.cartCouponAmt | formatCurrency}}</span></dd>
                  </dl>
                  <dl>
                    <dt>消費税</dt>
                    <dd><i class="uom-14">￥</i><span class="num">{{price.refundSalesTaxAmt | formatCurrency}}</span></dd>
                  </dl>
                </div>
              </div>
            </dt>
            <dd>
              <i class="uom-16">￥</i>{{price.totalProductAmt | formatCurrency}}
            </dd>
          </dl>
        </th>
        <th class="ico_result ico_plus">
          <dl>
            <dt>送料
              <!-- <div class="tip">
                <div class="tip_popup size_1">
                  <dl class="opt_pb_4">
                    <dt>送料</dt>
                    <dd><i class="uom2">￥</i><span class="num">{{price.totalDeliveryAmt | formatCurrency}}</span></dd>
                  </dl>
                  <dl class="opt_pb_4">
                    <dt class="warm-grey">ㄴ 基本送料</dt>
                    <dd class="warm-grey">
                      <i class="uom2">-￥</i><span class="num">{{price.totalDeliveryAmt -  price.refundRemoteDeliveryAmt | formatCurrency}}</span>
                    </dd>
                  </dl>
                  <dl class="opt_pb_4">
                    <dt class="warm-grey">ㄴ 地域別追加送料</dt>
                    <dd class="warm-grey"><i class="uom2">-￥</i><span class="num">{{price.refundRemoteDeliveryAmt | formatCurrency}}</span>
                    </dd>
                  </dl>
                </div>
              </div> -->
            </dt>
            <dd><i class="uom-16">￥</i>{{price.totalDeliveryAmt | formatCurrency}}</dd>
          </dl>
        </th>
        <th>
          <dl class="payment">
            <dt>返金額</dt>
            <dd class="color-red"><i>￥</i><span class="num_nine">{{price.refundPayAmt | formatCurrency}}</span></dd>
          </dl>
          <dl class="payment have-ico">
            <dt class="color_grey" v-if="price.refundTypeLabel">{{price.refundTypeLabel}}<br>決済取消</dt>
            <dt class="color_grey" v-else>決済取消</dt>
            <dd class="color_grey price"><i>￥</i><span class="num">{{price.refundPayAmt | formatCurrency}}</span></dd>
          </dl>
        </th>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: ['price', 'type']
}
</script>
