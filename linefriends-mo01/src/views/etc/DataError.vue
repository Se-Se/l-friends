<template>
  <div>
    <div class="wrapper-sp">
      <div id="container" class="etc">
        <div class="etc-date">
          <div class="wrap_category">
              <h1><img src="@/assets/img/common/logo_lf.png" alt="" @click="goMain"></h1>
            </div>
            <div class="etc-wrapper">
              <h2>データを読み込めません。</h2>
              <dl class="check_info">
                <dt><img src="@/assets/img/common/img_error.png" alt=""></dt>
                <dd>
                  <p>
                      一時的にエラーが発生しました。 <br>
                      しばらくたってからもう一度やり直してください。
                  </p>
                </dd>
              </dl>
              <ul class="button_area turnback">
                <li class="">
                  <button class="btn btn_green" @click.prevent="goBack">再読み込み</button>
                </li>
              </ul>
            </div>
            <div class="etc-footer">
              <span class="txt_jp_font">CopyrightⓒLINE FRIENDS Corp.All Rights Reserved.</span>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  name: 'dataError',
  methods: {
    goBack () {
      this.$router.back()
    },
    goMain () {
      this.$router.push('/')
    }
  }
}
</script>
