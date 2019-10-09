<template>
  <!-- ↓↓↓↓↓ container ↓↓↓↓↓ -->
  <div id="container" class="mypage">
    <!-- order detial -->
    <div class="wrap">

      <!-- ↓↓↓↓↓ wrap_category ↓↓↓↓↓ -->
      <bread-crumbs :breadCrumbs="'商品お問い合わせ履歴'"/>
      <!-- ↑↑↑↑↑ wrap_category ↑↑↑↑↑ -->

      <!-- ↓↓↓↓↓ mypage-content ↓↓↓↓↓ -->
      <qa-content />
      <!-- ↑↑↑↑↑ mypage-content ↑↑↑↑↑ -->
    </div>
    <!-- ↑↑↑↑↑ wrap ↑↑↑↑↑ -->

  </div>
</template>
<script>
import BreadCrumbs from '@/components/common/BreadCrumbs'
import QaContent from '@/components/mypage/qa/QaContent'

export default {
  data () {
    return {}
  },
  components: {
    BreadCrumbs,
    QaContent
  }
}
</script>
