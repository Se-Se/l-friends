<template>
  <router-link :to="'/goods/detail/' + item.productNo">
    <article
      class="goods-item__singleline"
      @mouseover="cartView()"
      @mouseleave="cartUnView()"
    >
      <i
        v-if="item.status === 'best'"
        class="goods-item__status"
      >
        BEST
      </i>
      <figure
        v-if="mode === 'list'"
        :class="{
          'goods-item__fig': true,
          '_list' : mode === 'list',
          '_recommand': mode === 'recommand',
          'soldout': isSoldOut
        }"
        data-aos="fade-zoom-in"
      >
        <img
          :src="item.imageUrls[0]"
          :alt="item.name"
          :title="item.name"
          :class="{ 'goods-item__fig-img': true }"
          @mouseover="overGoods()"
        >
        <img
          :src="item.imageUrls[item.imageUrls.length >= 2 ? 1 : 0]"
          :alt="item.name"
          :title="item.name"
          :class="{ 'goods-item__fig--over': true, over: true }"
          @mouseleave="overGoodsLeave()"
        >
      </figure>
      <figure
        v-else
        :class="{
          'goods-item__fig': true,
          '_recommand': mode === 'recommand'
        }"
      >
        <img
          :src="item.imageUrls[0]"
          :alt="item.name"
          :title="item.name"
          :class="{ 'goods-item__fig-img': true }"
          @mouseover="overGoods()"
        >
        <img
          :src="item.imageUrls[item.imageUrls.length >= 2 ? 1 : 0]"
          :alt="item.name"
          :title="item.name"
          :class="{ 'goods-item__fig-img__over': true, over: true }"
          @mouseleave="overGoodsLeave()"
        >
      </figure>
      <div class="goods-item--info">
        <transition name="fade">
          <button
            v-if="mode === 'list' && cart === true"
            type="button"
            :class="{
              'goods-item--info__cart': true,
              '_active': item.cart === true
            }"
            @click.prevent="pushToCart"
          >
            <!-- {{ $t('goods.promotion.cart') }} -->
            {{ 'test' }}
          </button>
        </transition>
        <p
          v-if="item.promotionText"
          class="goods-item--info__subname"
        >
          {{ item.promotionText }}
        </p>
        <h2 class="goods-item--info__name">
          {{ item.productName }}
        </h2>
        <div class="goods-item--info__price-wrap">
          <p
            v-if="discountRate"
            class="goods-item--info__sale"
          >
            {{ discountRate }}%
          </p>
          <p class="goods-item--info__origin">
            <strong class="goods-item--info__origin--price">{{ salePrice }}</strong>
            <span class="goods-item--info__origin--symbol">{{ 'test' }}</span>
            <!-- <span class="goods-item--info__origin--symbol">{{ $t('currency') }}</span> -->
          </p>
          <p
            v-if="discountRate"
            class="goods-item--info__saleprice"
          >
            {{ originalPrice }}
          </p>
        </div>
        <div class="goods-item--info__tags">
          <div
            v-if="isSoldOut"
            class="goods-item--info__tags__item soldout"
          >
            <p class="goods-item--info__tags__label">{{ 'test' }}</p>
            <!-- <p class="goods-item--info__tags__label">{{ $t('goods.tags.soldout') }}</p> -->
          </div>
          <div
            v-if="item.couponDiscountAmt"
            class="goods-item--info__tags__item coupon"
          >
            <p class="goods-item--info__tags__label">{{ 'test' }}</p>
            <!-- <p class="goods-item--info__tags__label">{{ $t('goods.coupon') }}</p> -->
          </div>
          <div
            v-if="isPreOrderPeriod"
            class="goods-item--info__tags__item reserve"
          >
            <p class="goods-item--info__tags__label">{{ 'test' }}</p>
            <!-- <p class="goods-item--info__tags__label">{{ $t('goods.tags.reserve') }}</p> -->
          </div>
        </div>
      </div>
    </article>
  </router-link>
</template>
<script>
import AOS from 'aos'
import { mapActions, mapState } from 'vuex'
// import { Alert } from '@/utils/event-bus'

export default {
  name: 'GoodsPromotion',
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
  computed: {
    ...mapState('product', ['options']),
    couponRate () {
      return Math.ceil(this.item.couponDiscountAmt / (this.item.salePrice - this.discountAmt) * 100)
    },
    ouponRate () {
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
    async pushToCart () {
      await this.fetchProductOptions(this.item.productNo)

      if (this.options.flatOptions.length > 1) {
        // Alert({
        //   title: this.$t('goods.detail.header.product'),
        //   message: this.$t('goods.promotion.selectOption')
        // })

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
              orderCnt: 1
            }
          ]
        })

        // Alert({
        //   title: this.$t('goods.detail.header.product'),
        //   message: this.$t('goods.promotion.successCart')
        // })
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
    }
  }
}
</script>
<style scoped>
.goods-item__singleline {
  position: relative;
}
.goods-item__singleline .goods-item__fig {
  position: relative;
  height: 180px;
  z-index: 10;
}

article figure, article figure img {
  /* width: 280px; */
  /* height: 260px; */
  margin: 0 auto;
}
.goods-item__singleline .goods-item__fig-img {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 100;
}
.item_best.column4 li a article figure, .item_best.column4 li a article figure img {
  width: 280px;
  height: 260px;
  margin: 0 auto;
}
.item_best.column3 li a article figure, .item_best.column3 li a article figure img {
    height: 360px;
}
.goods-item__singleline .goods-item__fig-img__over {
  opacity: 0;
  height: 180px;
}
.goods-item__singleline .goods-item__fig .over {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  -webkit-transition: 300ms;
  transition: 300ms;
  opacity: 1;
  -webkit-animation: overView 1s;
  animation: overView 1s;
}
.goods-item__singleline .goods-item--info {
  position: relative;
  padding-top: 8px;
  margin: 0 auto;
  max-width: 180px;
}
.goods-item--info {
  padding-top: 8px;
  margin: 0 auto;
  text-align: center;
}
.goods-item__singleline .goods-item--info__name {
    /* font-family: "Noto Sans KR",sans-serif; */
    font-weight: normal;
    display: -webkit-box;
    max-height: 36px;
    font-size: 14px;
    line-height: 1.29;
    letter-spacing: -0.1px;
    color: #333333;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    -webkit-box-pack: center;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
}
.item_best.column4 li .goods-item--info__name {
    /* font-family: 'Noto Sans KR',sans-serif; */
    font-weight: normal;
    font-size: 14px;
    letter-spacing: -0.1px;
    line-height: 1.29;
    color: #333;
}
.goods-item__singleline .goods-item--info__price-wrap {
    padding-top: 8px;
}
.item_best.column4 li .goods-item--info__price-wrap {
    padding-top: 8px;
    font-family: Volte, sans-serif;
    font-size: 20px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.1px;
    color: #333333;
}
.goods-item__singleline .goods-item--info__origin {
    display: inline-block;
    font-weight: normal;
    font-size: 12px;
    color: #333333;
    vertical-align: top;
    font-size: 0;
}
.goods-item__singleline .goods-item--info__origin--price {
    display: inline-block;
    font-family: Volte, "Noto Sans KR", sans-self;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.1px;
    vertical-align: top;
}
.goods-item__singleline .goods-item--info__origin--symbol {
    display: inline-block;
    font-family: Volte, "Noto Sans KR", sans-self;
    font-weight: normal;
    vertical-align: top;
    margin-top: 5px;
    font-size: 12px;
}
.item_best.column4 li .goods-item--info__tags {
    padding-top: 8px;
}
.goods-item__singleline .goods-item--info__tags__item {
    display: inline-block;
    padding: 3px 6px;
    margin-right: 2px;
    border-radius: 15px;
    border: 1px solid transparent;
    font-weight: normal;
    font-size: 10px;
    line-height: 1;
    vertical-align: top;
}
.goods-item__singleline .goods-item--info__tags__item:last-child {
    margin-right: 0;
}
.goods-item__singleline .goods-item--info__tags__item.coupon {
    border: 1px solid #4ba4d9;
    background-color: #4ba4d9;
    color: #fff;
}
</style>
