<template>
  <tr :class="{ invalid: option.isInValid }">
    <td>
      <span class="bx_input check2">  
        <!-- 구매 불가 상품에 대해서 disabled -->
        <input type="checkbox" :id="option.idx" v-model="checkGo" @change="checkedOption" v-if="!option.isInValid">
        <label :for="option.idx">
          <span></span>
        </label>
      </span>
    </td>
    <td>
      <template v-if="!option.isInValid">
        <router-link :to="`/goods/detail/${option.productNo}`" class="item_info">
          <span class="bx_thumb">
            <img :src="option.imageUrl ? option.imageUrl : 'http://image.toast.com/aaaadk/buywowdev/TEST_IMAGE(13).png?720x720'" width="80" height="80" :alt="$t('layout.cart.goodsThumnail')">
          </span>
          <div class="bx_info">
            <template v-if="option.reservation">
              <span class="goods-detail__info__status-item">
                <p class="reserve">예약상품</p>
              </span>
              <span class="goods-detail__info__status-item">
                <p class="datedelivery">{{option.reservationDeliveryYmdt | dateFormatStr('yyyy-MM-dd')}}일 부터 순차 배송</p>
              </span>
            </template>
            <span class="name">{{(option.showProductName) | wordsFormat(56)}}</span>
            <span v-if="product.optionUsed" class="option">
              <p style="font-size:0;">{{ option }}</p>
              <template v-for="showOption, index in option.showOptions">
                <span class="bar" v-if="index != 0">/</span> {{showOption}}
              </template>
              <template v-if="option.showAddPrice">
                {{option.showAddPrice}}
              </template>
            </span>
            <span class="no_refundable" v-if="!product.refundable">{{ $t('layout.cart.noRefunds') }}</span>
          </div>
        </router-link>
      </template>
      <template v-else>
        <a class="item_info">
          <span class="bx_thumb">
            <img :src="option.imageUrl ? option.imageUrl : 'http://image.toast.com/aaaadk/buywowdev/TEST_IMAGE(13).png?720x720'" width="80" height="80" :alt="$t('layout.cart.goodsThumnail')">
          </span>
          <div class="bx_info">
            <span class="name">{{(option.showProductName) | wordsFormat(56)}}</span>
            <span v-if="product.optionUsed" class="option">
              <template v-for="showOption, index in option.showOptions">
                <span class="bar" v-if="index != 0">/</span> {{showOption}}
              </template>
              <template v-if="option.showAddPrice">
                {{option.showAddPrice}}
              </template>
            </span>
            <span class="no_refundable" v-if="!product.refundable">{{ $t('layout.cart.noRefunds') }}</span>
          </div>
        </a>
      </template>
    </td>
    <td>
      <template v-if="option.isInValid">
        <span class="only num">{{option.orderCnt}}</span>
      </template>
      <template v-else>
        <div class="counting">
          <button class="btn btn_reduce" @click.prevent="cntSet('minus')">-</button>
          <input type="text" v-model="option.orderCnt" @change.prevent="cntSet" @keypress="quantityEnter">
          <button class="btn btn_plus" @click.prevent="cntSet('plus')">+</button>
        </div>
      </template>
    </td>
    <td>
      <template v-if="option.isInValid">
        -
      </template>
      <template v-else>
        <span class="num">
          {{option.showPrice}}
          <span>원</span>
        </span>
        <div class="tip">
          <div class="tip_popup size_1">
            <dl>
              <dt>{{ $t('layout.cart.goodsPrice') }}</dt>
              <dd><span class="num">{{option.showStandardAmt}}</span>{{ $t('currency') }}</dd>
            </dl>
            <dl>
              <dt>{{ $t('layout.cart.discountPrice') }}</dt>
              <dd><span class="num">{{option.showDiscountAmt == 0 ? option.showDiscountAmt : '- ' + option.showDiscountAmt}}</span>{{ $t('currency') }}</dd>
            </dl>
            <div class="total_pop">
              <dl>
                <dt>{{ $t('layout.cart.discountApplyPrice') }}</dt>
                <dd><span class="num">{{option.showPrice}}</span>{{ $t('currency') }}</dd>
              </dl>
            </div>
          </div>
          <!-- // [D] 할인적용금액 안내글 팝업 -->
        </div>
      </template>
    </td>
    <template v-if="option.bundledFlg">
      <cart-delivery-fee v-if="option.bundledFirst" :rowspan="option.bundledSize" :option="option" class="merge"/>
    </template>
    <template v-else>
      <cart-delivery-fee :option="option" />
    </template>
    <td class="buttons">
      <button type="button" class="tbl_btn btn_col-gray" @click="buy" v-if="!option.isInValid">{{ $t('layout.cart.buyNow') }}</button>
      <button type="button" class="tbl_btn" @click="delOption">{{ $t('layout.cart.del') }}</button>
    </td>
  </tr>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import CartDeliveryFee from '@/components/pc/layout/cart/CartDeliveryFee'
import { setOrderInfoInStorage, orderProductOptionShowPriceLoad } from '@/utils/orderUtils'
import _ from 'lodash'
import { Alert, Confirm } from '@/utils/event-bus'
import $ from 'jquery'
export default {
  props: ['option', 'product'],
  data () {
    return {
      checked: false
    }
  },
  components: {
    CartDeliveryFee
  },
  methods: {
    clickCheck () {
      Alert({
        title: this.$t('layout.cart.title'),
        message: this.$t('layout.cart.noBuySelector')
      })
      // alert('구매불가상품은 선택할 수 없습니다.')
    },
    buy () {
      // $('html').css('overflow', 'hidden')
      // TODO 추가상품번호 확인 필요.
      const products = [{
        productNo: this.option.productNo,
        optionNo: this.option.optionNo,
        orderCnt: this.option.orderCnt,
        additionalProductNo: 0,
        optionInputs: this.option.optionInputs,
        cartNo: this.option.cartNo
      }]
      setOrderInfoInStorage(products, this.$route.fullPath)
      this.$store.dispatch('ordersheet/getSheetNo', {})
    },
    delOption () {
      // $('html').css('overflow', 'hidden')
      Confirm({
        message: this.$t('layout.cart.goodsDelConfirm'),
        callback: () => {
          const options = []
          options.push(this.option)
          this.$store.dispatch('cart/deleteCartByOptions', options)
        }
      })
    },
    changeCount: _.debounce((that, type) => {
      const carts = [JSON.parse(JSON.stringify(that.option))]
      that.$store.dispatch('cart/putCarts', carts)
    }, 500),
    async cntSet (type) {
      if (type === 'plus') {
        this.option.orderCnt += 1
      } else if (type === 'minus') {
        this.option.orderCnt -= 1
      }
      this.option.orderCnt = Number(this.option.orderCnt.toString().replace(/\D/g, '')) || 1
      if (this.option.orderCnt < 1) {
        this.option.orderCnt = 1
      }
      if (this.option.orderCnt > 9999) {
        this.option.orderCnt = 9999
      }
      if (this.checkGo) {
        this.checkOptions.forEach((item) => {
          if (item.cartNo === this.option.cartNo) {
            item.orderCnt = this.option.orderCnt
          }
        })
        /* 총 가격 계산 */
        this.REFRESH_SHOW_AMT()
      }
      await this.refreshOption()
      this.changeCount(this, type)
    },
    checkedOption () {
      const checkOption = {
        checked: this.checked,
        cartNo: this.option.cartNo,
        productNo: this.option.productNo,
        optionNo: this.option.optionNo,
        orderCnt: this.option.orderCnt,
        optionInputs: this.option.optionInputs,
        payOnDelivery: this.option.deliveryPayType === 'PAY_ON_DELIVERY'
      }
      this.$store.commit('cart/CHECK_OPTION', checkOption)
      this.$store.dispatch('cart/calculate')
    },
    quantityEnter (e) {
      if (e.key === '+' || e.key === '-' || e.key === '.' || e.key === 'e' || e.key === 'Enter') {
        e.preventDefault()
      }
    },
    refreshOption () {
      this.option = orderProductOptionShowPriceLoad(this.option)
    },
    ...mapMutations('cart', ['REFRESH_SHOW_AMT'])
  },
  computed: {
    checkGo: {
      // getter
      get () {
        return this.checkOptions.some(item => {
          if (item.cartNo === this.option.cartNo && !this.option.isInValid) {
            return true
          }
          return false
        })
      },
      // setter
      set (newValue) {
        this.checked = newValue
      }
    },
    ...mapState('cart', ['checkOptions'])
  }
}
</script>

<style lang="scss" scoped>
.invalid > td:not(.buttons) {
  opacity: 0.1;
}

</style>
