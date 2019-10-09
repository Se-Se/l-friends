<template>
  <span>
    <div class="table-list">
      <div class="table-list--header">
        <h2 class="table-list--header__title">상품평쓰기</h2>
      </div>
    </div>
    <div class="table_wrap">
      <table class="table review-table" v-if="productReviewable && productReviewable.length > 0">
        <colgroup>
          <col style="width: 966px">
          <col style="width: 214px">
        </colgroup>
        <tbody>
          <tr v-for="(order,index) in productReviewable" :key="index">
            <td>
              <router-link :to="`/goods/detail/${order.productNo}`" class="item_info">
                <div class="table-item table-item__left">
                  <figure class="table__fig review-table__fig">
                    <img :src="order.imageUrl" width="80" height="80" alt="상품 썸네일">
                  </figure>
                  <div class="table--info">
                    <h2 class="table--info__title review-table__title">
                      <template v-if="order.brandName">
                        {{(order.productName) | wordsFormat(100)}}
                      </template>
                      <template v-else>
                        {{order.productName | wordsFormat(100)}}
                      </template>
                    </h2>
                    <span class="table--info__value">
                      {{optionFormat(order.optionUsed, order.optionType, order.optionName, order.optionValue, order.inputs, order.price.addPrice, order.orderCnt)}}
                    </span>
                  </div>
                </div>
              </router-link>
            </td>
            <td>
              <!-- [D] 배경색 들어간 버튼 : .tbl_btn에 btn_color 클래스 추가 -->
              <AddReview :review="order"></AddReview>
            </td>
          </tr>
        </tbody>
      </table>
      <table v-else class="table review-table">
        <tbody>
          <tr>
            <td class="none">
              <div class="table-nodata">
                  <figure class="table-nodata__fig">
                    <img src="~@/assets/images/pc/icons/ic-nodata79x100.png">
                  </figure>
                  <div class="table-nodata--info">
                    <h2 class="table-nodata--info__title">
                        작성 가능한 상품평이 없습니다.
                    </h2>
                  </div>
                </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination-interval">
      <pagination class="mt-3" v-model="page" :total="totalCount || 1" :limit="20" @change="pageChange" ref="pagination" />
    </div>
  </span>
</template>
<script>
import AddReview from './leaf/AddReviewNew'
import MyReviewableNew from '@/components/mixins/mypage/review/MyReviewableNew'
export default {
  mixins: [MyReviewableNew],
  components: {
    AddReview
  },
  data () {
    return {
      page: 1
    }
  }
}
</script>
