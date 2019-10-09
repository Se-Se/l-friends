<template>
  <div class="review-content">
    <!-- ↓↓↓↓↓ table_info ↓↓↓↓↓ -->
    <div class="table_info">
      <table class="table_data">
        <colgroup>
          <col style="width: 85%">
          <col>
        </colgroup>
        <tbody>
          <tr v-for="(review,index) in items" :key="index">
            <td>
              <router-link :to="`/product/detail/${review.productNo}`" class="item_info">
                <div class="bx_thumb">
                  <div class="thumbnail">
                    <img :src="review.imageUrl">
                  </div>
                </div>
                <div class="bx_info">
                  <span class="name">
                    <template v-if="review.brandName">
                      {{(review.productName) | wordsFormat(100)}}
                    </template>
                    <template v-else>
                      {{review.productName | wordsFormat(100)}}
                    </template>
                  </span>
                  <span class="option">
                    {{optionFormat(review.optionUsed, review.optionType, review.optionName, review.optionValue, review.inputs, review.price.addPrice, review.orderCnt)}}
                  </span>
                </div>
              </router-link>
            </td>
            <td>
              <button class="btn size_s" @click="writeReview(review)">レビューを作成する</button>
            </td>
          </tr>
          <tr v-if="items && !items.length">
            <td>
              <dl class="write_none">
                <dt>
                  <img src="@/assets/img/order/img_none.png" alt="">
                </dt>
                <dd>
                  レビューを作成できる商品がありません。
                </dd>
              </dl>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- ↑↑↑↑↑ table_info ↑↑↑↑↑ -->
    <pagination v-if="items && items.length > 0" v-model="currentPage" :total="totalCount || 1" :limit="20" @change="pageChange(currentPage)" />
    <ReviewPop :isShow="isShow" :review="currentReview" @closePop="closePop"></ReviewPop>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { optionFormat } from '@/utils/StringUtils'
import Pagination from '@/components/common/Pagination'
import ReviewPop from '@/components/common/ReviewPop'

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
    ReviewPop,
    Pagination
  },
  computed: {
    ...mapGetters('review', ['productReviewable']),
    items () {
      if (this.productReviewable) {
        return this.productReviewable.items
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
    }
  },
  methods: {
    optionFormat,
    async pageChange (page) {
      this.$store.dispatch('profilereview/fetchProductReviewable', { pageNumber: page })
    },
    writeReview (review) {
      this.$store.commit('SHOW_POP')
      this.isShow = true
      this.currentReview = review
    },
    closePop () {
      this.$store.commit('CLOSE_POP')
      this.isShow = false
      this.currentReview = null
    }
  }

}
</script>
