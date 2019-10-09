<template>
  <div id="container" class="login">
    <div class="email-wrapper" style="display: block;">
      <div class="email-password">
        <h1><img src="~@/assets/img/login/img_line_logo.png" alt=""></h1>
        <div class="email-content">
          <h2>パスワード再設定</h2>
          <dl class="password-success">
            <dt><img src="~@/assets/img/login/img_email_over.png" alt=""></dt>
            <dd>新しいパスワードを<br>登録いたしました。</dd>
          </dl>
          <button class="btn btn_green" @click.prevent="goLogin">ログイン</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    goLogin () {
      this.$router.push({ path: '/member/login' })
    }
  }
}
</script>
