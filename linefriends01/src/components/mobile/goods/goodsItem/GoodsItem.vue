<template>
  <a @click="goGoodsDetail(goods.productNo)">
    <article class="goods-item">
      <figure class="goods-item__thumbnail--wrapper">
        <lazy-img :class="['goods-item__thumbnail', isSoldOut ? 'soldout' : '']" :src="getMoImgURL(goods.imageUrls[0])" />
        <div class="goods-item-badges">
          <span v-if="isNew(goods.saleStartYmdt) && !goods.mainBestProductYn" class="goods-item-badges__item new">NEW</span>
          <span v-if="goods.mainBestProductYn && !isMainBest" class="goods-item-badges__item best">BEST</span>
        </div>
        <div v-if="showCartIcon" class="goods-item-cart" @click.prevent="pushToCart">
          Add To Cart
        </div>
      </figure>
      <div class="goods-item-info">
        <span v-if="goods.promotionText" class="goods-item-info__subname">
          {{ goods.promotionText }}
        </span>

        <p class="goods-item-info__name">
          {{ goods.productName }}
        </p>

        <p class="goods-item-info__price-wrap">
          <span v-if="discountRate" class="goods-item-info__sale">
            {{ discountRate }}%
          </span>
          <span class="goods-item-info__price">
            <strong class="goods-item-info__sale-price">{{ salePrice }}</strong>
            <span class="goods-item-info__unit">{{ $t('currency') }}</span>
          </span>
          <span v-if="discountRate" class="goods-item-info__original-price">
            {{ originalPrice }}
          </span>
        </p>
        <ul class="goods-item-info__tags">
          <li v-if="isSoldOut" class="goods-item-info__tags__item soldout">
            {{ $t('goods.tags.soldout') }}
          </li>
          <li v-if="goods.couponTag" class="goods-item-info__tags__item coupon">
            {{ $t('goods.coupon') }}
            <!-- TODO 쿠폰 %숨김처리해달라고함 -->
          </li>
          <li v-if="isPreOrderPeriod" class="goods-item-info__tags__item reserve">
            {{ $t('goods.tags.reserve') }}
          </li>
        </ul>
      </div>
    </article>
  </a>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { Alert } from '@/utils/event-bus'
import LazyImg from '@/components/common/LazyImg'
import { productDetailQuery } from '@/utils/utils'
import { gaEventAddtoCart } from '@/utils/gaEventUtils'
export default {
  name: 'GoodsItem',
  components: {
    LazyImg
  },
  props: {
    goods: {
      type: Object,
      require: true,
      default: () => ({})
    },
    isMainBest: {
      default: false
    }
  },
  computed: {
    ...mapState('product', ['options']),
    ...mapGetters('brand', ['flatBrands']),
    isSoldOut () {
      return this.isPreOrderPeriod ? this.goods.reservationData.reservationStockCnt === 0 : this.goods.stockCnt === 0
    },
    // 예약 주문 기간 여부
    isPreOrderPeriod () {
      if (this.goods && this.goods.reservationData) {
        const currentDate = new Date()
        const endDate = new Date(this.goods.reservationData.reservationEndYmdt.replace(' ', 'T'))
        const startDate = new Date(this.goods.reservationData.reservationStartYmdt.replace(' ', 'T'))

        return endDate >= currentDate && currentDate >= startDate
      }

      return false
    },
    couponRate () {
      return Math.ceil(this.goods.couponDiscountAmt / (this.goods.salePrice - this.discountAmt) * 100)
    },
    discountRate () {
      return Math.ceil(this.discountAmt / this.goods.salePrice * 100)
    },
    discountAmt () {
      return (this.goods.immediateDiscountAmt || 0)
    },
    salePrice () {
      return (this.goods.salePrice - this.discountAmt).toLocaleString()
    },
    originalPrice () {
      return this.goods.salePrice.toLocaleString()
    },
    showCartIcon () {
      return ['GoodsList'].includes(this.$router.currentRoute.name)
    }
  },
  methods: {
    ...mapActions('cart', ['addToCart']),
    ...mapActions('product', ['fetchProductOptions']),
    getMoImgURL (imageUrl) {
      if (~imageUrl.indexOf('cdn.toastcloud.com')) {
        const suffix = `?500x500`
        imageUrl = imageUrl + suffix
      }
      return imageUrl
    },
    isNew (itemRegisterYmdt) {
      let currentDate = new Date()
      if (this.isPreOrderPeriod) {
        return currentDate.getTime() < this.fun_date2(this.goods.reservationData.reservationStartYmdt).getTime()
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
      await this.fetchProductOptions(this.goods.productNo)

      if (this.options.flatOptions.length > 1) {
        Alert({
          title: this.$t('goods.promotion.cart'),
          message: this.$t('goods.promotion.selectOption')
        })

        this.$router.push({
          name: 'GoodsDetail',
          params: {
            goodsNo: this.goods.productNo
          }
        })
      } else {
        await this.addToCart({
          carts: [
            {
              productNo: this.goods.productNo,
              optionNo: this.options.flatOptions[0].optionNo,
              additionalProductNo: 0,
              orderCnt: 1
            }
          ]
        })
        /** gtag.js */
        gaEventAddtoCart(this.goods, 1)
        Alert({
          title: this.$t('goods.promotion.cart'),
          message: this.$t('goods.promotion.successCart')
        })
      }
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

<style lang="scss" scoped>
.goods-item {
  height: 29.4rem;

  &__thumbnail {
    width: 100%;
    height: 100% !important;
    object-fit: cover;

    &--wrapper {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 43.2vw;
      overflow: hidden;
    }

    &.soldout {
      opacity: 0.4;
    }
  }

  &-badges {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;

    &__item {
      line-height: 1;
      display: inline-block;
      width: 4rem;
      height: 2rem;
      padding-top: 0.5rem;
      text-align: center;
      color: #fff;
      font-size: 1.2rem;
      font-family: Volte, sans-serif;
      font-weight: 600;

      &.best {
        background: #df67ff;
      }

      &.new {
        background: #5388ff;
      }

      &.reserve {
        border: 1px solid #4ba4d9;
      }
    }
  }

  &-cart {
    position: absolute;
    right: 0.8rem;
    bottom: 0.8rem;
    width: 3rem;
    height: 3rem;
    background-size: 100% 100%;
    background-image: url(~@/assets/images/mobile/ic-goods-cart.svg);
    font-size: 0;
  }

  &-info {
    padding: 0.7rem 0 0;
    text-align: center;

    &__subname {
      padding-top: 0.3rem;
      display: block;
      width: 100%;
      margin-bottom: 0.51rem;
      overflow: hidden;
      font-weight: 500;
      font-size: 1.2rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #999;
    }

    &__name {
      display: block;
      display: -webkit-box;
      position: relative;
      font-family: "Noto Sans KR";
      font-size: 1.4rem;
      font-weight: normal;
      line-height: 1.8rem;
      letter-spacing: 0rem;
      color: #333;
      max-height: 3.6rem;
      -webkit-box-pack: center;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      word-break: keep-all;
      word-wrap: break-word;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__price {
      &-wrap {
        margin-top: 0.8rem;
        font-size: 0;
      }
    }

    &__unit {
      vertical-align: text-bottom;
      display: inline-block;
      font-family: "Noto Sans KR";
      font-size: 1.2rem;
      font-weight: normal;
      color: #333;
      margin-left: 0.2rem;
    }

    &__sale {
      font-family: Volte, "Noto Sans KR", sans-serif;
      font-size: 1.9rem;
      font-weight: 600;
      color: #ff414e;
      margin-right: 0.2rem;

      &-price {
        font-family: Volte, "Noto Sans KR", sans-serif;
        font-size: 1.9rem;
        font-weight: 600;
        letter-spacing: 0.03rem;
        color: #333;
      }
    }

    &__original-price {
      display: block;
      font-family: Volte, "Noto Sans KR", sans-serif;
      font-size: 1.4rem;
      font-weight: normal;
      text-decoration: line-through;
      color: #333;
      opacity: 0.3;
      line-height: 1rem;
      margin-top: 0.3rem;
    }

    &__tags {
      padding-top: 0.9rem;
      display: flex;
      justify-content: center;

      &__item {
        line-height: 1.6rem;
        padding: 0 0.7rem;
        border-radius: 1.866rem;
        font-family: "Noto Sans KR", sans-self;
        font-size: 1rem;
        font-weight: 500;
        color: #4ba4d9;

        &:not(:last-child) {
          margin-right: 0.1rem;
        }

        &.soldout {
          border: 1px solid #a5aab0;
          color: #a5aab0;
        }

        &.coupon {
          height: 1.8rem;
          line-height: 1.8rem;
          background: #4ba4d9;
          color: #fff;
        }

        &.reserve {
          border: 1px solid #4ba4d9;
        }
      }
    }
  }
}
</style>
