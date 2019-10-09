<template>
  <div id="container" class="mypage">
    <!-- order detial -->
    <div class="wrap">

      <!-- ↓↓↓↓↓ wrap_category ↓↓↓↓↓ -->
      <BreadCrumbs :breadCrumbs="'レビュー履歴'"></BreadCrumbs>
      <!-- ↑↑↑↑↑ wrap_category ↑↑↑↑↑ -->

      <!-- ↓↓↓↓↓ mypage-content ↓↓↓↓↓ -->
      <div class="mypage-content">
        <h1>レビュー履歴</h1>
        <div class="review">
          <div class="menu_wrap">
            <ul class="nav_menu">
              <li :class="{'active': $route.name === 'Myreview' }">
                <router-link to="/mypage/myreview">レビューを書く</router-link>
              </li>
              <li :class="{'active': $route.name === 'Reviewed' }">
                <router-link to="/mypage/myreview/reviewed">あなたのレビュー</router-link>
              </li>
            </ul>
          </div>
          <router-view></router-view>
        </div>
      </div>
      <!-- ↑↑↑↑↑ mypage-content ↑↑↑↑↑ -->
    </div>
    <!-- ↑↑↑↑↑ wrap ↑↑↑↑↑ -->
  </div>
</template>
<script>
import BreadCrumbs from '@/components/common/BreadCrumbs'

export default {
  name: 'MyreivewIndex',
  components: {
    BreadCrumbs
  }
}
</script>
