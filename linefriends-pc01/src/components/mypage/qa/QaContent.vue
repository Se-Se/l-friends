<template>
  <div class="mypage-content">
    <h1>商品お問い合わせ履歴</h1>

    <!-- QaList -->
    <qa-list v-if="qaList && totalCount > 0" :qaList="qaList"/>
    <!-- QaList -->
    <!-- PageSlide -->
    <pagination v-if="qaList && totalCount > 0" class="qa_area_page_margin" v-model="page" :total="totalCount" :limit="currentPageSize" :size="10" @input="onMovePage" />
    <!-- PageSlide -->
    <div v-if="(!qaList || totalCount < 1) && !pending.qaList" class="qa_area">
      <div class="table_wrap">
        <div class="table_data qa_1_none">
          <div class="qa_1_img_none">
            <img src="@/assets/img/order/img_none.png" alt="">
          </div>
          <p class="qa_1_text_none">作成したお問い合わせがありません。</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Pagination from '@/components/common/Pagination'
import QaList from '@/components/mypage/qa/QaList'

export default {
  data () {
    return {
      page: this.currentPage
    }
  },
  props: ['cuponTab'],
  components: {
    Pagination,
    QaList
  },
  computed: {
    ...mapState('mypage', ['qaList', 'totalCount', 'currentPage', 'currentPageSize', 'pending'])
  },
  methods: {
    ...mapActions('mypage', ['fetchQAPage', 'setCurrentPageNo']),
    onMovePage () {
      this.setCurrentPageNo(this.page)
      this.fetchQAPage(this.page)
    }
  }
}
</script>
