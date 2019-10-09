<template>
  <div id="container" class="email">
    <div class="wrap_category">
      <h1><img src="@/assets/img/common/logo_lf.png" alt=""></h1>
    </div>
    <div class="email-wrapper">
      <div class="email-password password-set">
        <div class="email-content">
          <h2>パスワード再設定</h2>
          <dl class="password-success">
            <dt><img src="~@/assets/img/login/img_email_over.png" alt=""></dt>
            <dd>新しいパスワードを<br>
              登録いたしました。</dd>
          </dl>
          <button class="btn btn_green" @click.prevent="goLogin">ログイン</button>
        </div>
      </div>
      <footer class="email-footer">
        <p class="copyRight" style="text-align: center;">Copyright ⓒ&nbsp;LINE FRIENDS Corp.&nbsp;All Rights Reserved.</p>
      </footer>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    goLogin () {
      this.$router.push({ path: '/m/member/login' })
    }
  }
}
</script>
