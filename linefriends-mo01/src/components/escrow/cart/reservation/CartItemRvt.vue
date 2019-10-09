<template>
  <div :class="['product_item', {'none' : option.isInvalid}]">
    <p class="out_of_stock" v-if="option.isInvalid">品切れ</p>
    <div class="product_item_checkbox">
      <span class="bx_input" @click.prevent="clickOption">
        <input :id="`chk_${option.cartNo}`" type="checkbox" disabled v-if="option.isInvalid">
        <input :id="`chk_${option.cartNo}`" type="checkbox" :checked="checked" v-else>
        <label :for="`chk_${option.cartNo}`"></label>
      </span>
    </div>
    <div class="product_item_cont">
      <router-link :to="'/m/product/detail/' + option.productNo" class="thumbnail_inner size_m">
        <div class="thumbnail">
          <img :src="option.imageUrl" alt="">
        </div>
      </router-link>
      <div class="product_info">
        <ul class="product_info_status" v-if="option.reservation">
          <li class="product_info_status_item">
            <span class="badge badge_reserved">予約商品</span>
          </li>
          <li class="product_info_status_item">
            <span class="product_delivery_date">{{option.reservationDeliveryYmdt | dateFormatStr('yyyy-MM-dd')}}日から順次発送</span>
          </li>
        </ul>
        <router-link :to="'/m/product/detail/' + option.productNo" class="product_title">{{option.productName}}</router-link>
        <p class="product_options" v-if="option.optionTitle">{{option.optionTitle}}</p>
        <div class="product_detail size_s">
          <dl class="product_detail_list new-style_size">
            <dt>
              <span class="new-color_999 new-under_line number" v-if="option.price.standardAmt !== option.price.buyAmt">
                <span>￥</span>{{option.price.standardAmt | formatCurrency}}
              </span>
              <span class="number dark">
                <span>￥</span>{{option.price.buyAmt | formatCurrency}}
              </span>
              <span class="dark cart-text_number">
                (税込)
              </span>
            </dt>
          </dl>
        </div>
        <div class="product_count">
          <span class="bx_count">
            <button type="button" class="btn_plus" @click.prevent="minusCnt">-</button>
            <input type="text" title="購入数量" class="count_input" :value="showCnt" @keyup="checkNum" @change="changeCnt">
            <button type="button" class="btn_minus" v-not-double-click @click.prevent="plusCnt">+</button>
          </span>
        </div>
        <ul :class="['product_active', {'cf' : option.isInvalid}]">
          <li v-if="!option.isInvalid">
            <button class="btn size_m btn_green meta_se1" @click.prevent="buyItem">
              <span class="ico_cart_w"></span>
              購入する
            </button>
          </li>
          <li>
            <button class="btn size_m btn_primary" @click.prevent="deleteItem">削除</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { Confirm } from '@/components/common/modal'
import { loginAndBack, setOrderInfoInStorage } from '@/utils/utils'
import _ from 'lodash'
export default {
  props: ['option', 'checkedItems'],
  data () {
    return {
      tempCnt: 0
    }
  },
  computed: {
    checked () {
      let checked = false
      if (this.checkedItems) {
        this.checkedItems.forEach(item => {
          if (Number(this.option.cartNo) === Number(item)) {
            checked = true
          }
        })
      }
      return checked
    },
    showCnt () {
      return this.tempCnt || this.option.orderCnt
    }
  },
  methods: {
    clickOption () {
      if (!this.option.isInvalid) {
        this.$emit('checkItem', { type: 'checkOption', checked: !this.checked, cartNo: this.option.cartNo })
        // this.$store.dispatch('cart/checkItem', { type: 'checkOption', checked: !this.checked, cartNo: this.option.cartNo })
      }
    },
    checkNum (ev) {
      let cnt = Number(ev.target.value.replace(/[^0-9]+/, ''))
      cnt = cnt > 9999 ? 9999 : (cnt < 1 ? 1 : cnt)
      ev.target.value = cnt
    },
    minusCnt () {
      let orderCnt = Number(this.showCnt)
      if (orderCnt > 1) {
        orderCnt = orderCnt - 1
      }
      this.tempCnt = orderCnt
      this.updateCnt(orderCnt)
    },
    changeCnt (ev) {
      let cnt = Number(ev.target.value.replace(/[^0-9]+/, ''))
      cnt = cnt > 9999 ? 9999 : (cnt < 1 ? 1 : cnt)
      ev.target.value = cnt
      this.tempCnt = cnt
      this.updateCnt(cnt)
    },
    plusCnt () {
      let orderCnt = Number(this.showCnt)
      if (orderCnt < 9999) {
        orderCnt = orderCnt + 1
      }
      this.tempCnt = orderCnt
      this.updateCnt(orderCnt)
    },
    updateCnt (orderCnt) {
      let cartInfos = [{
        cartNo: this.option.cartNo,
        orderCnt,
        productNo: this.option.productNo,
        optionNo: this.option.optionNo
      }]
      this.changeCount(this, cartInfos)
    },
    changeCount: _.debounce((that, cartInfos) => {
      that.$store.dispatch('cart/updateCntRvt', { 'cartInfos': cartInfos }).then(() => {
        that.tempCnt = 0
        that.$emit('updateChecked', cartInfos)
      })
    }, 500),
    deleteItem () {
      Confirm('この商品を削除しますか？').then(res => {
        if (res) {
          let deleteCartNo = this.option.cartNo
          this.$store.dispatch('cart/deleteCartByCartNosRvt', { cartNos: [deleteCartNo] })
          setTimeout(() => {
            this.$emit('deleteCartChk', [deleteCartNo])
          }, 200)
        }
      })
    },
    buyItem () {
      if (loginAndBack(this.$router, this.$route)) {
        let buyItems = [{
          cartNo: this.option.cartNo,
          productNo: this.option.productNo,
          optionNo: this.option.optionNo,
          orderCnt: this.option.orderCnt
        }]
        setOrderInfoInStorage(buyItems, this.$route.fullPath)
        this.$store.dispatch('ordersheet/getSheetNo')
      }
    }
  }
}
</script>
