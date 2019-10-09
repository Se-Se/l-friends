<template>
  <div class="table-list">
    <template>
      <div class="table-list--header">
        <h2 class="table-list--header__title">내가 쓴 상품평</h2>
      </div>
      <div class="table_wrap">
        <table v-if="profileProductReviews &&  profileProductReviews.length > 0" class="table review-table">
          <tbody>
            <template v-for="(review,index) in profileProductReviews">
              <tr :key="`review_${index}`">
                <td class="item_wrap">
                  <router-link :to="`/goods/detail/${review.productNo}`" class="item_info">
                    <div class="table-item table-item__left">
                      <figure class="table__fig review-table__fig">
                        <img :src="review.imageUrl" width="80" height="80" alt="상품 썸네일">
                      </figure>
                      <div class="table--info">
                        <h2 class="table--info__title review-table__title review-table__ellipse review-table__cursor-pointer">
                          <template v-if="review.brandName">
                            {{(review.productName) | wordsFormat(132)}}
                          </template>
                          <template v-else>
                            {{review.productName | wordsFormat(132)}}
                          </template>
                        </h2>
                        <span class="table--info__value">
                          {{optionFormat(review.orderedOption.optionUsed, review.orderedOption.optionType, review.orderedOption.optionName, review.orderedOption.optionValue, review.orderedOption.inputs, review.orderedOption.addPrice, review.orderedOption.orderCnt)}}
                        </span>
                      </div>
                    </div>
                  </router-link>
                </td>
              </tr>
              <tr :key="`myreview_${index}`">
                <td>
                  <div class="lst_review my-review-new">
                    <div class="review_info">
                      <span class="review_score">
                        <span class="graph sp" :style="{width: review.rate * 20+'%'}">
                          <strong class="blind">{{review.rate}}</strong>
                        </span>
                        <span class="blind">/ 5.0</span>
                      </span>
                    </div>
                    <div class="bx_review">
                      <MoreView :content="review.content"></MoreView>
                    </div>
                    <!-- <div class="review-list__imgs">
                      <ul>
                        <li
                          v-for="( image, index ) in review.fileUrls"
                          :key="index"
                        >
                          <img :src="image" />
                        </li>
                      </ul>
                    </div> -->
                    <ImageGallery :images="review.fileUrls"></ImageGallery>
                    <p class="member_data">
                      <span class="name num" v-if="profile && profile.email">{{profile.email}}</span>
                      <span class="date num">{{review.registerYmdt.split(' ')[0].replace(/-/g,'.')}}</span>
                    </p>
                    <div class="rec_btn">
                      <div class="bx_btn">
                        <!-- [D] 버튼 활성화 시 button class="on" 추가 -->
                        <span>
                          <AddReview :review="review" :mode="'MODIFY'"></AddReview>
                        </span>
                        <span>
                          <button type="button" class="white-button review btn_horizontal" @click="deleteReview(review.productNo, review.reviewNo)">
                            삭제
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <table v-else class="table-contact contact">
          <tbody>
            <tr>
              <td class="none" colspan="5" style="cursor: default;">
                <div class="table-nodata">
                  <figure class="table-nodata__fig">
                    <img src="~@/assets/images/pc/icons/ic-nodata79x100.png">
                  </figure>
                  <div class="table-nodata--info">
                    <h2 class="table-nodata--info__title">
                      작성한 상품평이 없습니다.
                    </h2>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <div class="pagination-interval">
      <pagination class="mt-3" v-model="page" :total="totalCount || 1" :limit="20" @change="pageChange" ref="pagination" />
    </div>
  </div>
</template>
<style scoped>
.mypage .lst_review .review_info {
  padding-left: 0;
}
</style>
<style scoped>
.bx_review pre {
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  padding: 0;
  cursor: default;
}
.table-item .table-item__left {
  cursor: default;
}
.item_wrap .item_info {
  cursor: pointer;
}
.lst_review .my-review-new {
  cursor: default;
}
.review_info {
  cursor: default;
}
.thumbnail .itemcard_type {
  cursor: default;
}
</style>
<script>
import AddReview from './leaf/AddReviewNew'
import MyReviewsNew from '@/components/mixins/mypage/review/MyReviewsNew'

export default {
  mixins: [MyReviewsNew],
  components: {
    AddReview
  }
}
</script>


