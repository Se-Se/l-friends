<template>
  <div class="review__wrapper">
    <div class="review-star__wrapper">
      <span v-for="i in 5" :key="i" :class="['review-star', i <= review.rate ? 'active' : '']">★</span>
    </div>
    <p class="review-content">
      <more-view :content="review.content"></more-view>
      <!-- <pre>{{ review.content }}</pre> -->
    </p>
    <div class="review-info">
      <span class="review-info__user-email">{{ review.memberId }}</span>
      <span class="review-info__reg-date">{{ review.registerYmdt  | dateFormatStr('yyyy.MM.dd')}}</span>
    </div>
    <ul v-if="isShowImage" :class="['review-images', isMore ? 'more': '']">
      <li v-for="i in review.fileUrls.length" :key="i" :style="{ backgroundImage: 'url(' + review.fileUrls[i-1] + ')' }" class="review-images__item" @click="showMore(i-1)" />
    </ul>
    <ul class="review-buttons__wrapper">
      <!--추천이 있을 때-->
      <template v-if="review.recommendCnt > 0">
        <!--나 혼자 추천했을 때-->
        <template v-if="review.recommendCnt === 1 && !review.recommendable">
          <li class="review-buttons__tooltip">
            회원님이 추천했습니다.
          </li>
          <template v-if="!review.myReview">
            <template v-if="review.recommendable">
              <li class="review-buttons">
                <app-button size="small" @click="goodRecommend(review.reviewNo)">
                  <span>추천 {{ review.recommendCnt || '' }}</span>
                </app-button>
              </li>
            </template>
            <template v-else>
              <li class="review-buttons">
                <app-button size="small" @click="cancelRecommend(review.reviewNo)">
                  <span class="recommanded">추천취소 {{ review.recommendCnt || '' }}</span>
                </app-button>
              </li>
            </template>
          </template>
        </template>

        <!--나말고 누군가가 추천했을 때-->
        <template v-else>

          <!--추천자가 다수 이고, 그 중 나도 추천한 경우 -->
          <template v-if="!review.recommendable">
            <li class="review-buttons__tooltip">
              {{ review.recommendCnt -1 }}명이 이 상품평을 추천했습니다.
            </li>
            <template v-if="!review.myReview">
              <template v-if="review.recommendable">
                <li class="review-buttons">
                  <app-button size="small" @click="goodRecommend(review.reviewNo)">
                    <span>추천 {{ review.recommendCnt || '' }}</span>
                  </app-button>
                </li>
              </template>
              <template v-else>
                <li class="review-buttons">
                  <app-button size="small" @click="cancelRecommend(review.reviewNo)">
                    <span class="recommanded">추천취소 {{ review.recommendCnt || '' }}</span>
                  </app-button>
                </li>
              </template>
            </template>
          </template>

          <!--추천자가 다수 이고, 난 추천안한 경우 -->
          <template v-else>
            <li class="review-buttons__tooltip">
              {{ review.recommendCnt }}명이 이 상품평을 추천했습니다.
            </li>
            <template v-if="!review.myReview">
              <template v-if="review.recommendable">
                <li class="review-buttons">
                  <app-button size="small" @click="goodRecommend(review.reviewNo)">
                    <span>추천 {{ review.recommendCnt || '' }}</span>
                  </app-button>
                </li>
              </template>
              <template v-else>
                <li class="review-buttons">
                  <app-button size="small" @click="cancelRecommend(review.reviewNo)">
                    <span class="recommanded">추천취소{{ review.recommendCnt || '' }}</span>
                  </app-button>
                </li>
              </template>
            </template>
          </template>

        </template>
      </template>
      <template v-if="review.recommendCnt === 0 && !review.myReview">
        <li class="review-buttons__tooltip">
          이 상품평이 도움이 되었나요 ?
        </li>
        <template v-if="!review.myReview">
          <template v-if="review.recommendable">
            <li class="review-buttons">
              <app-button size="small" @click="goodRecommend(review.reviewNo)">
                <span>추천 {{ review.recommendCnt || '' }}</span>
              </app-button>
            </li>
          </template>
          <template v-else>
            <li class="review-buttons">
              <app-button size="small" @click="cancelRecommend(review.reviewNo)">
                <span class="recommanded">추천취소 {{ review.recommendCnt || '' }}</span>
              </app-button>
            </li>
          </template>
        </template>
      </template>
      <!-- <li class="review-buttons__tooltip" v-if="item.recommanded">
        회원님이 추천했습니다.
      </li>
      <li class="review-buttons__tooltip" v-else>
        이 상품평이 도움이 되었나요?
      </li>
      <li class="review-buttons">
        <app-button
          size="small"
          @click="toggleRecommand"
        >
          <span :class="{ recommanded: item.recommanded }">추천 {{ item.recommand || '' }}</span>
        </app-button>
      </li> -->
    </ul>
    <image-modal :bus="modalBus" />
  </div>
</template>

<script>
import Vue from 'vue'
import ImageModal from '@/components/mobile/common/modal/ImageModal'
import AppButton from '@/components/mobile/common/button/Button'
import MoreView from '@/components/common/MoreView'
import { mapState, mapGetters } from 'vuex'
import { formatCurrency, optionFormat } from '@/utils/StringUtils'
import { Alert } from '@/utils/event-bus'

export default {
  name: 'ReviewItem',
  components: {
    AppButton,
    ImageModal,
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
      item: this.review,
      modalBus: new Vue()
    }
  },
  methods: {
    toggleRecommand () {
      this.item.recommanded = !this.item.recommanded
      this.item.recommand += this.item.recommanded ? 1 : -1
    },
    // ...mapActions('productreview', ['fetchPage']),
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
    optionFormat (optionUsed, optionType, name, value, inputs, addprice, orderCnt) {
      return optionFormat(optionUsed, optionType, name, value, inputs, addprice, orderCnt)
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
      if (!this.$store.getters.isLogined) {
        this.$store.state.route.query.redirect = `${location.protocol}//${location.host}${this.$route.fullPath.split('#')[0]}`
        this.$store.dispatch('login')
        return
      }
      const recommend = {
        productNo: this.$router.currentRoute.params.goodsNo,
        reviewNo: reviewNo
      }
      this.$store.dispatch('review/postProductReviewsRecommend', recommend).then(() => {
        // alert('추천이 완료되었습니다.')
        Alert({
          message: '추천이 완료되었습니다.'
        })
      })
    },
    cancelRecommend (reviewNo) {
      if (!this.$store.getters.isLogined) {
        this.$store.state.route.query.redirect = `${location.protocol}//${location.host}${this.$route.fullPath.split('#')[0]}`
        this.$store.dispatch('login')
        return
      }
      const recommend = {
        productNo: this.$router.currentRoute.params.goodsNo,
        reviewNo: reviewNo
      }
      this.$store.dispatch('review/deleteProductReviewsRecommend', recommend).then(() => {
        // alert('추천이 취소되었습니다.')
        Alert({
          message: '추천이 취소되었습니다.'
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
    },
    goWriteReview () {
      if (!this.$store.getters.isLogined) {
        this.$store.state.route.query.redirect = `${location.protocol}//${location.host}${this.$route.fullPath.split('#')[0]}`
        this.$store.dispatch('login')
        return
      }
      this.$router.push({
        path: '/mypage/myreview'
      })
    },
    showMore (index) {
      this.modalBus.$emit('open', this.images, index)
    }
  },
  computed: {
    ...mapState('product', ['currentTabIndex']),
    ...mapGetters('authentication', ['paycoLoginUrl']),
    ...mapState('review', ['productReviews']),
    isShowImage () {
      return this.review.fileUrls && this.review.fileUrls.length > 0
    },
    isMore () {
      return this.review.fileUrls.length < 5
    },
    images () {
      let images = []
      for (const image of this.review.fileUrls) {
        images.push(image)
      }

      return images
    }
  }
}
</script>

<style lang="scss" scoped>
.review {
  &__wrapper {
    padding: 2.4rem 2rem 2rem;
  }

  &-star {
    margin-right: 0.6rem;
    display: inline-block;
    font-size: 0;
    width: 1.6rem;
    height: 1.533rem;
    background-size: 100% 100%;
    background-image: url(~@/assets/images/mobile/star--off.svg);

    &__wrapper {
      display: flex;
    }

    &.active {
      background-image: url(~@/assets/images/mobile/star--on.svg);
    }
  }

  &-content {
    margin-top: 1.266rem;
    font-family: "Noto Sans KR";
    font-size: 1.4rem;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: -0.01rem;
    color: #333;
    & > pre {
      word-break: break-all;
      white-space: pre-wrap;
    }
  }

  &-info {
    display: flex;
    margin-top: 1.6rem;

    &__user-email {
      margin-right: 1.6rem;
    }

    &__user-email,
    &__reg-date {
      font-family: Volte, sans-serif;
      font-size: 1.2rem;
      font-weight: normal;
      line-height: normal;
      letter-spacing: -0.01rem;
      color: #666;
    }
  }

  &-images {
    display: flex;
    margin-top: 2.1rem;

    &__item {
      width: 6rem;
      height: 6rem;
      background-size: cover;
      border: 1px solid #ededed;

      &:not(:last-child) {
        margin-right: 0.4rem;
      }
    }

    &.more &__item:last-child::after {
      content: "더보기";
      display: block;
      width: 100%;
      height: 100%;
      padding-top: 2rem;
      background: rgba(255, 255, 255, 0.5);
      font-family: "Noto Sans KR";
      font-size: 1.2rem;
      font-weight: bold;
      line-height: normal;
      letter-spacing: -0.01rem;
      color: #333;
      text-align: center;
    }
  }

  &-buttons {
    /deep/ button {
      padding: 0 1.6rem;

      .recommanded {
        color: #00d664;
      }
    }

    &__wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 1.6rem;
    }

    &__tooltip {
      font-family: "AppleSDGothicNeo", "Noto Sans KR";
      font-size: 1.2rem;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.01rem;
      color: #666;
    }
  }
}
</style>
