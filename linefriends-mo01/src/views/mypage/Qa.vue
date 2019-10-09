<template>
  <!-- ↓↓↓↓↓ container ↓↓↓↓↓ -->
  <div id="container" class="qa">
    <div class="wrap_category">
      <div class="category_left">
        <a href="#" class="btn_back" @click.prevent="goBack">Back</a>
      </div>
      <h2>商品お問い合わせ履歴</h2>
    </div>

    <!-- ↓↓↓↓↓ qa_wrapper ↓↓↓↓↓ -->
    <qa-content />
    <!-- ↑↑↑↑↑ qa_wrapper ↑↑↑↑↑ -->
  </div>
</template>
<script>
import QaContent from '@/components/mypage/qa/QaContent'

export default {
  data () {
    return {}
  },
  components: {
    QaContent
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>
