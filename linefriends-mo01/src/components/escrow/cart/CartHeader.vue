<template>
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
</template>

<script>
import { Confirm, Alert } from '@/components/common/modal'

export default {
  props: ['showItems', 'checkedItems'],
  computed: {
    checkAll () {
      let tempItems = []
      this.showItems.forEach(delivery => {
        if (!delivery.isInvalid) {
          delivery.items.forEach(item => {
            tempItems.push(item)
          })
        }
      })
      return tempItems.length === this.checkedItems.length && tempItems.length > 0
    },
    invalidNos () {
      let noList = []
      this.showItems.forEach(delivery => {
        if (delivery.isInvalid) {
          delivery.items.forEach(item => {
            noList.push(item.cartNo)
          })
        }
      })
      return noList
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
        Alert('選択した商品がありません。')
      }
    }
  }
}
</script>
