
<template>
  <div class="old-css">
    <main-wrapper>
      <layout-width>
        <div id="container" class="payco cart">
          <div class="escrow">
            <div class="escrow_inner">
              <!-- cart header component S-->
              <EscrowHeaderNew page="cart" />
              <!-- cart header component E -->
              <form>
                <fieldset>
                  <legend class="blind">장바구니 목록</legend>
                  <CartTableNew />
                  <template v-if="isDeliveryGroups || isInvalidProducts">
                    <CartNotificationNew />
                  </template>
                </fieldset>
              </form>
              <template v-if="isDeliveryGroups || isInvalidProducts">
                <CartPriceInfoNew />
                <CartBtnNew />
              </template>
              <template v-else>
                <div v-for=" (today, index) in eventToday" :class="[index !== eventToday.length - 1 ? 'bor-bom-1' : '', index === 0 ? 'mar-top-100' : 'mar-top-50']">
                  <h2>{{today.label}}</h2>
                  <div class="today_content">
                    <slick :options="todaySlickOptions" class="today_list swiperCon">
                      <div class="itemList" v-for="product in today.products">
                        <TodayProductDetail :product="product" />
                      </div>
                    </slick>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </layout-width>
    </main-wrapper>
  </div>
</template>

<script>
  import LayoutWidth from '@/components/pc/layout/common/LayoutWidth'
  import MainWrapper from '@/components/pc/layout/common/MainWrapper'
  import EscrowHeaderNew from '@/components/pc/layout/header/EscrowHeaderNew'
  import CartTableNew from '@/components/pc/layout/cart/CartTableNew'
  import CartNotificationNew from '@/components/pc/layout/cart/CartNotificationNew'
  import CartPriceInfoNew from '@/components/pc/layout/cart/CartPriceInfoNew'
  import CartBtnNew from '@/components/pc/layout/cart/CartBtnNew'
  import { mapState, mapGetters, mapMutations } from 'vuex'
  import Slick from 'vue-slick'
  import TodayProductDetail from '@/components/pc/layout/common/TodayProductDetail'

  export default {
    data () {
      return {
        mychecked: false,
        todaySlickOptions: {
          infinite: true,
          slidesToShow: 6,
          slidesToScroll: 6
        }
      }
    },
    name: 'Cart',
    components: {
      LayoutWidth,
      MainWrapper,
      EscrowHeaderNew,
      CartTableNew,
      CartNotificationNew,
      CartPriceInfoNew,
      CartBtnNew,
      Slick,
      TodayProductDetail
    },
    computed: {
      ...mapState('cart', ['cart']),
      ...mapState('event', ['eventToday']),
      ...mapGetters('cart', ['isDeliveryGroups', 'isInvalidProducts'])
    },
    methods: {
      ...mapMutations('cart', ['SET_INIT'])
    },
    beforeRouteLeave (to, from, next) {
      this.SET_INIT()
      next()
    }
  }
</script>

<style lang="scss">
#wrap.pc #container.payco.cart {
  padding-top: 0;
  @import '~@/styles/pc/payco/index.scss';
}
</style>
