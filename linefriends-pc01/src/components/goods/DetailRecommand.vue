<template>
  <div class="buy_history">
    <div class="wrap">
      <h3 class="his_title">人気上昇中！</h3>
      <ul class="good_list column-5">
        <li v-for="(item, key) in recommand" :key="key">
          <router-link :to="'/product/detail/' + item.productNo" tag="a">
            <div class="photo_wrap">
              <div class="thumbnail">
                <img class="item_img" :src="item.imageUrls[0]" :alt="item.name" :title="item.name">
                <img class="item_img_hover" :src="item.imageUrls[item.imageUrls.length >= 2 ? 1 : 0]" :alt="item.name" :title="item.name">
              </div>
            </div>
            <div class="good_info">
              <span class="describe" v-if="item.promotionText"> {{ item.promotionText }}</span>
              <h3 class="name" v-if="item.productName">{{ item.productName }}</h3>
              <p class="price">
                <strong class="discount" v-if="discountRate(item)">{{ discountRate(item) }}% OFF</strong>
                <span class="real"><i class="uom">￥</i>{{ salePrice(item) }}</span>
                <del class="original" v-if="discountRate(item)">{{ originalPrice(item) }}</del>
              </p>
              <p class="ohter">
                <span class="badge badge_blue" v-if="item.couponTag">{{couponRate(item)}}OFF クーポン</span>
                <span class="badge badge_reserved" v-if="isPreOrderPeriods(item)">予約商品</span>
              </p>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { includeNow } from '@/utils/dateUtils'

export default {
  name: 'detail-recommand',
  components: {

  },
  props: {
    recommand: {
      required: false
    }
  },
  methods: {
    isPreOrderPeriod (item) {
      if (item && item.reservationData) {
        const currentDate = new Date()
        const endDate = new Date(item.reservationData.reservationEndYmdt.replace(' ', 'T'))
        const startDate = new Date(item.reservationData.reservationStartYmdt.replace(' ', 'T'))

        return endDate >= currentDate && currentDate >= startDate
      }

      return false
    },
    isPreOrderPeriods (item) {
      if (item && item.reservationData) {
        return includeNow(item.reservationData.reservationStartYmdt, item.reservationData.reservationEndYmdt)
      }
      return false
    },
    discountRate (item) {
      return Math.ceil((item.immediateDiscountAmt || 0) / item.salePrice * 100)
    },
    couponRate (item) {
      return Math.ceil(item.couponDiscountAmt / (item.salePrice - (item.immediateDiscountAmt || 0)) * 100)
    },
    salePrice (item) {
      return (item.salePrice - (item.immediateDiscountAmt || 0)).toLocaleString()
    },
    originalPrice (item) {
      return item.salePrice.toLocaleString()
    }
  }
}
</script>
