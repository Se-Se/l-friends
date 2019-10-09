<template>
  <a @click="goGoodsDetail(item.productNo)">
    <article class="goods-item__singleline" @mouseover="cartView()" @mouseleave="cartUnView()">
      <i v-if="item.status === 'best'" class="goods-item__status">
        BEST
      </i>
      <figure v-if="mode === 'list'" :class="{
          'goods-item__fig': true,
          '_list' : mode === 'list',
          '_recommand': mode === 'recommand',
          'soldout': isSoldOut
        }" data-aos="fade-zoom-in">
        <lazy-img :src="getCdnImgURL(item.imageUrls[0])" :alt="item.name" :title="item.name" :class="{ 'goods-item__fig-img': true }" @mouseover="overGoods()" />
        <lazy-img :src="getCdnImgURL(item.imageUrls[item.imageUrls.length >= 2 ? 1 : 0])" :alt="item.name" :title="item.name" :class="{ 'goods-item__fig--over': true, over: true }" @mouseleave="overGoodsLeave()" />
      </figure>
      <figure v-else :class="{
          'goods-item__fig': true,
          '_recommand': mode === 'recommand'
        }">
        <lazy-img :src="getCdnImgURL(item.imageUrls[0])" :alt="item.name" :title="item.name" :class="{ 'goods-item__fig-img': true }" @mouseover="overGoods()" />
        <lazy-img :src="getCdnImgURL(item.imageUrls[item.imageUrls.length >= 2 ? 1 : 0])" :alt="item.name" :title="item.name" :class="{ 'goods-item__fig-img__over': true, over: true }" @mouseleave="overGoodsLeave()" />
      </figure>
      <div class="goods-item--info">
        <transition name="fade">
          <button v-if="mode === 'list' && cart === true" type="button" :class="{
              'goods-item--info__cart': true,
              '_active': item.cart === true
            }" @click.prevent="pushToCart">
            {{ $t('goods.promotion.cart') }}
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
            <p class="goods-item--info__tags__label">{{ $t('goods.tags.soldout') }}</p>
          </div>
          <div v-if="item.couponTag" class="goods-item--info__tags__item coupon">
            <p class="goods-item--info__tags__label">{{ $t('goods.coupon') }}</p>
          </div>
          <div v-if="isPreOrderPeriod" class="goods-item--info__tags__item reserve">
            <p class="goods-item--info__tags__label">{{ $t('goods.tags.reserve') }}</p>
          </div>
        </div>
      </div>
      {{ item.productName }}
    </article>
  </a>
</template>
<script>
import AOS from 'aos'
import { mapActions, mapState } from 'vuex'
import { Alert } from '@/utils/event-bus'
import LazyImg from '@/components/common/LazyImg'
import { productDetailQuery } from '@/utils/utils'
export default {
  name: 'GoodsPromotion',
  components: {
    LazyImg
  },
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
    },
    perRow: {
      type: Number,
      required: true
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
    getCdnImgURL (imageUrl) {
      // console.log(this.perRow)
      if (~imageUrl.indexOf('cdn.toastcloud.com')) {
        switch (this.perRow) {
          case 2: return `${imageUrl}?360x360`
          case 3: return `${imageUrl}?360x360`
          case 4: return `${imageUrl}?260x260`
          case 5: return `${imageUrl}?220x220`
          case 6: return `${imageUrl}?180x180`
          default: return imageUrl
        }
      } else {
        return imageUrl
      }
    },
    async pushToCart () {
      await this.fetchProductOptions(this.item.productNo)

      if (this.options.flatOptions.length > 1) {
        Alert({
          title: this.$t('goods.detail.header.product'),
          message: this.$t('goods.promotion.selectOption')
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

        Alert({
          title: this.$t('goods.detail.header.product'),
          message: this.$t('goods.promotion.successCart')
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
      let query = productDetailQuery(this.$route, [])
      this.$router.push({
        path: '/goods/detail/' + productNo,
        query: query
      })
    }
  }
}
</script>
