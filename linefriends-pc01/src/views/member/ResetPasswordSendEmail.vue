<template>
  <div id="container" class="login">
    <div class="wrap">
      <BreadCrumbs :breadCrumbs="'パスワード再設定'"></BreadCrumbs>
      <!-- ↓↓↓↓↓ 비밀번호 재설정 ↓↓↓↓↓ -->
      <div class="password-wrapper" style="display: block;">
        <h2>パスワード再設定</h2>
        <dl class="password-success">
          <dt><img src="../../assets/img/login/img_password_success.png" alt=""></dt>
          <dd><strong>{{$route.query.email}}</strong>に<br>メールを送付いたしました。 </dd>
        </dl>
        <p class="password-time">セキュリティー保護のため、メール内の<br>ボタンをクリックしてパスワード再設定いたします。</p>
        <ul class="password-btn">
          <li><button class="btn btn_green" @click.prevent="$router.push({ path: '/' })">トップページへ戻る</button></li>
        </ul>
      </div>
      <!-- ↑↑↑↑↑ 비밀번호 재설정 ↑↑↑↑↑ -->
    </div>
  </div>
</template>
<script>
import BreadCrumbs from '@/components/common/BreadCrumbs'
export default {
  components: {
    BreadCrumbs
  }
}
</script>
