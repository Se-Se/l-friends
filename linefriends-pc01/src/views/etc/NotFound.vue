<template>
  <!-- ↓↓↓↓↓ wrapper-pc ↓↓↓↓↓ -->
  <div class="wrapper-pc">

    <!-- ↓↓↓↓↓ container ↓↓↓↓↓ -->
    <div id="container" class="etc">

      <!-- ↓↓↓↓↓ not found 404 ↓↓↓↓↓ -->
      <div class="etc-wrapper" style="display: block;">
        <div class="etc-notfound">
          <h1><img src="@/assets/img/common/logo_lf.png" alt="" @click="goHome"></h1>
          <div class="etc-content">
            <h2>ページが見つかりません。</h2>
            <dl class="notfound_info">
              <dt><img src="@/assets/img/common/img_error.png" alt=""></dt>
              <dd>URLが間違っているか、移動または削除された可能性があります。<br>
                入力したURLを再確認してください。<br>
                プロモーションページはプロモーション終了後に削除させていただく場合がございます。</dd>
            </dl>
            <ul class="list_button pt-40">
              <li class="w-176">
                <button class="btn" @click.prevent="goBack">前のページ</button>
              </li>
              <li class="ml-4">
                <button class="btn btn_green" @click.prevent="goHome">トップページへ戻る</button>
              </li>
            </ul>
          </div>
        </div>
        <footer class="etc-footer">Copyright {{'ⓒ'}} LINE FRIENDS Corp. All Rights Reserved.</footer>
      </div>
      <!-- ↑↑↑↑↑ not found 404 ↑↑↑↑↑ -->

    </div>
    <!-- ↑↑↑↑↑ container ↑↑↑↑↑ -->
  </div>
  <!-- ↑↑↑↑↑ wrapper-pc ↑↑↑↑↑ -->
</template>

<script>
export default {
  name: 'Error',
  methods: {
    goBack () {
      this.$router.back()
    },
    goHome () {
      this.$router.push('/')
    }
  }
}
</script>
