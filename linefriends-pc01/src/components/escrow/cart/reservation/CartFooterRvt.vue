<template>
  <div>
    <div class="bill">
      <div class="bill_con">
        <div class="column_4 plus">
          <table class="table_bill">
            <tbody>
              <tr>
                <th>
                  <span class="ttl">小計(税込)</span>
                  <div class="tip">
                    <div class="tip_popup tip_popup_position size_6">
                      <dl>
                        <dt class="tippop_width">商品価格(税抜)</dt>
                        <dd><i class="uom2">￥</i><span class="num">{{(calculate.standardAmt - calculate.salesTaxAmt) | formatCurrency}}</span></dd>
                      </dl>
                      <dl>
                        <dt class="tippop_width">割引</dt>
                        <dd><i class="uom2">-￥</i><span class="num">{{calculate.discountAmt | formatCurrency}}</span></dd>
                      </dl>
                      <dl>
                        <dt class="tippop_width">消費税</dt>
                        <dd><i class="uom2">￥</i><span class="num">{{calculate.salesTaxAmt | formatCurrency}}</span></dd>
                      </dl>
                    </div>
                  </div>
                </th>
              </tr>
              <tr>
                <td>
                  <strong class="amount"><i class="uom2">￥</i> {{calculate.paymentAmt | formatCurrency}}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="column_4 equal">
          <table class="table_bill">
            <tbody>
              <tr>
                <th>
                  <span class="ttl">送料</span>
                </th>
              </tr>
              <tr>
                <td>
                  <strong class="amount"><i class="uom2">￥</i>{{calculate.totalPrePaidDeliveryAmt | formatCurrency}}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="column_4">
          <table class="table_bill">
            <tbody>
              <tr>
                <th>
                  <span class="ttl">お支払金額</span>
                </th>
              </tr>
              <tr>
                <td>
                  <strong class="amount total"><i class="uom2">￥</i> {{calculate.totalAmt | formatCurrency}}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="btn_order">
      <button type="button" class="btn" @click.prevent="toMain">買い物を続ける</button>
      <button type="button" class="btn btn_green" @click.prevent="buyChecked">注文を確定する</button>
    </div>
  </div>
</template>

<script>
import { Alert } from '@/components/common/modal'
import { loginAndBack, setOrderInfoInStorage } from '@/utils/utils'

export default {
  props: ['calculate', 'checkedItems', 'showItems'],
  methods: {
    toMain () {
      this.$router.push('/')
    },
    buyChecked () {
      if (loginAndBack(this.$router, this.$route)) {
        if (this.checkedItems.length) {
          let buyItems = []
          this.checkedItems.forEach(item => {
            this.showItems.filter(show => {
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
          Alert('選択した商品がありません。 ')
        }
      }
    }
  }
}
</script>
