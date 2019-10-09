<template>
  <div class="recommend">
    <h3 class="ttl_h3">人気上昇中！</h3>
    <div class="good_roller">
      <ul class="good_list slick" style="width: calc(20.9rem * 10)">
        <li v-for="(item, key) in goods" :key="key">
          <router-link :to="'/m/product/detail/' + item.productNo">
            <div class="photo_wrap">
              <div class="thumbnail">
                <img :src="item.imageUrls[0]" alt="">
              </div>
              <span class="cart" v-if="true" @click.prevent="pushToCart(item)" @touchstart="handleTouch($event)" @touchend="handleTouchEnd($event)">cart</span>
            </div>
            <div class="good_info">
              <span class="describe" v-if="item.promotionText">{{ item.promotionText }}</span>
              <h3 class="name"> {{ item.productName }}</h3>
              <p class="price">
                <strong class="discount" v-if="discountRate(item)">{{ discountRate(item) }}% OFF</strong>
                <span class="real"><i class="uom" >￥</i>{{salePrice(item)}}</span>
                <del class="original" v-if="discountRate(item)">{{ originalPrice(item) }}</del>
              </p>
              <p class="ohter">
                <span class="badge badge_blue" v-if="item.couponTag">クーポン</span>
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
import { mapActions, mapState } from 'vuex'
import { includeNow } from '@/utils/dateUtils'
import { Alert } from '@/components/common/modal'
export default {
  name: 'GoodsRecommands',
  components: {

  },
  props: {
    direction: {
      type: String,
      default: 'vertical'
    },
    width: {
      type: Number,
      default: 20.2
    },
    margin: {
      type: Number,
      default: 1.2
    },
    skin: {
      type: String,
      default: 'normal'
    },
    paddingSide: {
      type: Number,
      default: 0
    },
    paddingLeft: {
      type: Number,
      default: 0
    },
    goods: {
      type: Array,
      required: true
    },
    checkable: {
      type: Boolean,
      default: false
    },
    deletable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      check: {},
      checkList: [],
      checkAll: false,
      onCart: false
    }
  },
  computed: {
    ...mapState('product', ['options']),
    isHorizontal () {
      return this.direction === 'horizontal'
    }
  },
  mounted () {
  },
  methods: {
    ...mapActions('cart', ['addToCart']),
    ...mapActions('product', ['fetchProductOptions']),
    handleTouch (e) {
      e.target.classList.add('on')
    },
    handleTouchEnd (e) {
      e.target.classList.remove('on')
    },
    isNew (itemRegisterYmdt) {
      let currentDate = new Date()
      return currentDate.getTime() < this.fun_date2(itemRegisterYmdt).getTime()
    },
    fun_date2 (data) {
      let date1 = new Date(data.replace(/-/g, '/'))
      date1.setDate(date1.getDate() + 7)
      return date1
    },
    async pushToCart (item) {
      await this.fetchProductOptions(item.productNo)
      if (this.options.flatOptions.length > 1) {
        Alert({
          message: 'オプションを選択しカートに入れてください。'
        }).then(() => {
          this.$router.push({
            path: `/m/product/detail/${item.productNo}`,
            params: {
              productNo: item.productNo
            }
          })
        })
      } else {
        let ret = await this.addToCart({
          carts: [
            {
              productNo: item.productNo,
              optionNo: this.options.flatOptions[0].optionNo,
              additionalProductNo: 0,
              orderCnt: 1
            }
          ]
        })
        if (ret) {
          Alert({
            message: '商品をカートに追加しました!'
          })
        }
      }
    },
    discountRate (item) {
      return Math.ceil((item.immediateDiscountAmt || 0) / item.salePrice * 100)
    },
    originalPrice (item) {
      return item.salePrice.toLocaleString()
    },
    salePrice (item) {
      return (item.salePrice - (item.immediateDiscountAmt || 0)).toLocaleString()
    },
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
    }
  }
}
</script>

<style  scoped>
.good_roller .good_list {
  width: 101.8rem !important;
}
</style>
