<template>
  <div id="container">
    <div v-if="productReviews && productReviews.totalCount > 0">
      <div
        class="header__add-review"
      >
        <app-button
          class="add-review"
          size="middle-small"
          :to="isLogined ? '/mypage/myreview' : '/member/login'"
        >
          상품평 등록하기
        </app-button>
      </div>
      <div class="sort-select">
        <button-select
          v-model="query.orderBy"
          :options="sorts"
          @input="orderChange"
        />
      </div>
      <review-item
        v-for="(review, key) in productReviews.items"
        :key="key"
        :review="review"
        class="review-item"
      />
      <pagination
        v-model="query.pageNo"
        :total="productReviews.totalCount"
        :limit="query.pageSize"
        class="review-pagination"
      />
    </div>
    <not-found
      v-else-if="productReviews && productReviews.totalCount == 0"
      description="등록된 상품평이 없습니다."
    >
      <app-button
        class="add-review"
        size="middle-small"
        :to="isLogined ? '/mypage/myreview' : '/member/login'"
      >
        상품평 등록하기
        <img
          class="add-review__img"
          src="@/assets/images/mobile/ic-chat.svg"
        >
      </app-button>
    </not-found>
  </div>
</template>

<script>
import Vue from 'vue'
import NotFound from '@/components/mobile/goods/detail/NotFound'
import AppButton from '@/components/mobile/common/button/Button'
import ButtonSelect from '@/components/mobile/common/ButtonSelect'
import ReviewItem from '@/components/mobile/goods/ReviewItem'
import Pagination from '@/components/mobile/common/list/Pagination'
import { mapGetters, mapState } from 'vuex'
import { formatCurrency, optionFormat } from '@/utils/StringUtils'

export default {
  name: 'GoodsReviews',
  components: {
    NotFound,
    AppButton,
    ReviewItem,
    ButtonSelect,
    Pagination
  },
  data () {
    return {
      query: {
        productNo: this.$route.params.goodsNo,
        pageNo: 1,
        pageSize: 100,
        orderBy: 'RECOMMEND'
      },
      sorts: [
        {
          label: '추천순',
          value: 'RECOMMEND'
        },
        {
          label: '최신순',
          value: 'REGISTER_YMDT'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['isLogined']),
    ...mapState('product', ['currentTabIndex']),
    ...mapGetters('authentication', ['paycoLoginUrl']),
    ...mapState('review', ['productReviews'])
  },
  watch: {
    query: {
      handler (next, prev) {
        if (prev) {
          if (next.orderBy !== prev.orderBy) {
            Vue.set(this.query, 'pageNo', 1)
          } else {
            this.fetch()
          }
        }
      },
      deep: true
    }
  },
  methods: {
    init () {
      this.query.pageNo = 1
      this.query.orderBy = 'RECOMMEND'
      this.fetch()
    },
    orderChange () {
      this.query.pageNo = 1
      this.fetch()
    },
    fetch () {
      this.$store.dispatch('review/fetchProductReviews', this.query)
    }
  }
}
</script>

<style lang="scss" scoped>
.sort-select {
  padding: 1.4rem 2rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
}

.add-review {
  margin-top: 2.333rem;
  width: 16.1rem;

  &__img {
    vertical-align: top;
    margin-top: 0.3rem;
    width: 1.6rem;
    height: 1.5rem;
  }
}

.review-item {
  border-bottom: 1px solid #eee;
}

.review-pagination {
  padding: 2rem 0 8rem;
}

.header__add-review {
  padding: 2rem;

  .add-review {
    width: 100%;
    margin-top: 0;
  }
}
</style>
