<template>
  <div class="review_list-content mb-39">
    <!-- ↓↓↓↓↓ review_list-wrapper ↓↓↓↓↓ -->
    <div class="review_list-wrapper" :class="{'no-bottom': profileProductReviews.length === index+1}" v-for="(review,index) in profileProductReviews" :key="`review_${index}`">
      <div class="review_list_box" @click="$router.push(`/m/product/detail/${review.productNo}`)">
        <div class="box_thumb">
          <div class="thumbnail">
            <img :src="review.imageUrl" alt="">
          </div>
        </div>
        <div class="review_info">
          <h1>
            <template v-if="review.brandName">
              {{(review.productName) | wordsFormat(132)}}
            </template>
            <template v-else>
              {{review.productName | wordsFormat(132)}}
            </template>
          </h1>
          <p>{{optionFormat(review.orderedOption.optionUsed, review.orderedOption.optionType, review.orderedOption.optionName, review.orderedOption.optionValue, review.orderedOption.inputs, review.orderedOption.addPrice, review.orderedOption.orderCnt)}}</p>
        </div>
      </div>
      <div class="review_edit" :key="`myreview_${index}`">
        <div class="star_area">
          <span class="review_score_max">
            <span class="graph" :style="{width: review.rate * 20+'%'}"><strong class="blind">{{review.rate}}</strong></span>
            <span class="blind">/ 5.0</span>
          </span>
        </div>
      </div>
      <span class="user_info">
        <p class="user_email" v-if="profile && profile.nickname">{{profile.nickname.substring(0,2) + '***'}}</p>
        <p class="date">{{formatData(review.registerYmdt)}}</p>
      </span>
      <p class="comment">
        <MoreView ref="view" :content="review.content" />
      </p>
      <div class="review_edit">
        <div class="img_upload_area">
          <ul class="img_upload">
            <li v-for="(imageUrl, index) in review.fileUrls" :key="index">
              <div class="thumbnail">
                <img class="item_img" :src="imageUrl" @click="openImagePop(review.fileUrls, index)">
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="btn_area">
        <ul>
          <li>
            <button class="btn btn_primary" @click="editReview(review)">修正</button>
          </li>
          <li>
            <button class="btn btn_primary" @click="delReview(review.productNo, review.reviewNo)">削除</button>
          </li>
        </ul>
      </div>
    </div>
    <div class="review_list-wrapper no-bottom" v-if="!loading && items && !items.length">
      <dl class="review_none">
        <dd>
          <img src="@/assets/img/common/img_no_data.png" alt="">
        </dd>
        <dt>
          作成したレビューがありません。
        </dt>
      </dl>
    </div>
    <mugen-scroll :handler="pageDown" :should-handle="showMugen" :offsetTop="100" v-if="items && items.length">
      <div id="loader" v-show="showMugen">
        <div class="loader_img"></div>
      </div>
    </mugen-scroll>
    <!-- ↑↑↑↑↑ review_list-wrapper ↑↑↑↑↑ -->
    <template v-if="isShow">
      <ReviewImgPopup ref="imgPopup" :images="images" :initialSlide="initialSlide" @close="close"></ReviewImgPopup>
    </template>
    <!-- <ReviewPop :mode="'EDIT'" :isShow="isShowReviewPop" :review="currentReview" @closePop="isShowReviewPop=false" ref="reviewPop"></ReviewPop> -->
  </div>
</template>
<script>
import MoreView from '@/components/common/MoreView.vue'
import { mapState, mapGetters } from 'vuex'
import { optionFormat } from '@/utils/StringUtils'
import MugenScroll from '@/components/common/MugenScroll'
import ReviewImgPopup from '@/components/common/ReviewImgPopup'
import { dateFormatStrContainIOS } from '@/utils/dateUtils'
import { Confirm } from '@/components/common/modal'

export default {
  name: 'Reviewed',
  data () {
    return {
      currentPage: 1,
      isShow: false,
      currentReview: null,
      images: [],
      initialSlide: 0,
      isShowReviewPop: false
    }
  },
  components: {
    MugenScroll,
    ReviewImgPopup,
    MoreView
    // ReviewPop
  },
  computed: {
    ...mapGetters('review', ['profileProductReviews']),
    ...mapState('review', ['loading']),
    ...mapState('profile', ['profile']),
    items () {
      if (this.profileProductReviews && this.profileProductReviews.length) {
        return this.profileProductReviews
      } else {
        return []
      }
    },
    totalCount () {
      if (this.profileProductReviews) {
        return this.profileProductReviews.totalCount
      } else {
        return 0
      }
    },
    showMugen () {
      return this.profileProductReviews && this.profileProductReviews.length < this.totalCount
    }
  },
  methods: {
    optionFormat,
    formatData (str) {
      return dateFormatStrContainIOS(str, 'yyyy.MM.dd')
    },
    pageDown () {
      this.$store.dispatch('review/fetchMoreMyReviews')
    },
    editReview (review) {
      // this.isShowReviewPop = true
      // this.currentReview = review
      // this.$refs.reviewPop.setPopupData(review)
      this.$store.commit('review/SET_CURRENTREVIEW', review)
      this.$router.push('/m/mypage/myreview/addreview/' + review.reviewNo)
    },
    close () {
      this.isShow = false
      this.images = []
      this.initialSlide = 0
    },
    openImagePop (images, index) {
      this.images = images
      this.initialSlide = index + 1
      this.isShow = true
    },
    delReview (productNo, reviewNo) {
      Confirm({
        message: 'レビューを削除すると、修復または再構築することができません。<br>削除しますか？'
      }).then((result) => {
        if (result) this.$store.dispatch('review/deleteProductReviews', { productNo, reviewNo })
      })
    }
  }
}
</script>
