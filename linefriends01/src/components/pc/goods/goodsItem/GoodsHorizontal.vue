<template>
  <router-link :to="'/goods/detail/' + goods.productNo">
    <article class="goods-item__horizontal">
      <figure class="goods-item__fig">
        <img :src="goods.imageUrls[0]" :alt="goods.name" :title="goods.name">
      </figure>
      <div class="goods-item--info">
        <p v-if="goods.promotionText" class="goods-item--info__subname">
          {{ goods.promotionText }}
        </p>
        <h2 class="goods-item--info__name">
          {{ goods.productName }}
        </h2>
        <div class="goods-item--info__price-wrap">
          <div>
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
        </div>
        <div class="goods-item--info__tags">
          <div v-if="isSoldOut" class="goods-item--info__tags__item soldout">
            <p>{{ $t('goods.tags.soldout') }}</p>
          </div>
          <div v-if="goods.couponTag" class="goods-item--info__tags__item coupon">
            <p>{{ $t('goods.coupon') }}</p> <!-- TODO 쿠폰 %숨김처리해달라고함 -->
          </div>
          <div v-if="isPreOrderPeriod" class="goods-item--info__tags__item reserve">
            <p>{{ $t('goods.tags.reserve') }}</p>
          </div>
        </div>
      </div>
    </article>
  </router-link>
</template>
<script>
export default {
  name: 'goods-horizontal',
  props: {
    goods: {
      required: false
    }
  },
  computed: {
    couponRate () {
      return Math.ceil(this.goods.couponDiscountAmt / (this.goods.salePrice - this.discountAmt) * 100)
    },
    ouponRate () {
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
    }
  }
}
</script>
