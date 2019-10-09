<template>
  <div class="mypage-menu">
    <div class="mypage-review">
      <ul class="mypage-review__wrap">
        <li
          :class="{
            'mypage-review__item':true,
            'active': $router.name === 'MyReviewable'
          }"
        >
          <router-link to="/mypage/myreview">상품평쓰기</router-link>
        </li>
        <li
          :class="{
            'mypage-review__item':true,
            'active': $router.name === 'MyReviews'
          }"
        >
          <router-link to="/mypage/myreview/myreviews">내가 쓴 상품평</router-link>
        </li>
      </ul>
    </div>
    <router-view></router-view>
  </div>
</template>
<style scoped>
#container.mypage .menu_wrap {
  margin-top: 0;
}
</style>
