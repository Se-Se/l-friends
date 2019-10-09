<template>
  <li>
    <span class="review_score">
      <span class="graph" :style="{width:(parseInt(review.rate) / 5) * 100 + '%'}"><strong class="blind">3.0</strong></span>
      <span class="blind">/ 5.0</span>
    </span>
    <dl class="info">
      <dt>
        <MoreView ref="view" :content="review.content" />
      </dt>
      <dd>
        <template v-if="review.fileUrls.length > 0">
          <review-imgs :images="review.fileUrls" />
        </template>
        <span class="mail">{{ review.nickname.substring(0,2) + '***' }}</span>
        <span class="date">{{ review.registerYmdt }}</span>
      </dd>
    </dl>
    <template v-if="review.recommendCnt > 0">
      <!-- 나 혼자 추천했을 때 -->
      <template v-if="review.recommandCnt === 1 && !review.recommendable">
        <p class="txt">会員様がおすすめしました。</p>
        <template v-if="!review.myReview">
          <template v-if="review.recommendable">
            <p class="btn_area_up">
              <button class="btn btn_primary size_xs gray" @click="goodRecommend(review.reviewNo)">おすすめ </button>
            </p>
          </template>
          <template v-else>
            <p class="btn_area_up">
              <button class="btn btn_primary size_xs gray checked" @click="cancelRecommend(review.reviewNo)">✓ おすすめ</button>
            </p>
          </template>
        </template>
      </template>
      <!-- 나말고 누군가가 추천했을 때 -->
      <template v-else>
        <!-- 추천자가 다수 이고, 그 중 나도 추천한 경우 -->
        <template v-if="!review.recommendable">
          <p class="txt">{{profile && profile.nickname}}様と{{ review.recommendCnt - 1 }}名様がこちらのレビューをおすすめしました。</p>
          <template v-if="!review.myReview">
            <template v-if="review.recommendable">
              <p class="btn_area_up">
                <button class="btn btn_primary size_xs gray" @click="goodRecommend(review.reviewNo)">おすすめ</button>
              </p>
            </template>
            <template v-else>
              <p class="btn_area_up">
                <button class="btn btn_primary size_xs gray checked" @click="cancelRecommend(review.reviewNo)">✓ おすすめ</button>
              </p>
            </template>
          </template>
        </template>
        <!--추천자가 다수 이고, 난 추천안한 경우-->
        <template v-else>
          <p class="txt">{{ review.recommendCnt }}人のお客様がおすすめしました。</p>
          <template v-if="!review.myReview">
            <template v-if="review.recommendable">
              <p class="btn_area_up">
                <button class="btn btn_primary size_xs gray" @click="goodRecommend(review.reviewNo)">おすすめ</button>
              </p>
            </template>
            <template v-else>
              <p class="btn_area_up">
                <button class="btn btn_primary size_xs gray checked" @click="cancelRecommend(review.reviewNo)">✓ おすすめ</button>
              </p>
            </template>
          </template>
        </template>
      </template>
    </template>
    <template v-if="review.recommendCnt === 0 && !review.myReview">
      <p class="txt">このレビューは参考になりましたか？</p>
      <template v-if="!review.myReview">
        <template v-if="review.recommendable">
          <p class="btn_area_up">
            <button class="btn btn_primary size_xs gray" @click="goodRecommend(review.reviewNo)">おすすめ</button>
          </p>
        </template>
        <template v-else>
          <p class="btn_area_up">
            <button class="btn btn_primary size_xs gray checked" @click="cancelRecommend(review.reviewNo)">✓ おすすめ</button>
          </p>
        </template>
      </template>
    </template>
  </li>
</template>

<script>
import ReviewImgs from '@/components/goods/modal/ReviewImgs.vue'

import { mapState, mapGetters } from 'vuex'
import { formatCurrency } from '@/utils/StringUtils'
import { isLogin } from '@/utils/utils'
import { Alert } from '@/components/common/modal'
import MoreView from '@/components/common/MoreView.vue'

export default {
  name: 'ReviewItem',
  components: {
    ReviewImgs,
    MoreView
  },
  props: {
    review: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      item: this.review
    }
  },
  mounted () {
    this.$refs.view.init()
  },
  methods: {
    toggleRecommand () {
      this.item.recommanded = !this.item.recommanded
      this.item.recommand += this.item.recommanded ? 1 : -1
    },
    onMovePage () {
      this.fetchPage(this.page)
    },
    convertStarPoint (rate) {
      let half = 0
      if (Number(rate) !== Math.floor(rate) && rate - Math.floor(rate) < 0.5) {
        half = 10
      }
      return Math.round(rate) * 20 + half + '%'
    },
    priceFormat (price) {
      return formatCurrency(price)
    },
    pageChange (index) {
      window.scrollTo(1100, 1100)
      this.pageNo = index
      this.$store.dispatch('review/fetchProductReviews', {
        productNo: this.$router.currentRoute.params.goodsNo,
        pageNo: this.pageNo,
        orderBy: this.orderBy
      })
    },
    goodRecommend (reviewNo) {
      if (!isLogin()) {
        this.$router.push({
          path: '/m/member/login',
          query: {
            redirect: this.$route.path
          }
        })
        return
      }
      const recommend = {
        productNo: this.$router.currentRoute.params.goodsNo,
        reviewNo: reviewNo
      }
      this.$store.dispatch('review/postProductReviewsRecommend', recommend).then(() => {
        Alert({
          message: 'おすすめされました。'
        })
      })
    },
    cancelRecommend (reviewNo) {
      if (!isLogin()) {
        this.$router.push({
          path: '/m/member/login',
          query: {
            redirect: this.$route.path
          }
        })
        return
      }
      const recommend = {
        productNo: this.$router.currentRoute.params.goodsNo,
        reviewNo: reviewNo
      }
      this.$store.dispatch('review/deleteProductReviewsRecommend', recommend).then(() => {
        Alert({
          message: 'おすすめが取り消されました。'
        })
      })
    },
    changeOrderBy (ordered) {
      this.orderBy = ordered

      this.$store.dispatch('review/fetchProductReviews', {
        productNo: this.$router.currentRoute.params.goodsNo,
        pageNo: this.pageNo,
        orderBy: ordered
      })
    }
  },
  computed: {
    ...mapState('product', ['currentTabIndex']),
    ...mapGetters('authentication', ['paycoLoginUrl']),
    ...mapState('review', ['productReviews']),
    ...mapState('profile', ['profile']),
    isShowImage () {
      return this.review.fileUrls && this.review.fileUrls.length > 0
    },
    isMore () {
      return this.review.fileUrls.length < 5
    },
    images () {
      let images = []
      for (const image of this.testImg) {
        images.push(image)
      }

      return images
    }
  }
}
</script>
<style scoped>
</style>
