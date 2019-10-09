<template>
  <!-- ↓↓↓↓↓ wrapper-pc ↓↓↓↓↓ -->
  <div class="wrapper-pc">

    <!-- ↓↓↓↓↓ container ↓↓↓↓↓ -->
    <div id="container" class="etc">

      <!-- ↓↓↓↓↓ 점검설명 ↓↓↓↓↓ -->
      <div class="etc-wrapper" style="display:block;">
        <div class="etc-checking">
          <h1><img src="@/assets/img/common/logo_lf.png" alt="" @click="goMain"></h1>
          <div class="etc-content">
            <h2>現在サービス点検中です。</h2>
            <dl class="check_info">
              <dt><img src="@/assets/img/common/img_error.png" alt=""></dt>
              <dd>お客さまにより良いサービスをご提供できるよう、只今サービス点検中です。<br>
                できるだけ早く再開できるよう最善を尽くしております。</dd>
            </dl>

            <div class="check_detail">
              <dl>
                <dt>システム点検時間</dt>
                <dd>2019年 06月 05(水) 午前 0時 ~<br>
                  2019年 06月 05(水) 午前 6時まで</dd>
              </dl>
              <dl>
                <dt>システム点検内容</dt>
                <dd>システムアップグレードの点検作業</dd>
              </dl>
              <dl>
                <dt>お客様センター</dt>
                <dd>1544-5921</dd>
              </dl>
              <dl>
                <dt>お問い合わせメール</dt>
                <dd>customercare@linefriends.com</dd>
              </dl>
            </div>

          </div>
        </div>
        <footer class="etc-footer">Copyright {{'ⓒ'}} LINE FRIENDS Corp. All Rights Reserved.</footer>
      </div>
      <!-- ↑↑↑↑↑ 점검설명 ↑↑↑↑↑ -->

    </div>
    <!-- ↑↑↑↑↑ container ↑↑↑↑↑ -->
  </div>
  <!-- ↑↑↑↑↑ wrapper-pc ↑↑↑↑↑ -->
</template>

<script>
export default {
  name: 'ServiceInspection',
  methods: {
    goMain () {
      this.$router.push(`/`)
    }
  }
}
</script>
