<template>
  <div id="container" class="login">
    <Breadcrumb :title="'パスワード再設定'"></Breadcrumb>
    <!-- ↓↓↓↓↓ 비밀번호 재설정 ↓↓↓↓↓ -->
    <div class="login-wrapper login-psw-wrapper">
      <div class="password-wrapper pt-0">
        <dl class="password-success mt-60">
          <dt><img src="../../assets/img/common/img4_2x.png" alt=""></dt>
          <dd><strong>{{$route.query.email}}</strong>に<br>メールを送付いたしました。 </dd>
        </dl>
        <p class="password-time">セキュリティー保護のため、<br>メール内のボタンをクリックしてパスワード<br>再設定いたします。</p>
        <ul class="password-btn">
          <li><button class="btn btn_green password_btn" @click.prevent="$router.push({ path: '/m' })">トップページへ戻る</button></li>
        </ul>
      </div>
    </div>
    <!-- ↑↑↑↑↑ 비밀번호 재설정 ↑↑↑↑↑ -->
  </div>
</template>
<script>
import Breadcrumb from '@/components/common/Breadcrumb'
export default {
  data () {
    return {}
  },
  components: {
    Breadcrumb
  }
}
</script>
