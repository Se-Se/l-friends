<template>
  <div class="menuItems order_new_margin_bottom">
    <div class="pay_info">
      <div class="product_detail order_settle_detail">
        <dl class="product_detail_list">
          <dt><span class="c-333">小計(税込)</span> <span class="tax"></span></dt>
          <dd>
            <div>
              <p class="bold c-333">￥<span class="common-V V-9">{{price.totalProductAmt | formatCurrency}}</span>
              </p>
            </div>
          </dd>
        </dl>
        <dl class="product_detail_list mt-20">
          <dt class="c-333">送料</dt>
          <dd>
            <div>
              <p class="bold c-333">￥<span class="common-V V-9">{{price.totalDeliveryAmt | formatCurrency}}</span></p>
            </div>
          </dd>
        </dl>
        <!-- <dl class="product_detail_list f-6-area mt-2">
          <dt>- 基本送料</dt>
          <dd>
            <div>
              <p class="bold">-￥<span class="common-V V-7">{{price.totalDeliveryAmt -  price.refundRemoteDeliveryAmt| formatCurrency}}</span></p>
            </div>
          </dd>
        </dl>
        <dl class="product_detail_list f-6-area mt-2">
          <dt>- 地域別追加送料</dt>
          <dd>
            <div>
              <p class="bold">-￥<span class="common-V V-7">{{price.refundRemoteDeliveryAmt | formatCurrency}}</span></p>
            </div>
          </dd>
        </dl> -->
        <dl class="product_detail_list mt-12">
          <dt class="c-333">返金額 </dt>
          <dd>
            <div>
              <p class="bold f-13">￥<span class="common-V V-14">{{price.refundPayAmt | formatCurrency}}</span></p>
            </div>
          </dd>
        </dl>
        <dl class="product_detail_list mt-5" v-if="price.refundTypeLabel">
          <dt>{{price.refundTypeLabel}}決済取消</dt>
          <dd>
            <div>
              <p class="bold">￥<span class="common-V V-9">{{price.refundPayAmt | formatCurrency}}</span></p>
            </div>
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['price', 'type']
}
</script>
