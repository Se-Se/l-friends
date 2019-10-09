<template>
  <div>
    <!-- ↓↓↓↓↓ wrapper-sp ↓↓↓↓↓ -->
    <div class="wrapper-sp">
      <!-- ↓↓↓↓↓ container ↓↓↓↓↓ -->
      <div id="container" class="etc">
        <!-- ↓↓↓↓↓ 점검설명 ↓↓↓↓↓ -->
        <div class="checking">
          <div class="wrap_category">
            <h1><img src="@/assets/img/common/logo_lf.png" alt="" @click="goMain"></h1>
          </div>
          <div class="etc-wrapper">
            <h2>ただいまメンテナンス中です。</h2>
            <dl class="check_info">
              <dt><img src="@/assets/img/common/img_error.png" alt=""></dt>
              <dd class="font-size-1">
                <p>お客様により快適にサービスをご利用いただくため、
                  ただいまメンテナンスを実施しております。</p>
                <p>お客様には大変ご不便をおかけいたしますが、<br>
                  何卒ご理解いただきますようお願い申し上げます。</p>
              </dd>
            </dl>

            <div class="check_detail">
              <div class="check_detail_con">
                <div class="check_detail_tt">メンテナンス時間</div>
                <div class="check_detail_cc">2019年 06月 05(水) 午前 0時 ~</div>
                <div class="check_detail_cc">2019年 06月 05(水) 午前 6時まで</div>

                <div class="check_detail_tt">メンテナンス内容</div>
                <div class="check_detail_cc">システムアップグレードの点検作業</div>

                <div class="check_detail_tt">お問い合わせ</div>
                <div class="check_detail_cc fw-normal">1544-5921</div>

                <div class="check_detail_tt">お問い合わせメール</div>
                <div class="check_detail_cc fw-normal">customercare@linefriends.com</div>
              </div>
            </div>

          </div>
          <div class="etc-footer">
            <span class="txt_jp_font">CopyrightⓒLINE FRIENDS Corp.All Rights Reserved.</span>
          </div>
        </div>
        <!-- ↑↑↑↑↑ 점검설명 ↑↑↑↑↑ -->
      </div>
      <!-- ↑↑↑↑↑ container ↑↑↑↑↑ -->
    </div>
    <!-- ↑↑↑↑↑ wrapper-sp ↑↑↑↑↑ -->
  </div>
</template>
<script>
export default {
  methods: {
    goMain () {
      this.$router.push('/')
    }
  }
}
</script>
