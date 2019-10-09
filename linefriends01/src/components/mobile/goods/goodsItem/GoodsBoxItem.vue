<template>
  <router-link :to="'/goods/detail/' + goods.productNo">
    <article class="goods-item">
      <figure class="goods-item__thumbnail--wrapper">
        <lazy-img class="goods-item__thumbnail" :src="goods.imageUrls[0]" />
        <div class="goods-item-badges">
          <span v-if="isNew(goods.saleStartYmdt) && !goods.mainBestProductYn" class="goods-item-badges__item new">NEW</span>
          <span v-if="goods.mainBestProductYn" class="goods-item-badges__item best">BEST</span>
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
          </li>
          <li v-if="isPreOrderPeriod" class="goods-item-info__tags__item reserve">
            {{ $t('goods.tags.reserve') }}
          </li>
        </ul>
      </div>
    </article>
  </router-link>
</template>

<script>
import LazyImg from '@/components/common/LazyImg'

export default {
  name: 'GoodsBoxItem',
  components: {
    LazyImg
  },
  props: {
    goods: {
      type: Object,
      require: true,
      default: () => ({})
    }
  },
  methods: {
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
    }
  },
  computed: {
    isSoldOut () {
      return this.isPreOrderPeriod ? this.goods.reservationData.reservationStockCnt === 0 : this.goods.stockCnt === 0
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
    // 예약 주문 기간 여부
    isPreOrderPeriod () {
      if (this.goods && this.goods.reservationData) {
        const currentDate = new Date()
        const endDate = new Date(this.goods.reservationData.reservationEndYmdt.replace(' ', 'T'))
        const startDate = new Date(this.goods.reservationData.reservationStartYmdt.replace(' ', 'T'))

        return endDate >= currentDate && currentDate >= startDate
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-item {
  padding: 1.6rem;
  box-sizing: content-box;
  height: 29.4rem;
  background: #fff;

  &__thumbnail {
    width: 100%;
    height: 43.2vw !important;
    object-fit: cover;
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

  &-info {
    padding: 1.1rem 0 0;
    text-align: center;

    &__subname {
      display: block;
      width: 100%;
      margin-bottom: 0.5rem;
      overflow: hidden;
      font-family: "Noto Sans KR", sans-self;
      font-weight: normal;
      font-size: 1.2rem;
      letter-spacing: 0.03rem;
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
      word-break: break-word;
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
      padding-top: 1rem;
      display: flex;
      justify-content: center;

      &__item {
        line-height: 1.8rem;
        padding: 0 0.7rem;
        border: 1px solid #4ba4d9;
        border-radius: 1.866rem;
        font-family: "Noto Sans KR", sans-self;
        font-size: 1rem;
        font-weight: normal;
        color: #4ba4d9;

        &:not(:last-child) {
          margin-right: 0.1rem;
        }

        &.coupon {
          height: 1.8rem;
          background: #4ba4d9;
          color: #fff;
        }

        &.reserve {
          border: 1px solid #4ba4d9;
        }

        &.soldout {
          border: 1px solid #a5aab0;
          color: #a5aab0;
        }
      }
    }
  }
}
</style>
