<template>
  <div class="review_list-content">
    <div class="review_list-wrapper" :class="{'no-bottom': items.length === index+1}" v-for="(review,index) in items" :key="index">
      <div class="review_list_box" @click="$router.push(`/m/product/detail/${review.productNo}`)">
        <div class="box_thumb">
          <div class="thumbnail">
            <img :src="review.imageUrl" alt="">
          </div>
        </div>
        <div class="review_info">
          <h1>
            <template v-if="review.brandName">
              {{(review.productName) | wordsFormat(100)}}
            </template>
            <template v-else>
              {{review.productName | wordsFormat(100)}}
            </template>
          </h1>
          <p>{{optionFormat(review.optionUsed, review.optionType, review.optionName, review.optionValue, review.inputs, review.price.addPrice, review.orderCnt)}}</p>
        </div>
      </div>
      <button class="btn btn_primary" @click="writeReview(review)">レビューを作成する</button>
    </div>
    <div class="review_list-wrapper no-bottom" v-if="!loading && items && !items.length">
      <dl class="review_none">
        <dd>
          <img src="@/assets/img/common/img_no_data.png" alt="">
        </dd>
        <dt>
          レビューを作成できる商品がありません。
        </dt>
      </dl>
    </div>
    <!-- <ReviewPop :isShow="isShow" :review="currentReview" @closePop="isShow=false"></ReviewPop> -->
    <mugen-scroll :handler="pageDown" :should-handle="showMugen" :offsetTop="100" v-if="items && items.length">
      <div id="loader" v-show="showMugen">
        <div class="loader_img"></div>
      </div>
    </mugen-scroll>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { optionFormat } from '@/utils/StringUtils'
import MugenScroll from '@/components/common/MugenScroll'
// import ReviewPop from '@/views/mypage/review/ReviewPop.vue'

export default {
  name: 'Myreview',
  data () {
    return {
      currentPage: 1,
      isShow: false,
      currentReview: null
    }
  },
  components: {
    MugenScroll// ,
    // ReviewPop
  },
  computed: {
    ...mapState('review', ['productReviewable', 'loading']),
    items () {
      if (this.productReviewable) {
        return this.productReviewable
      } else {
        return []
      }
    },
    totalCount () {
      if (this.productReviewable) {
        return this.productReviewable.totalCount
      } else {
        return 0
      }
    },
    showMugen () {
      return this.productReviewable && this.productReviewable.length < this.totalCount
    }
  },
  methods: {
    optionFormat,
    pageDown () {
      this.$store.dispatch('review/fetchMoreProductReviewable')
    },
    writeReview (review) {
      // this.isShow = true
      // this.currentReview = review
      this.$store.commit('review/SET_CURRENTREVIEW', review)
      this.$router.push('/m/mypage/myreview/addreview')
    }
  }
}
</script>
