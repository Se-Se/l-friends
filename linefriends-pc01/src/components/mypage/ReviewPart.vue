<template>
  <section class="section_area">
    <h2>レビュー履歴</h2>
    <div class="con_area">
      <ul class="evaluate" v-if="profileProductReviews && totalCount>0 ">
        <li v-for="(review,index) in profileProductReviews.slice(0, 3)" :key="index" @click.prevent="$router.push('/mypage/myreview/reviewed')" style="cursor: pointer;">
          <div class="review_info_min">
            <span class="review_score">
              <span class="graph sp" :style="{width: review.rate * 20+'%'}"><strong class="blind">{{review.rate}}</strong></span>
              <span class="blind">/ 5.0</span>
            </span>
          </div>
          <div class="txt_ex ellipsis">
          <show-more-view  :stop="true" :content="review.content" />
          </div>
          <p class="other cf">
            <span class="date">{{review.registerYmdt | dateFormatStr('yyyy.MM.dd. HH:mm:ss')}}</span>
            <span class="recommend">おすすめ<i class="num">{{review.recommendCnt}}</i></span>
          </p>
        </li>
      </ul>
      <p v-if="(!profileProductReviews || totalCount<1) && !pending.profileProductReviews" class="no_info">作成したレビューがありません。</p>
    </div>
    <p class="more">
      <a href="#" @click.prevent="$router.push('/mypage/myreview')">もっと見る</a>
    </p>
  </section>
</template>
<script>
import ShowMoreView from '@/components/goods/ShowMoreView.vue'
import { mapState } from 'vuex'

export default {
  data () {
    return {
    }
  },
  components: {
    ShowMoreView

  },
  computed: {
    ...mapState('review', ['profileProductReviews', 'totalCount', 'pending'])
  },
  methods: {
  }
}
</script>
