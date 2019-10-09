<template>
  <form>
    <fieldset>
      <legend class="blind">カート</legend>
      <div class="table_wrap">
        <table class="table_data item table_cart_area">
          <caption class="blind">カート</caption>
          <colgroup>
            <col style="width:82px">
            <col style="">
            <col style="width:150px">
            <col style="width:176px">
            <col style="width:140px">
            <col style="width:140px">
          </colgroup>
          <thead>
            <tr>
              <th scope="col">
                <span class="bx_input check2" @click.prevent="clickCheckAll">
                  <input id="check_box_all" type="checkbox" :checked="checkAll">
                  <label for="check_box_all"><span></span></label>
                </span>
              </th>
              <th scope="col">商品情報</th>
              <th scope="col">数量</th>
              <th scope="col">小計(税込)</th>
              <th scope="col">送料</th>
              <th scope="col">注文</th>
            </tr>
          </thead>
          <tbody v-if="showItems && showItems.length">
            <cart-item-rvt v-for="(item, idx) in showItems" :key="idx" :option="item" :checkedItems="checkedItems" @checkItem="checkItem" @updateChecked="updateChecked" @deleteCartChk="deleteCartChk" />
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="6">
                <div class="data_none">
                  <span class="ico"></span>
                  <p class="txt">カートには商品が入っていません。</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="bx_purchase_noti" v-if="showItems && showItems.length">
        <ul>
          <li>
            <button type="button" class="btn btn_primary size_m" @click.prevent="delChecked">選択した商品を削除</button>
          </li>
          <li v-if="invalidNos && invalidNos.length">
            <button type="button" class="btn btn_primary size_m" @click.prevent="delInvalid">品切れ商品を削除</button>
          </li>
        </ul>
      </div>
    </fieldset>
    <cart-footer-rvt :calculate="calculate" :showItems="showItems" :checkedItems="checkedItems" />
  </form>
</template>

<script>
import { Confirm, Alert } from '@/components/common/modal'
import CartItemRvt from './CartItemRvt'
import CartFooterRvt from './CartFooterRvt'
import { isLogin } from '@/utils/utils'
import { mapMutations } from 'vuex'
export default {
  props: ['showItems', 'checkedItems', 'idx'],
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
      let tempItems = this.showItems.filter(item => !item.isInvalid)
      return tempItems.length === this.checkedItems.length && tempItems.length > 0
    },
    invalidNos () {
      return this.showItems.filter(item => item.isInvalid).map(item => item.cartNo)
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
            this.showItems.filter(show => {
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
    delInvalid () {
      Confirm('購入不可商品を一括削除しますか？').then(res => {
        if (res) {
          this.$store.dispatch('cart/deleteCartByCartNos', { cartNos: this.invalidNos })
        }
      })
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
        Alert('選択した商品がありません。 ')
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
  components: {
    CartItemRvt,
    CartFooterRvt
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
