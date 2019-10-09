<template>
  <div>
    <section class="detail-default">
      <div class="detail-default__header">
        <h2 v-if="productReviews && productReviews.totalCount" class="detail-default__header-title">
          {{ $t('goods.detailReview.title') }}
          <span class="detail-default__header-cnt">{{ productReviews.totalCount }}</span>
        </h2>
        <div v-if="productReviews && productReviews.totalCount" class="detail-default__header-option">
          <div class="detail-default__header-option__item">
            <button :class="{ 'review-btn': true, on: orderBy === 'RECOMMEND' }" @click="changeOrderBy('RECOMMEND')">
              {{ $t('goods.detailReview.sortOfRecommand') }}
            </button>
          </div>
          <div class="detail-default__header-option__item">
            <button :class="{ 'review-btn': true, on: orderBy === 'REGISTER_YMDT' }" @click="changeOrderBy('REGISTER_YMDT')">
              {{ $t('goods.detailReview.sortOfLately') }}
            </button>
          </div>
          <div class="detail-default__header-add">
            <router-link :to="isLogined ? '/mypage/myreview' : '/member/login'">
              <white-button :data="reviewAdd" />
            </router-link>
          </div>
        </div>
      </div>
      <template v-if="productReviews && productReviews.items && productReviews.items.length">
        <ul class="detail-default__list">
          <li v-for="( review, key ) in productReviews.items" :key="key" class="detail-default__item" style="cursor: default;">
            <star-rating :value="review.rate" />
            <div class="detail-default__item-content">
              <p>
                <more-view :content="review.content"></more-view>
              </p>
            </div>
            <div class="detail-default__item-img">
              <ImageGallery :images="review.fileUrls" :imgPointer="true"></ImageGallery>
            </div>
            <div class="detail-default__item-footer">
              <div class="detail-default__item-footer__info">
                <p>{{ review.memberId }}</p>
                <p>{{ review.registerYmdt  | dateFormatStr('yyyy.MM.dd')}}</p>
              </div>
              <div class="detail-default__item-footer__action">
                <!--추천이 있을 때-->
                <template v-if="review.recommendCnt > 0">

                  <!-- 나 혼자 추천했을 때 -->
                  <template v-if="review.recommandCnt === 1 && !review.recommendable">
                    <p>{{ $t('goods.detailReview.myRecommand') }}</p>
                    <template v-if="!review.myReview">
                      <template v-if="review.recommendable">
                        <button type="button" class="_recommand" @click="goodRecommend(review.reviewNo)">
                          {{ $t('goods.detailReview.recommand') }}
                        </button>
                      </template>
                      <template v-else>
                        <button type="button" class="_recommand _active" @click="cancelRecommend(review.reviewNo)">
                          {{ $t('goods.detailReview.cancelOfRecommand') }}
                        </button>
                      </template>
                    </template>
                  </template>

                  <!-- 나말고 누군가가 추천했을 때 -->
                  <template v-else>

                    <!-- 추천자가 다수 이고, 그 중 나도 추천한 경우 -->
                    <template v-if="!review.recommendable">
                      <p>{{ $t('goods.detailReview.my') }} {{ review.recommendCnt - 1 }}{{ $t('goods.detailReview.anotherRecommand') }}</p>
                      <template v-if="!review.myReview">
                        <template v-if="review.recommendable">
                          <button type="button" class="_recommand _active" @click="goodRecommend(review.reviewNo)">
                            {{ $t('goods.detailReview.recommand') }}
                          </button>
                        </template>
                        <template v-else>
                          <button type="button" class="_recommand _active" @click="cancelRecommend(review.reviewNo)">
                            {{ $t('goods.detailReview.cancelOfRecommand') }}
                          </button>
                        </template>
                      </template>
                    </template>

                    <!--추천자가 다수 이고, 난 추천안한 경우-->
                    <template v-else>
                      <p>{{ review.recommendCnt }}{{ $t('goods.detailReview.anotherRecommand') }}</p>
                      <template v-if="!review.myReview">
                        <template v-if="review.recommendable">
                          <button type="button" class="_recommand _active" @click="goodRecommend(review.reviewNo)">
                            {{ $t('goods.detailReview.recommand') }}
                          </button>
                        </template>
                        <template v-else>
                          <button type="button" class="_recommand _active" @click="cancelRecommend(review.reviewNo)">
                            {{ $t('goods.detailReview.cancelOfRecommand') }}
                          </button>
                        </template>
                      </template>
                    </template>

                  </template>
                </template>
                <template v-if="review.recommendCnt === 0 && !review.myReview">
                  <p>{{ $t('goods.detailReview.helpOfRecommand') }}</p>
                  <template v-if="!review.myReview">
                    <template v-if="review.recommendable">
                      <button type="button" class="_recommand" @click="goodRecommend(review.reviewNo)">
                        {{ $t('goods.detailReview.recommand') }}
                      </button>
                    </template>
                    <template v-else>
                      <button type="button" class="_recommand _active" @click="cancelRecommend(review.reviewNo)">
                        {{ $t('goods.detailReview.cancelOfRecommand') }} {{ review.recommendCnt }}
                      </button>
                    </template>
                  </template>
                </template>
              </div>
            </div>
          </li>
        </ul>
        <div class="detail-default__pagination">
          <pagination v-model="query.page" :total="productReviews.totalCount" :limit="query.limit" @change="fetch" />
        </div>
      </template>
      <div v-else-if="productReviews && productReviews.totalCount == 0" class="detail-default__nodata">
        <detail-no-data :title="$t('goods.detailReview.noData')" />
        <router-link :to="isLogined ? '/mypage/myreview' : '/member/login'">
          <white-button :data="reviewAdd" />
        </router-link>
      </div>
    </section>
  </div>
</template>
<script>
import Pagination from '../assets/Pagination'
import WhiteButton from '../assets/buttons/WhiteButton'
import DetailNoData from '../goods/DetailNoData'
import AddReview from '@/components/pc/pages/mypage/review/leaf/AddReviewNew'
import StarRating from '@/components/pc/layout/common/StarRating'
import MoreView from '@/components/common/MoreView'
import { mapState, mapGetters } from 'vuex'
import { formatCurrency, optionFormat } from '@/utils/StringUtils'
import { Alert } from '@/utils/event-bus'
import ImageGallery from '@/components/common/ImageGalleryNew'

export default {
  name: 'detail-default',
  components: {
    Pagination,
    WhiteButton,
    DetailNoData,
    AddReview,
    StarRating,
    ImageGallery,
    MoreView
  },
  data () {
    return {
      orderBy: 'RECOMMEND', // REGISTER_YMDT
      query: {
        page: 1,
        limit: 20
      },
      reviewAdd: {
        action: 'button',
        width: 141,
        height: 40,
        font: 14,
        title: this.$t('goods.detailReview.add')
      }
    }
  },
  computed: {
    ...mapGetters(['isLogined']),
    ...mapState('product', ['currentTabIndex']),
    ...mapGetters('authentication', ['paycoLoginUrl']),
    ...mapState('review', ['productReviews'])
  },
  mounted () {
    this.fetch()
  },
  methods: {
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
      this.query.page = 1

      this.fetch()
      this.$store.dispatch('review/fetchProductReviews', {
        productNo: this.$store.state.route.params.goodsNo,
        pageNo: this.query.page,
        orderBy: ordered
      })
    },
    fetch () {
      const props = {
        productNo: this.$router.currentRoute.params.goodsNo,
        pageNo: this.query.page,
        orderBy: this.orderBy
      }
      this.$store.dispatch('review/fetchProductReviews', props)
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
    }
  }
}
</script>
