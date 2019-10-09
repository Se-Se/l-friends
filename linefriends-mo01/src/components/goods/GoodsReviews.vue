<template>
  <div>
    <template v-if="productReviews && productReviews.totalCount > 0">
      <div class="btn_write_area">
        <p class="btn_write">
          <button class="btn btn_primary size_m" @click="handleCheckLogin">レビューを登録する</button>
        </p>
        <ul>
          <li>
            <button class="btn size_s btn_radius gray " :class="{checked:orderBy === 'RECOMMEND'}" @click.prevent="changeOrderBy('RECOMMEND')">おススメ順</button>
          </li>
          <li>
            <button class="btn size_s btn_radius gray" :class="{checked:orderBy === 'REGISTER_YMDT'}" @click.prevent="changeOrderBy('REGISTER_YMDT')">新着順</button>
          </li>
        </ul>
      </div>
      <div class="evaluate review_area">
        <ul>
          <review-item v-for="(review, key) in productReviews.items" :key="key" :review="review" />
        </ul>
        <template v-if="productReviews">
          <mugen-scroll :handler="reviewList" :should-handle="showMugen && !pending.productReviews">
            <div id="loader" v-show="showMugen">
              <div class="loader_img"></div>
            </div>
          </mugen-scroll>
        </template>
      </div>
    </template>
    <template v-else-if="!pending.productReviews">
      <div class="detail-wrap-content">
        <div class="detail-select-product-list">
          <div class="detail-select-no-data">
            <img src="@/assets/img/common/img_error.png" alt="" class="detail-select-no-data-img">
            <p class="detail-select-no-data-txt"> レビューがございません。</p>
            <div class="btn_regist" style="display: block">
              <button class="btn btn_primary ico_regist size_xs" @click="handleCheckLogin">レビューを登録する</button>
            </div>
          </div>
        </div>
      </div>
    </template>

  </div>
</template>
<script>
import ReviewItem from '@/components/goods/ReviewItem.vue'
import { mapState, mapMutations } from 'vuex'
import { isLogin } from '@/utils/utils'
import Vue from 'vue'
import MugenScroll from '@/components/common/MugenScroll'

export default {
  name: 'detailReview',
  components: {
    ReviewItem,
    MugenScroll
  },
  data () {
    return {
      page: this.$router.currentRoute.params.page || 1,
      orderBy: 'RECOMMEND', // REGISTER_YMDT
      query: {
        productNo: this.$route.params.goodsNo,
        pageNo: 1,
        pageSize: 5,
        orderBy: 'RECOMMEND'
      },
      reviewAdd: {
        action: 'button',
        width: 141,
        height: 40,
        font: 14,
        title: 'レビューを登録する'
      }
    }
  },
  watch: {
    query: {
      handler (next, prev) {
        if (prev) {
          if (next.orderBy !== prev.orderBy) {
            Vue.set(this.query, 'pageNo', 1)
          } else {
            this.fetch()
          }
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapState('product', ['currentTabIndex']),
    ...mapState('review', ['productReviews', 'pending']),
    checkLogin () {
      return isLogin()
    },
    showMugen () {
      return this.productReviews && this.productReviews.items && this.productReviews.items.length < this.productReviews.totalCount
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    ...mapMutations('review', ['RESET_REVIEWS_ITEM']),
    reviewList () {
      if (this.productReviews) {
        let maxPage = Math.ceil(this.productReviews.totalCount / 5)
        if (this.page >= maxPage) {
          return false
        } else {
          this.page = this.page + 1
          this.query.pageNo = 1
          this.query.pageSize = this.page * 5
          this.$store.dispatch('review/fetchProductReviews', this.query)
        }
      }
    },
    handleCheckLogin () {
      if (isLogin()) {
        this.$router.push('/m/mypage/myreview')
      } else {
        this.$router.push({
          path: '/m/member/login',
          query: {
            redirect: '/m/mypage/myreview'
          }
        })
      }
    },
    init () {
      this.query.pageNo = 1
      this.query.orderBy = 'RECOMMEND'
      this.fetch()
    },
    changeOrderBy (ordered) {
      this.orderBy = ordered
      if (this.query.orderBy !== ordered) {
        this.query.orderBy = ordered
        this.query.pageNo = 1
      }
      this.RESET_REVIEWS_ITEM()
      this.fetch()
    },
    fetch () {
      this.$store.dispatch('review/fetchProductReviews', this.query)
    }
  }
}
</script>
