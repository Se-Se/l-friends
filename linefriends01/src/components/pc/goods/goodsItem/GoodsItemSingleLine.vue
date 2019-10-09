<template>
  <a @click="goGoodsDetail(item.productNo)">
    <article class="goods-item__singleline" @mouseover="cartView()" @mouseleave="cartUnView()">
      <i v-if="item.mainBestProductYn" class="goods-item__status _best">
        BEST
      </i>
      <i v-if="isNew(item.saleStartYmdt) && !item.mainBestProductYn" class="goods-item__status _new">
        NEW
      </i>
      <figure v-if="mode === 'list'" :class="{
          'goods-item__fig': true,
          '_list' : mode === 'list',
          '_recommand': mode === 'recommand',
          'soldout': isSoldOut
        }" data-aos="fade-zoom-in">
        <img :src="item.imageUrls[0]" :alt="item.name" :title="item.name" :class="{ 'goods-item__fig-img': true }" @mouseover="overGoods()">
        <img :src="item.imageUrls[item.imageUrls.length >= 2 ? 1 : 0]" :alt="item.name" :title="item.name" :class="{ 'goods-item__fig--over': true, over: true }" @mouseleave="overGoodsLeave()">
      </figure>
      <figure v-else :class="{
          'goods-item__fig': true,
          '_recommand': mode === 'recommand'
        }">
        <img :src="item.imageUrls[0]" :alt="item.name" :title="item.name" :class="{ 'goods-item__fig-img': true }" @mouseover="overGoods()">
        <img :src="item.imageUrls[item.imageUrls.length >= 2 ? 1 : 0]" :alt="item.name" :title="item.name" :class="{ 'goods-item__fig-img__over': true, over: true }" @mouseleave="overGoodsLeave()">
      </figure>
      <div class="goods-item--info">
        <transition name="fade">
          <button v-show="mode === 'list' && cart === true" type="button" :class="{
              'goods-item--info__cart': true,
              '_active': item.cart === true
            }" @click.prevent="pushToCart">
            {{ $t('goods.goodsItem.cart') }}
          </button>
        </transition>
        <p v-if="item.promotionText" class="goods-item--info__subname">
          {{ item.promotionText }}
        </p>
        <h2 class="goods-item--info__name">
          {{ item.productName }}
        </h2>
        <div class="goods-item--info__price-wrap">
          <p v-if="discountRate" class="goods-item--info__sale">
            {{ discountRate }}%
          </p>
          <p class="goods-item--info__origin">
            <strong class="goods-item--info__origin--price">{{ salePrice }}</strong>
            <span class="goods-item--info__origin--symbol">{{ $t('currency') }}</span>
          </p>
          <p v-if="discountRate" class="goods-item--info__saleprice">
            {{ originalPrice }}
          </p>
        </div>
        <div class="goods-item--info__tags">
          <div v-if="isSoldOut" class="goods-item--info__tags__item soldout">
            <p>{{ $t('goods.tags.soldout') }}</p>
          </div>
          <div v-if="item.couponTag" class="goods-item--info__tags__item coupon">
            <p>{{ $t('goods.coupon') }}</p> <!-- TODO 쿠폰 %숨김처리해달라고함 -->
          </div>
          <div v-if="isPreOrderPeriod" class="goods-item--info__tags__item reserve">
            <p>{{ $t('goods.tags.reserve') }}</p>
          </div>
        </div>
      </div>
    </article>
  </a>
</template>
<script>
import AOS from 'aos'
import { Alert } from '@/utils/event-bus'
import { mapActions, mapState, mapGetters } from 'vuex'
import { getStrDate } from '@/utils/dateUtils'
import { productDetailQuery } from '@/utils/utils'
import { gaEventAddtoCart } from '@/utils/gaEventUtils'
export default {
  name: 'goods-item',
  props: {
    item: {
      type: Object,
      require: true,
      default: () => ({})
    },
    mode: {
      type: String,
      required: false,
      default: 'main'
    }
  },
  data () {
    return {
      cart: false,
      over: false
    }
  },
  created () {
    AOS.init()
  },
  mounted () {
    AOS.refreshHard()
  },
  computed: {
    ...mapState('product', ['options']),
    ...mapGetters('brand', ['flatBrands']),
    couponRate () {
      return Math.ceil(this.item.couponDiscountAmt / (this.item.salePrice - this.discountAmt) * 100)
    },
    discountRate () {
      return Math.ceil(this.discountAmt / this.item.salePrice * 100)
    },
    discountAmt () {
      return (this.item.immediateDiscountAmt || 0)
    },
    salePrice () {
      return (this.item.salePrice - this.discountAmt).toLocaleString()
    },
    originalPrice () {
      return this.item.salePrice.toLocaleString()
    },
    isSoldOut () {
      return this.isPreOrderPeriod ? this.item.reservationData.reservationStockCnt === 0 : this.item.stockCnt === 0
    },
    // 예약 주문 기간 여부
    isPreOrderPeriod () {
      if (this.item && this.item.reservationData) {
        const currentDate = new Date()
        const endDate = new Date(this.item.reservationData.reservationEndYmdt.replace(' ', 'T'))
        const startDate = new Date(this.item.reservationData.reservationStartYmdt.replace(' ', 'T'))

        return endDate >= currentDate && currentDate >= startDate
      }

      return false
    }
  },
  methods: {
    ...mapActions('cart', ['addToCart']),
    ...mapActions('product', ['fetchProductOptions']),
    isNew (itemRegisterYmdt) {
      let currentDate = new Date()
      if (this.isPreOrderPeriod) {
        return currentDate.getTime() < this.fun_date2(this.item.reservationData.reservationStartYmdt).getTime()
      } else {
        return currentDate.getTime() < this.fun_date2(itemRegisterYmdt).getTime()
      }
    },
    fun_date2 (data) {
      let date1 = new Date(data)
      date1.setDate(date1.getDate() + 7)
      return date1
    },
    async pushToCart () {
      await this.fetchProductOptions(this.item.productNo)

      if (this.options.flatOptions.length > 1) {
        Alert({
          // title: '장바구니',
          message: '옵션을 선택하고 장바구니에 담아주세요.'
        })

        this.$router.push({
          name: 'GoodsDetail',
          params: {
            goodsNo: this.item.productNo
          }
        })
      } else {
        await this.addToCart({
          carts: [
            {
              productNo: this.item.productNo,
              optionNo: this.options.flatOptions[0].optionNo,
              additionalProductNo: 0,
              orderCnt: 1
            }
          ]
        })
        /** gtag.js */
        gaEventAddtoCart(this.item, 1)
        Alert({
          // title: '장바구니',
          message: '상품이 장바구니에 담겼습니다!'
        })
      }
    },
    cartView () {
      this.cart = true
    },
    cartUnView () {
      this.cart = false
    },
    overGoods () {
      this.over = true
    },
    overGoodsLeave () {
      this.over = false
    },
    goGoodsDetail (productNo) {
      let query = productDetailQuery(this.$route, this.flatBrands)
      this.$router.push({
        path: '/goods/detail/' + productNo,
        query: query
      })
    }
  }
}
</script>
