<template>
  <!-- QaList -->
  <qa-list v-if="qaList && totalCount > 0"/>
  <!-- QaList -->

  <div v-else-if="(!qaList || totalCount < 1) && !pending.qaList" class="qa_wrapper qa_min-height_new">
    <div class="qa_none">
      <div class="no_data qa_new_padding">
        <div class="no_data_img"><img src="@/assets/img/common/img_no_data.png" alt=""></div>
        <p class="no_data_text no_data_text_new">作成したお問い合わせがありません。</p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import QaList from '@/components/mypage/qa/QaList'

export default {
  data () {
    return {}
  },
  props: [],
  components: {
    QaList
  },
  computed: {
    ...mapState('mypage', ['qaList', 'totalCount', 'currentPage', 'currentPageSize', 'pending'])
  }
}
</script>
