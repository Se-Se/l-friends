<template>
  <tr :class="option.isInvalid ? 'item_none' : ''">
    <td>
      <div class="none" v-if="option.isInvalid">品切れ</div>
      <span class="bx_input check2" @click.prevent="clickOption">
        <input :id="`chk_${option.cartNo}`" type="checkbox" :checked="checked">
        <label :id="`chk_${option.cartNo}`"><span></span></label>
      </span>
    </td>
    <td>
      <router-link :to="`/product/detail/${option.productNo}`" class="item_info" target="_blank">
        <span class="bx_thumb">
          <img :src="option.imageUrl" alt="">
        </span>
        <div class="bx_info">
          <dl class="badge_area" v-if="option.reservation">
            <dt><span class="badge badge_reserved">予約商品</span></dt>
            <dd>{{option.reservationDeliveryYmdt | dateFormatStr('yyyy-MM-dd')}}日から順次発送</dd>
          </dl>
          <span class="name">{{option.productName}}</span>
          <span class="option opt_pd_0">{{option.optionTitle}}</span>
        </div>
      </router-link>
    </td>
    <td>
      <span class="bx_count">
        <button type="button" class="btn_plus" @click.prevent="minusCnt">-</button>
        <input type="text" title="購入数量" class="count_input" :value="showCnt" @keyup="checkNum" @input="changeCnt">
        <button type="button" class="btn_minus" v-not-double-click @click.prevent="plusCnt">+</button>
      </span>
    </td>
    <td v-if="option.isInvalid">
      <span class="num">-</span>
    </td>
    <td v-else>
      <template v-if="option.price.standardAmt !== option.price.buyAmt">
        <span class="num tax_txt have_cut_price">
          <i class="uom2">￥</i>{{option.price.standardAmt | formatCurrency}}
        </span>
        <span class="num after_cut_price">
          <i class="uom2">￥</i>{{option.price.buyAmt | formatCurrency}}
        </span>
      </template>
      <span class="num" v-else>
        <i class="uom2">￥</i>{{option.price.buyAmt | formatCurrency}}
      </span>
    </td>
    <td class="rowspan" :rowspan="option.rowsCnt" v-if="option.rowFirst && option.isInvalid">
      <span class="num">-</span>
    </td>
    <td class="rowspan" :rowspan="option.rowsCnt" v-else-if="option.rowFirst">
      <span class="num" v-if="option.deliveryCondition.deliveryAmt === 0">無料</span>
      <span class="num" v-else>
        <i class="uom2">￥</i>{{option.deliveryCondition.deliveryAmt | formatCurrency}}
        <template v-if="option.deliveryPayType === 'PAY_ON_DELIVERY'">(着払い)</template>
      </span>
      <div class="tip">
        <div class="tip_popup size_2">
          <i class="tip_notes_ico"></i>
          <p class="tip_notes">送料は東京基準となっており、<br>配送地域によって異なります。</p>
        </div>
      </div>
    </td>
    <td>
      <button type="button" class="btn size_s btn_pd_0" @click.prevent="buyItem" v-if="!option.isInvalid">今すぐ購入する</button>
      <button type="button" class="btn btn_primary size_s" @click.prevent="deleteItem">削除</button>
    </td>
  </tr>
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
          if (Number(this.option.cartNo) === Number(item.cartNo)) {
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
        this.$store.dispatch('cart/checkItem', { type: 'checkOption', checked: !this.checked, cartNo: this.option.cartNo })
      }
    },
    checkNum (ev) {
      let cnt = Number(ev.target.value.replace(/[^0-9]+/, ''))
      if (ev.target.value !== '') {
        cnt = cnt > 9999 ? 9999 : (cnt < 1 ? 1 : cnt)
        ev.target.value = cnt
      }
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
      that.$store.dispatch('cart/updateCnt', { 'cartInfos': cartInfos }).then(() => {
        that.tempCnt = 0
      })
    }, 500),
    deleteItem () {
      Confirm('この商品を削除しますか？').then(res => {
        if (res) {
          this.$store.dispatch('cart/deleteCartByCartNos', { cartNos: [this.option.cartNo] })
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
