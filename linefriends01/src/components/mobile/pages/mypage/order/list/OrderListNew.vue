<template>
  <div>
    <sub-page-header :title="$t('mypage.orderList.title')" />

    <div id="container">
      <period-selector v-model="period" />

      <ul
        v-if="orders && orders.length > 0"
        class="order-list"
      >
        <li
          v-for="order in orders"
          :key="order.orderNo"
          class="order-list__item"
        >
          <order-info
            :product="order"
            list
            @showAddReviewPopup="openReview"
          />
        </li>
      </ul>

      <not-found
        v-else
        :height="49.1"
      >
        <span
          class="not-found-message"
          v-html="$t('mypage.orderList.description')"
        />
        <div class="not-found-buttons">
          <app-button
            size="middle-small"
            to="/goods"
          >
            전체 상품 보기
          </app-button>
        </div>
      </not-found>
    </div>

    <div class="search-util">
      <a href="https://old-store.linefriends.co.kr/" target="_blanck">{{ $t('mypage.orderList.prevOrder') }}</a>
    </div>

    <transition name="review-popup">
      <div
        v-show="regist"
        class="review-popup__wrapper"
      >
        <add-review
          ref="ReviewPopup"
          class="review-popup"
          mode="WRITE"
          :review="product"
          @close="reviewClose"
          @save="$store.dispatch('myorder/getOrderList', { type: 'ORDER', to: $route })"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import $ from 'jquery'
import { mapState, mapGetters } from 'vuex'
import { onScrollNextPage } from '@/utils/event-bus'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'

import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import OrderInfo from '@/components/mobile/order/OrderInfo'
import NotFound from '@/components/mobile/common/list/NotFound'
import PeriodSelector from '@/components/mobile/common/PeriodSelector'
import AppButton from '@/components/mobile/common/button/Button'
import ProductInquiryPopup from '@/components/pc/popup/ProductInquiryPopupNew'
import OrderAddreviewPopup from '@/components/pc/popup/OrderAddreviewPopupNew'
import AddReview from '@/components/mobile/pages/mypage/review/leaf/AddReviewNew'

const $elem = $('html, body')

export default {
  name: 'OrderList',
  components: {
    SubPageHeader,
    OrderInfo,
    NotFound,
    PeriodSelector,
    AppButton,
    AddReview
  },
  data () {
    return {
      period: 'one_month',
      product: {},
      regist: false,
      lastScroll: 0
    }
  },
  watch: {
    period (next) {
      this.getOrders(next)
    },
    regist (next) {
      if (next) {
        disablePageScroll(this.$refs.ReviewPopup.$el)
        $elem.css('overflow', 'hidden')
      } else {
        enablePageScroll(this.$refs.ReviewPopup.$el)
        $elem.css('overflow', '')
      }
    }
  },
  computed: {
    ...mapState('myorder', ['loading', 'totalCount', 'orders', 'selectTypeFlg']),
    ...mapGetters('common', ['productInquiryTypes'])
  },
  mounted () {
    onScrollNextPage(async () => {
      if (this.orders.length < this.totalCount) {
        await this.$store.dispatch('myorder/fetchMore')
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    if (this.regist) {
      this.regist = false
      next(false)
    } else {
      next()
    }
  },
  methods: {
    getOrders (period) {
      this.pageNo = 1
      this.$router.replace({
        path: '/mypage/orderlist',
        query: {
          type: 'ORDER',
          period
        }
      })
    },
    openReview (product) {
      this.product = product
      this.regist = true
    },
    reviewClose () {
      this.regist = false
    }
  }
}
</script>

<style lang="scss" scoped>
.order-list {
  &__item {
    padding: 3.2rem 0 3.6rem;

    &:not(:last-child) {
      border-bottom: 1px solid #ededed;
    }
  }
}

.search-util {
  border-top: 1px solid #ededed;
  padding: 1.6rem 2rem 3.8rem;
  text-align: right;

  a {
    font-size: 1.2rem;
    font-family: 'Noto Sans KR';
    font-weight: 500;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #4ba4d9;
    text-decoration: underline;
  }
}

/deep/ .not-found {
  &-buttons {
    margin-top: 1.9rem;

    button {
      width: 12rem;
    }
  }
}

.review-popup {
  width: 100%;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  &__wrapper {
    position: fixed;
    z-index: 1005;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #fff;
  }

  &-enter-active, &-leave-active {
    transition: .3s;
  }

  &-enter, &-leave-to {
    opacity: 0;
    transform: translateY(5rem);
  }
}
</style>
