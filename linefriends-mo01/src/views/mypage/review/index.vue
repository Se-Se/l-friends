<template>
  <div class="exist">
    <div id="container" class="review_list">
      <Breadcrumb :title="'レビュー履歴'"></Breadcrumb>
      <div class="review_list-wrapper_menu">
        <!-- ↓↓↓↓↓ menu_wrap ↓↓↓↓↓ -->
        <div class="menu_wrap">
          <ul class="nav_menu">
            <li :class="{'active': $route.name === 'Myreview' }">
              <router-link to="/m/mypage/myreview">レビューを書く</router-link>
            </li>
            <li :class="{'active': $route.name === 'Reviewed' }">
              <router-link to="/m/mypage/myreview/reviewed">あなたのレビュー</router-link>
            </li>
          </ul>
        </div>
        <!-- ↑↑↑↑↑ menu_wrap ↑↑↑↑↑ -->
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import Breadcrumb from '@/components/common/Breadcrumb'

export default {
  name: 'MyreivewIndex',
  components: {
    Breadcrumb
  }
}
</script>
