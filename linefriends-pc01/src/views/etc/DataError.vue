<template>
  <!-- ↓↓↓↓↓ wrapper-pc ↓↓↓↓↓ -->
  <div class="wrapper-pc">

    <!-- ↓↓↓↓↓ container ↓↓↓↓↓ -->
    <div id="container" class="etc">

      <!-- ↓↓↓↓↓ dataerror ↓↓↓↓↓ -->
      <div class="dataerror"></div>
      <div class="etc-wrapper" style="display: block;">
        <div class="etc-data_error">
          <h1><img src="@/assets/img/common/logo_lf.png" alt="" @click="goMain"></h1>
          <div class="etc-content">
            <h2>データを読み込めません。</h2>
            <dl class="data_error_info">
              <dt><img src="@/assets/img/common/img_error.png" alt=""></dt>
              <dd>
                一時的にエラーが発生しました。<br>
                しばらくたってからもう一度やり直してください。<br>
              </dd>
            </dl>
            <li class="btn_area">
              <button class="btn btn_green" @click.prevent="goBack">再読み込み</button>
            </li>
          </div>
        </div>
        <footer class="etc-footer">Copyright {{'ⓒ'}} LINE FRIENDS Corp. All Rights Reserved.</footer>
      </div>
      <!-- ↑↑↑↑↑ DataError ↑↑↑↑↑ -->

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
    goMain () {
      this.$router.push(`/`)
    }
  }
}
</script>
