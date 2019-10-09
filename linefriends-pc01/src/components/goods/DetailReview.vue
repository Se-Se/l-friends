<template>
  <div>
    <div class="item_detail_contents">
      <div class="item_detail_data" v-if="productReviews && productReviews.totalCount">
        <h3 class="item_detail_title">レビュー <span class="txt percent">{{ productReviews.totalCount >99 ? '99+':productReviews.totalCount}}</span></h3>

        <div class="bx_sort">
          <ul class="list_tab">
            <li :class="{on:orderBy === 'RECOMMEND'}"><a href="#" @click.prevent="changeOrderBy('RECOMMEND')">おススメ順</a></li>
            <li :class="{on:orderBy === 'REGISTER_YMDT'}"><a href="#" @click.prevent="changeOrderBy('REGISTER_YMDT')">新着順</a></li>
          </ul>
          <div class="btn_r"><button class="btn btn_primary size_m" @click="handleCheckLogin"> レビューを登録する</button></div>
        </div>
        <template v-if="productReviews && productReviews.items && productReviews.items.length">
          <ul class="list_review">
            <li v-for="( review, key ) in productReviews.items" :key="key" class="for_show_more">
              <div class="review_info">
                <span class="review_score">
                  <span class="graph" :style="{width:(parseInt(review.rate) / 5) * 100 + '%'}"><strong class="blind">4.0</strong></span>
                  <span class="blind">/ 5.0</span>
                </span>
              </div>
              <div class="bx_review">
                <pre class="show_more_content ">{{ review.content }}</pre>
                <template v-if="review.fileUrls.length > 0">
                  <review-imgs :images="review.fileUrls" />
                </template>
              </div>
              <button type="button" class="btn_detail" v-if="showMoreBtn(key)" @click="showMoreContent(key)">
                <span class="txt">続きを読む</span>
              </button>
              <p class="member_data">
                <span class="name">{{ review.nickname.substring(0,2) + '***' }}</span>
                <span class="date">{{ review.registerYmdt }}</span>
              </p>
              <!--추천이 있을 때-->
              <template v-if="review.recommendCnt > 0">
                <!-- 나 혼자 추천했을 때 -->
                <div class="rec_btn add" v-if="review.recommandCnt === 1 && !review.recommendable">
                  <p class="recommend">会員様がおすすめしました。</p>
                  <template v-if="!review.myReview">
                    <template v-if="review.recommendable">
                      <div class="bx_btn">
                        <button class="btn size_s btn_recommend" @click="goodRecommend(review.reviewNo)">おすすめ</button>
                      </div>
                    </template>
                    <template v-else>
                      <div class="bx_btn">
                        <button class="btn size_s btn_recommend on" @click="cancelRecommend(review.reviewNo)">✓ おすすめ</button>
                      </div>
                    </template>
                  </template>
                </div>
                <!-- 나말고 누군가가 추천했을 때 -->
                <template v-else>
                  <!-- 추천자가 다수 이고, 그 중 나도 추천한 경우 -->
                  <div class="rec_btn add" v-if="!review.recommendable">
                    <p class="recommend">
                      {{profile && profile.nickname}}様と{{ review.recommendCnt - 1 }}名様がこちらのレビューをおすすめしました。
                    </p>
                    <template v-if="!review.myReview">
                      <template v-if="review.recommendable">
                        <div class="bx_btn">
                          <button class="btn size_s btn_recommend" @click="goodRecommend(review.reviewNo)">おすすめ</button>
                        </div>
                      </template>
                      <template v-else>
                        <div class="bx_btn">
                          <button class="btn size_s btn_recommend on" @click="cancelRecommend(review.reviewNo)">✓ おすすめ</button>
                        </div>
                      </template>
                    </template>
                  </div>
                  <!--추천자가 다수 이고, 난 추천안한 경우-->
                  <template v-else>
                    <div class="rec_btn add add">
                      <p class="recommend">{{ review.recommendCnt }}人のお客様がおすすめしました。</p>
                      <template v-if="!review.myReview">
                        <template v-if="review.recommendable">
                          <div class="bx_btn">
                            <button class="btn size_s btn_recommend" @click="goodRecommend(review.reviewNo)">おすすめ</button>
                          </div>
                        </template>
                        <template v-else>
                          <div class="bx_btn">
                            <button class="btn size_s btn_recommend on" @click="cancelRecommend(review.reviewNo)">✓ おすすめ</button>
                          </div>
                        </template>
                      </template>
                    </div>
                  </template>
                </template>
              </template>
              <template v-if="review.recommendCnt === 0 && !review.myReview">
                <div class="rec_btn">
                  <p class="recommend">このレビューは参考になりましたか？</p>
                  <template v-if="!review.myReview">
                    <template v-if="review.recommendable">
                      <div class="bx_btn">
                        <button class="btn size_s btn_recommend" @click="goodRecommend(review.reviewNo)">おすすめ</button>
                      </div>
                    </template>
                    <template v-else>
                      <div class="bx_btn">
                        <button class="btn size_s btn_recommend on" @click="cancelRecommend(review.reviewNo)">✓ おすすめ</button>
                      </div>
                    </template>
                  </template>
                </div>
              </template>
            </li>
          </ul>
        </template>
        <pagination v-model="query.pageNo" :total="productReviews.totalCount" :limit="query.pageSize" @input="moveToPage" />
      </div>
      <div class="item_detail_nodata" v-else-if="!pending.productReviews">
        <img src="@/assets/img/common/img_error.png" alt="">
        <p class="text"> レビューがございません。</p>
        <button class="btn btn_primary size_m" @click="handleCheckLogin"> レビューを登録する<i class="ico_infor"></i></button>
      </div>
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/common/Pagination'
import ReviewImgs from '@/components/common/ReviewImgs'
import { mapState } from 'vuex'
import { formatCurrency, optionFormat } from '@/utils/StringUtils'
import { Alert } from '@/components/common/modal'
import { isLogin } from '@/utils/utils'
import $ from 'jquery'

export default {
  name: 'detailReview',
  components: {
    Pagination,
    ReviewImgs
  },
  data () {
    return {
      orderBy: 'RECOMMEND', // REGISTER_YMDT
      query: {
        productNo: this.$route.params.goodsNo,
        pageNo: 1,
        pageSize: 20,
        orderBy: 'RECOMMEND'
      },
      reviewAdd: {
        action: 'button',
        width: 141,
        height: 40,
        font: 14,
        title: 'だけ登録する'
      },
      theShowMore: []
    }
  },
  computed: {
    ...mapState('product', ['currentTabIndex']),
    ...mapState('review', ['productReviews', 'pending']),
    ...mapState('profile', ['profile'])
  },
  mounted () {
    this.fetch()
    // this.showMoreContentBtn()
  },
  updated () {
    // this.showMoreContentBtn()
  },
  methods: {
    handleCheckLogin () {
      if (isLogin()) {
        this.$router.push('/mypage/myreview')
      } else {
        this.$router.push({
          path: '/member/login',
          query: {
            redirect: '/mypage/myreview'
          }
        })
      }
    },
    showMoreContentBtn (key) {
      if ($('.show_more_content')[0]) {
        this.$nextTick(() => {
          let thePre = document.getElementsByClassName('show_more_content')
          let newThePre = []
          newThePre = [...thePre]
          let arr = []
          arr = newThePre.map((item, index) => {
            if (item.offsetHeight > $('.review_info').height() * 3.4) {
              return index
            }
          })
          this.theShowMore = arr
          $('.show_more_content').addClass('hold_show_more')
        })
      }
    },
    showMoreBtn (key) {
      return this.theShowMore.indexOf(key) > -1
    },
    showMoreContent (key) {
      let thePre = document.getElementsByClassName('show_more_content')
      if (thePre[key].classList[1] === 'hold_show_more') {
        thePre[key].classList.remove('hold_show_more')
        $('.for_show_more')[key].childNodes[2].childNodes[0].innerHTML = '閉じる'
      } else {
        thePre[key].classList.add('hold_show_more')
        $('.for_show_more')[key].childNodes[2].childNodes[0].innerHTML = '続きを読む'
      }
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
      if (!isLogin()) {
        this.$router.push({
          path: '/member/login',
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
        }).then(() => {
          this.fetch()
        })
      })
    },
    cancelRecommend (reviewNo) {
      if (!isLogin()) {
        this.$router.push({
          path: '/member/login',
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
        }).then(() => {
          this.fetch()
        })
      })
    },
    changeOrderBy (ordered) {
      this.orderBy = ordered
      if (this.query.orderBy !== ordered) {
        this.query.orderBy = ordered
        this.query.pageNo = 1
      }
      this.fetch()
    },
    fetch () {
      this.$store.dispatch('review/fetchProductReviews', this.query).then(() => {
        this.$nextTick(() => {
          this.showMoreContentBtn()
        })
      })
    },
    moveToPage (num) {
      this.query.pageNo = num
      this.$store.dispatch('review/fetchProductReviews', this.query).then(() => {
        let top = $('.wrap').offset().top + $('.wrap').height() - 100 - $('.wrap_tabmenu').height()
        $('html, body').animate({ scrollTop: top })
        this.$nextTick(() => {
          this.showMoreContentBtn()
        })
      })
    }
  }
}
</script>
<style  scoped>
.wrapper-pc .itemview .list_review .rec_btn.add {
  position: absolute;
  right: 0;
  bottom: 24px;
  height: 30px;
  line-height: 30px;
  font-size: 0;
}
.wrapper-pc .itemview .list_review .rec_btn.add .bx_btn {
  display: inline-block;
  height: 30px;
  vertical-align: top;
}
.hold_show_more {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  max-height: 66px;
}
pre {
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}
</style>
