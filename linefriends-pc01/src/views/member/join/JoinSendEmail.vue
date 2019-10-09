<template>
  <div id="container" class="login">
    <div class="wrap">
      <bread-crumbs breadCrumbs="会員登録"/>
      <div class="password-wrapper">
        <h2>会員登録</h2>
        <dl class="password-success">
          <dt><img src="../../../assets/img/login/img_password_success.png" alt=""></dt>
          <dd><strong>{{memberId}}</strong>に<br>本人確認メールを送付いたしました。</dd>
        </dl>
        <p class="password-time">24時間以内に確認をお済ませください。</p>
        <ul class="password-btn">
          <li><button @click="goHome" class="btn btn_green">トップページへ戻る</button></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import BreadCrumbs from '@/components/common/BreadCrumbs'
export default {
  components: {
    BreadCrumbs
  },
  methods: {
    goHome () {
      this.$router.replace({ path: '/' })
    }
  },
  computed: {
    memberId () {
      return this.$route.query.email
    }
  }
}
</script>
