<template>
  <div>
    <sub-page-header title="취소반품 조회" />

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
          />
        </li>
      </ul>

      <not-found
        v-else
        description="취소 반품 내역이 없습니다."
        :height="49.1"
      />
    </div>

    <!-- <div class="search-util">
      <a href="#">이전 주문내역 보기</a>
    </div> -->
  </div>
</template>

<script>
import { onScrollNextPage } from '@/utils/event-bus'

import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import OrderInfo from '@/components/mobile/order/OrderInfo'
import NotFound from '@/components/mobile/common/list/NotFound'
import PeriodSelector from '@/components/mobile/common/PeriodSelector'
import CancelListNew from '@/components/mixins/mypage/order/list/CancelListNew'

export default {
  name: 'OrderList',
  mixins: [CancelListNew],
  components: {
    SubPageHeader,
    OrderInfo,
    NotFound,
    PeriodSelector
  },
  data () {
    return {
      period: null
    }
  },
  watch: {
    period (next) {
      this.getCancels(next)
    }
  },
  mounted () {
    onScrollNextPage(async () => {
      if (this.orders.length < this.totalCount) {
        await this.$store.dispatch('myorder/fetchMore')
      }
    })
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
</style>
