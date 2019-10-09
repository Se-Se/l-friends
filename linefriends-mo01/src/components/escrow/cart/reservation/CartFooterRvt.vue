<template>
  <ul class="cart_footer">
    <div class="product_detail">
      <dl class="product_detail_list">
        <dt><span class="dark">小計(税込)</span> <span class="color_ab"></span></dt>
        <dd>
          <div class="bx_price">
            <p><span class="number dark f1_8"><span>￥</span>{{calculate.paymentAmt | formatCurrency}}</span></p>
          </div>
        </dd>
      </dl>
      <dl class="product_detail_list new-size_6">
        <dt>商品価格(税抜)</dt>
        <dd>
          <div class="bx_price">
            <p><span class="number new-size_7"><span class="new-font_bold">￥</span>{{(calculate.standardAmt - calculate.salesTaxAmt) | formatCurrency}}</span></p>
          </div>
        </dd>
      </dl>
      <dl class="product_detail_list new-size_6">
        <dt>割引</dt>
        <dd>
          <div class="bx_price">
            <p><span class="number new-size_7">-<span class="new-font_bold">￥</span>{{calculate.discountAmt | formatCurrency}}</span></p>
          </div>
        </dd>
      </dl>
      <dl class="product_detail_list new-size_6">
        <dt>消費税</dt>
        <dd>
          <div class="bx_price">
            <p><span class="number new-size_7"><span class="new-font_bold">￥</span>{{calculate.salesTaxAmt | formatCurrency}}</span></p>
          </div>
        </dd>
      </dl>
      <dl class="product_detail_list dark mar_top_2">
        <dt>送料</dt>
        <dd>
          <div class="bx_price">
            <p><span class="number f1_8"><span>￥</span>{{calculate.totalPrePaidDeliveryAmt | formatCurrency}}</span></p>
          </div>
        </dd>
      </dl>
      <dl class="product_detail_list dark total mar_top_2_4">
        <dt class="">お支払金額</dt>
        <dd>
          <div class="bx_price">
            <p><span class="number f2_8"><span>￥</span>{{calculate.totalAmt | formatCurrency}}</span></p>
          </div>
        </dd>
      </dl>
    </div>
    <ul class="product_active">
      <li><button class="btn" @click.prevent="toMain">買い物を続ける</button></li>
      <li><button class="btn btn_green" @click.prevent="buyChecked">購入する</button></li>
    </ul>
  </ul>
</template>

<script>
import { Alert } from '@/components/common/modal'
import { loginAndBack, setOrderInfoInStorage } from '@/utils/utils'

export default {
  props: ['calculate', 'checkedItems', 'delivery'],
  methods: {
    toMain () {
      this.$router.push('/m')
    },
    buyChecked () {
      if (loginAndBack(this.$router, this.$route)) {
        if (this.checkedItems.length) {
          let buyItems = []
          this.checkedItems.forEach(item => {
            this.delivery.items.forEach(show => {
              if (show.cartNo === item) {
                buyItems.push({
                  cartNo: show.cartNo,
                  productNo: show.productNo,
                  optionNo: show.optionNo,
                  orderCnt: show.orderCnt
                })
              }
            })
          })
          setOrderInfoInStorage(buyItems, this.$route.fullPath)
          this.$store.dispatch('ordersheet/getSheetNo')
        } else {
          Alert('選択した商品がありません。')
        }
      }
    }
  }
}
</script>
