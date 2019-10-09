<template>
  <div id="container" class="login">
    <div class="wrap_category">
      <h2>会員登録</h2>
    </div>
    <div class="login-wrapper login-psw-wrapper">
      <div class="password-wrapper pt-0">
        <dl class="password-success mt-60">
          <dt><img src="~@/assets/img/common/img4_2x.png" alt=""></dt>
          <dd><strong class="style-volte display_inline">{{memberId}}</strong><span class="respectful">に</span><br>本人確認メールを送付いたしました。</dd>
        </dl>
        <p class="password-time">24時間以内に確認をお済ませください。</p>
        <ul class="password-btn">
          <li><button @click="goHome" class="btn btn_green fixed_btn">トップページへ戻る</button></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    goHome () {
      this.$router.replace({ path: '/m' })
    }
  },
  computed: {
    memberId () {
      return this.$route.query.email
    }
  }
}
</script>
