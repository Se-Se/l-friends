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
          <tbody>
            <cart-item v-for="(item, idx) in showItems" :key="idx" :option="item" :checkedItems="checkedItems" />
          </tbody>
        </table>
      </div>
      <div class="bx_purchase_noti">
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
  </form>
</template>

<script>
import { Confirm, Alert } from '@/components/common/modal'
import CartItem from '@/components/escrow/cart/CartItem'

export default {
  props: ['showItems', 'checkedItems'],
  computed: {
    checkAll () {
      let tempItems = this.showItems.filter(item => !item.isInvalid)
      return tempItems.length === this.checkedItems.length && tempItems.length > 0
    },
    invalidNos () {
      return this.showItems.filter(item => item.isInvalid).map(item => item.cartNo)
    }
  },
  methods: {
    clickCheckAll () {
      this.$store.dispatch('cart/checkItem', { type: 'checkAll', checked: !this.checkAll })
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
            let cartNos = this.checkedItems.map(item => item.cartNo)
            this.$store.dispatch('cart/deleteCartByCartNos', { cartNos })
          }
        })
      } else {
        Alert('選択した商品がありません。 ')
      }
    }
  },
  components: {
    CartItem
  }
}
</script>
