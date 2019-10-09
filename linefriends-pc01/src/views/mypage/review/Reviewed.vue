<template>
  <div class="review-content">
    <!-- ↓↓↓↓↓ table_info ↓↓↓↓↓ -->
    <div class="table_info">
      <table class="table_data">
        <colgroup>
          <col style="width: 85.8%">
          <col>
        </colgroup>
        <tbody>
          <tr v-for="(review,index) in profileProductReviews" :key="`review_${index}`">
            <td>
              <router-link :to="`/product/detail/${review.productNo}`" class="item_info">
                <div class="bx_thumb">
                  <div class="thumbnail">
                    <img :src="review.imageUrl">
                  </div>
                </div>
                <div class="bx_info">
                  <span class="name w-600">
                    <template v-if="review.brandName">
                      {{(review.productName) | wordsFormat(132)}}
                    </template>
                    <template v-else>
                      {{review.productName | wordsFormat(132)}}
                    </template>
                  </span>
                  <span class="option">
                    {{optionFormat(review.orderedOption.optionUsed, review.orderedOption.optionType, review.orderedOption.optionName, review.orderedOption.optionValue, review.orderedOption.inputs, review.orderedOption.addPrice, review.orderedOption.orderCnt)}}
                  </span>
                </div>
              </router-link>
              <div class="my_review cf" :key="`myreview_${index}`">
                <div class="review_info_min">
                  <span class="review_score">
                    <span class="graph sp" :style="{width: review.rate * 20+'%'}"><strong class="blind">{{review.rate}}</strong></span>
                    <span class="blind">/ 5.0</span>
                  </span>
                </div>
                <div class="bx_review">
                     <more-view :MoreViewIsOpen="MoreViewIsOpen" :stop="true" :content="review.content" />
                </div>
                <ul class="review_pic cf">
                  <li v-for="(imageUrl, index) in review.fileUrls" :key="index">
                    <div class="thumbnail">
                      <img class="item_img" :src="imageUrl" @click="openGalleryPop(review.fileUrls, index)">
                    </div>
                  </li>
                </ul>
                <div class="member_data">
                  <span class="mail" v-if="profile && profile.nickname">{{profile.nickname.substring(0,2) + '***'}}</span>
                  <span class="date">{{review.registerYmdt | dateFormatStr('yyyy.MM.dd. HH:mm:ss')}}</span>
                </div>
                <ul class="btn-list">
                  <li>
                    <button class="btn btn_primary size_s" @click="editReview(review)">修正</button>
                  </li>
                  <li>
                    <button class="btn btn_primary size_s" @click="delReview(review.productNo, review.reviewNo)">削除</button>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
          <tr v-if="profileProductReviews && !profileProductReviews.length">
            <td>
              <dl class="write_none">
                <dt>
                  <img src="@/assets/img/order/img_none.png" alt="">
                </dt>
                <dd>
                  作成したレビューがありません。
                </dd>
              </dl>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- ↑↑↑↑↑ table_info ↑↑↑↑↑ -->
    <pagination v-if="profileProductReviews && profileProductReviews.length > 0" v-model="currentPage" :total="totalCount || 1" :limit="20" @change="pageChange(currentPage)" />
    <ReviewPop :mode="'EDIT'" :isShow="isShow" :review="currentReview" @closePop="closePop" ref="reviewPop"></ReviewPop>
    <template v-if="popupOn">
      <ReviewImgPopup ref="imgPopup" :num="theIndex" :images="popupImgs" @close="closeReview"></ReviewImgPopup>
    </template>
  </div>
</template>
<script>
import MoreView from '@/components/goods/ShowMoreView.vue'
import { mapState, mapActions } from 'vuex'
import { optionFormat } from '@/utils/StringUtils'
import Pagination from '@/components/common/Pagination'
import ReviewPop from '@/components/common/ReviewPop'
import { Confirm } from '@/components/common/modal'
import ReviewImgPopup from '@/components/common/ReviewImgPopup'
import $ from 'jquery'

export default {
  name: 'Reviewed',
  data () {
    return {
      currentPage: 1,
      isShow: false,
      currentReview: null,
      popupOn: false,
      theIndex: 0,
      popupImgs: [],
      MoreViewIsOpen: false
    }
  },
  components: {
    Pagination,
    ReviewPop,
    ReviewImgPopup,
    MoreView
  },
  computed: {
    ...mapState('profile', ['profile']),
    ...mapState('review', ['profileProductReviews', 'totalCount'])
  },
  methods: {
    ...mapActions('review', ['fetchPage']),
    optionFormat,
    async pageChange (page) {
      this.fetchPage(page)
    },
    editReview (review) {
      this.$store.commit('SHOW_POP')
      this.isShow = true
      this.currentReview = review
      this.$refs.reviewPop.setPopupData(review)
    },
    closePop () {
      this.$store.commit('CLOSE_POP')
      this.isShow = false
      this.currentReview = null
    },
    delReview (productNo, reviewNo) {
      Confirm({
        message: 'レビューを削除すると、修復または再構築することができません。削除しますか？'
      }).then((result) => {
        if (result) this.$store.dispatch('review/deleteProductReviews', { productNo, reviewNo })
      })
    },
    closeReview () {
      this.popupOn = false
      $('body').css('overflow', '')
    },
    openGalleryPop (images, index) {
      this.popupImgs = images
      this.theIndex = index + 1
      this.popupOn = true
      this.$nextTick(() => {
        this.$refs.imgPopup.swiperSlideTo(index)
      })
      $('body').css('overflow', 'hidden')
    }
  }

}
</script>
<style scoped>
.review-content >>> pre {
  white-space: pre-wrap;
}
</style>
