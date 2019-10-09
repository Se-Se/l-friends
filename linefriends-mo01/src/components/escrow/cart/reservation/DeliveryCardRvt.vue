<template>
  <div class="cart_con">
    <div class="wrap_category">
      <h2>カート(予約商品)</h2>
    </div>
    <div class="cart_header">
      <div class="bx_list_checkbox cf">
        <span class="bx_input" @click.prevent="clickCheckAll">
          <input id="check_box_all" type="checkbox" :checked="checkAll">
          <label for="check_box_all">すべて</label>
        </span>
        <ul class="list_tools">
          <li v-if="invalidNos && invalidNos.length">
            <button class="btn btn_radius size_s" @click.prevent="delInvalid">品切れ商品を削除</button>
          </li>
          <li>
            <button class="btn btn_radius size_s" @click.prevent="delChecked">選択した商品を削除</button>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart_main">
      <cart-item-rvt v-for="(item, idx) in delivery.items" :key="idx+'_'+item.cartNo" :option="item" :checkedItems="checkedItems" @checkItem="checkItem" @updateChecked="updateChecked" @deleteCartChk="deleteCartChk" />
    </div>
    <div class="temp_total" v-if="delivery.deliveryCondition">
      <p class="temp_total_prize">￥<span class="total_num">{{delivery.buyAmt | formatCurrency}}</span> +
        ￥<span class="total_num">{{delivery.deliveryCondition.deliveryAmt | formatCurrency}}</span> (送料) =
        ￥<span class="total_num">{{(delivery.buyAmt + delivery.deliveryCondition.deliveryAmt) | formatCurrency}}</span></p>
      <p class="temp_total_txt">送料は東京基準となっており、 <br>
        配送地域によって異なります。</p>
    </div>
    <cart-footer-rvt :calculate="calculate" :checkedItems="checkedItems" :delivery="delivery" />
  </div>
</template>

<script>
import CartItemRvt from './CartItemRvt'
import CartFooterRvt from './CartFooterRvt'
import { Confirm, Alert } from '@/components/common/modal'
import { isLogin } from '@/utils/utils'
import { mapMutations } from 'vuex'
export default {
  props: ['delivery', 'checkedItems', 'idx'],
  components: {
    CartItemRvt,
    CartFooterRvt
  },
  data () {
    return {
      calculate: {
        accumulationAmtWhenBuyConfirm: 0,
        buyAmt: 0,
        discountAmt: 0,
        paymentAmt: 0,
        salesTaxAmt: 0,
        standardAmt: 0,
        totalAmt: 0,
        totalDeliveryAmt: 0,
        totalPayOnDeliveryAmt: 0,
        totalPrePaidDeliveryAmt: 0
      }
    }
  },
  computed: {
    checkAll () {
      if (!this.checkedItems) return false
      let tempItems = []
      this.delivery.items.forEach(item => {
        if (!item.isInvalid) {
          tempItems.push(item)
        }
      })
      return tempItems.length === this.checkedItems.length && tempItems.length > 0
    },
    invalidNos () {
      let noList = []
      this.delivery.items.forEach(item => {
        if (item.isInvalid) {
          noList.push(item.cartNo)
        }
      })
      return noList
    }
  },
  methods: {
    ...mapMutations('cart', ['CHECK_ALL_RVT', 'CHECK_OPTION_RVT', 'DELETE_CHECKED_RVT']),
    clickCheckAll () {
      this.checkItem({ type: 'checkAll', checked: !this.checkAll })
    },
    checkItem ({ type, checked, cartNo }) {
      if (type === 'checkAll') {
        this.CHECK_ALL_RVT({ index: this.idx, checked: checked })
      } else if (type === 'checkOption') {
        this.CHECK_OPTION_RVT({ index: this.idx, checked: checked, cartNo: cartNo })
      }
      this.$nextTick(() => {
        this.getCalculater()
      })
    },
    getCalculater () {
      if (this.checkedItems.length > 0) {
        if (isLogin()) {
          this.$store.dispatch('cart/getCalculateRvt', { cartNos: this.checkedItems }).then((res) => {
            this.calculate = res.data
          })
        } else {
          let guestItem = []
          this.checkedItems.forEach(item => {
            this.delivery.items.forEach(show => {
              if (show.cartNo === item) {
                guestItem.push({
                  cartNo: show.cartNo,
                  productNo: show.productNo,
                  optionNo: show.optionNo,
                  orderCnt: show.orderCnt
                })
              }
            })
          })
          this.$store.dispatch('cart/_calcGuestCartRvt', { data: guestItem }).then((res) => {
            this.calculate = res.data.price
          })
        }
      } else {
        this.calculate = {
          accumulationAmtWhenBuyConfirm: 0,
          buyAmt: 0,
          discountAmt: 0,
          paymentAmt: 0,
          salesTaxAmt: 0,
          standardAmt: 0,
          totalAmt: 0,
          totalDeliveryAmt: 0,
          totalPayOnDeliveryAmt: 0,
          totalPrePaidDeliveryAmt: 0
        }
      }
    },
    delChecked () {
      if (this.checkedItems.length) {
        Confirm('選択した商品を削除しますか？').then(res => {
          if (res) {
            let cartNos = this.checkedItems.map(item => item)
            this.$store.dispatch('cart/deleteCartByCartNosRvt', { cartNos }).then(res => {
              this.deleteCartChk(cartNos)
            })
          }
        })
      } else {
        Alert('選択した商品がありません。')
      }
    },
    deleteCartChk (cartNos) {
      this.DELETE_CHECKED_RVT({ index: this.idx, cartNos: cartNos })
      this.$nextTick(() => {
        this.getCalculater()
      })
    },
    updateChecked (updateCart) {
      this.getCalculater()
    }
  },
  watch: {
    checkedItems () {
      this.$nextTick(() => {
        this.getCalculater()
      })
    }
  }
}
</script>
