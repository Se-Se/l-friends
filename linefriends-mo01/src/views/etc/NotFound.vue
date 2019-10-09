<template>
  <div>
    <!-- ↓↓↓↓↓ wrapper-sp ↓↓↓↓↓ -->
    <div class="wrapper-sp">
      <!-- ↓↓↓↓↓ container ↓↓↓↓↓ -->
      <div id="container" class="etc">
        <!-- ↓↓↓↓↓ not found 404 ↓↓↓↓↓ -->
        <div class="etc-notfound">
          <div class="wrap_category">
            <h1>
              <img src="@/assets/img/common/logo_lf.png" alt  @click="goHome"/>
            </h1>
          </div>
          <div class="etc-wrapper">
            <h2>ページが見つかりません。</h2>
            <dl class="check_info">
              <dt>
                <img src="@/assets/img/common/img_error.png" alt />
              </dt>
              <dd>
                <p>
                  URLが間違っているか、
                  <br>移動または削除された可能性があります。
                </p>
                <p>
                  入力したURLを再確認してください。
                  <br>プロモーションページはプロモーション終了後に削除させていただく場合がございます。
                </p>
              </dd>
            </dl>
            <ul class="button_area">
              <li class>
                <button class="btn" @click.prevent="goBack">前のページ</button>
              </li>
              <li class>
                <button class="btn btn_green" @click.prevent="goHome">トップページへ戻る</button>
              </li>
            </ul>
          </div>
          <div class="etc-footer">
            <span>Copyright ⓒ LINE FRIENDS Corp. All Rights Reserved.</span>
          </div>
        </div>
        <!-- ↑↑↑↑↑ not found 404 ↑↑↑↑↑ -->
      </div>
      <!-- ↑↑↑↑↑ container ↑↑↑↑↑ -->
    </div>
    <!-- ↑↑↑↑↑ wrapper-sp ↑↑↑↑↑ -->
  </div>
</template>

<script>
export default {
  name: 'notFound',
  methods: {
    goBack () {
      this.$router.back()
    },
    goHome () {
      this.$router.push('/m')
    }
  }
}
</script>
