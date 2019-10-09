<template>
  <div class="coupon-list">
    <sub-page-header title="상품평" />

    <border-tab-container
      class="coupon-tabs"
      :tabs="{ '상품평쓰기': 0, '내가 쓴 상품평': 1 }"
      :bus="tabBus"
    >
      <tab-content
        :tab-id="0"
        :bus="tabBus"
      >
        <template v-if="productReviewable && productReviewable.length > 0">
          <review-item
            v-for="(item, key) in productReviewable"
            :key="key"
            :product="item"
            class="review-list-goods"
            reviewable
            @add="product => openReview('WRITE', product)"
          />
        </template>
        <not-found
          v-else
          description="작성 가능한 상품평이 없습니다."
        />
      </tab-content>
      <tab-content
        :tab-id="1"
        :bus="tabBus"
      >
        <template v-if="profileProductReviews &&  profileProductReviews.length > 0">
          <review-item
            v-for="(item, key) in profileProductReviews"
            :key="key"
            :product="item"
            class="review-list-goods"
            @update="product => openReview('MODIFY', product)"
          />
        </template>
        <not-found
          v-else
          description="작성한 상품평이 없습니다."          
        />
      </tab-content>
    </border-tab-container>

    <transition name="review-popup">
      <div
        v-show="regist"
        class="review-popup__wrapper"
      >
        <add-review
          ref="ReviewPopup"
          class="review-popup"
          :review="product"
          :mode="mode"
          @close="reviewClose"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import Vue from 'vue'
import $ from 'jquery'
import { mapState } from 'vuex'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'
import { onScrollNextPage } from '@/utils/event-bus'
import NotFound from '../../../common/list/NotFound'
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import BorderTabContainer from '@/components/mobile/common/tab/BorderTabContainer'
import TabContent from '@/components/mobile/common/tab/TabContent'
import ReviewItem from '@/components/mobile/mypage/ReviewItem'
import AddReview from '@/components/mobile/pages/mypage/review/leaf/AddReviewNew'

import MyReviewsNew from '@/components/mixins/mypage/review/MyReviewsNew'
import MyReviewableNew from '@/components/mixins/mypage/review/MyReviewableNew'

const $elem = $('html, body')

export default {
  name: 'MyReviewNew',
  mixins: [MyReviewsNew, MyReviewableNew],
  components: {
    SubPageHeader,
    BorderTabContainer,
    TabContent,
    ReviewItem,
    NotFound,
    AddReview
  },
  data () {
    return {
      tabBus: new Vue(),
      goods: [],
      reviews: [],
      regist: false,
      product: null,
      mode: 'WRITE',
      currentTab: 0,
      reviewsPage: 1
    }
  },
  computed: {
    ...mapState('profilereview', { productReviewable: 'productReviewable', reviewableCount: 'totalCount' }),
    ...mapState('review', { profileProductReviews: 'profileProductReviews', reviewsCount: 'totalCount' })
  },
  watch: {
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
  mounted () {
    onScrollNextPage(async () => {
      console.log(this.profileProductReviews, this.reviewsCount)
      if (this.currentTab === 0 && this.productReviewable.length < this.reviewableCount) {
        await this.$store.dispatch('profilereview/fetchReviewableMore')
      } else if (this.currentTab === 1 && this.profileProductReviews.length < this.reviewsCount) {
        await this.$store.dispatch('review/fetchMoreMyReviews', {
          pageNumber: ++this.reviewsPage
        })
      }
    })

    this.tabBus.$on('tab-change', id => {
      this.currentTab = id
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
    openReview (mode, product) {
      this.mode = mode
      this.product = product
      this.regist = true
    },
    reviewClose () {
      this.regist = false
      this.$store.dispatch('review/fetchProfileProductReviews')
      this.imgCount = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.review-list-goods {
  &:not(:last-child) {
    border-bottom: 1px solid #ededed;
  }

  &:last-child {
    margin-bottom: 0.5rem;
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
