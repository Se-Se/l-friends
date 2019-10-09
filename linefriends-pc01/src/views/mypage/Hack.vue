<template>
  <div id="container" class="mypage">
    <!-- order detial -->
    <div class="wrap">

      <!-- ↓↓↓↓↓ wrap_category ↓↓↓↓↓ -->
      <BreadCrumbs :breadCrumbs="'退会'"></BreadCrumbs>
      <!-- ↑↑↑↑↑ wrap_category ↑↑↑↑↑ -->

      <!-- ↓↓↓↓↓ mypage-content ↓↓↓↓↓ -->
      <div class="mypage-content">
        <h1>退会</h1>
        <div class="profile-edit">
          <div class="retire_info_area">
            <div class="retire_info_con">
              <h3>サービスへのご意見をお聞かせてください。</h3>
              <p class="pb-30">ショッピングモールより発送するメルマガは<router-link to="/mypage/profile" class="link_blue">マイページ &gt; 会員情報修正</router-link>メニューで配信停止をすることができます。
              </p>
              <h3>退会時の注意事項</h3>
              <p>会員を脱退すると、会員専用サービスの利用はできません。また保有しているクーポンなど、会員専用のメリットは失効し、元に戻すことはできません。<br>
                注文履歴がある場合、電子商取引などの消費者保護に関する法令により契約、又は誓約撤回に関する記録、代金決済及び財貨などの供給に関する記録は退会後5年間保存いたします。<br>
                <span class="important_info">お問い合わせを利用した記録のある場合、電子商取引などの消費者保護に関する法令により、消費者の苦情、又は紛争処理に関する記録は退会後3年間保存いたします。</span><br>
                退会完了の際、個人情報は削除いたしますが、会員の時に作成した商品に関するお問い合わせ及び評価コメントは削除いたしません。商品に関するお問い合わせ及び評価コメントの<br>
                削除のご希望の方は、まず書き込みを削除した上、退会手続きに進んでください。<br>
                退会後、同じユーザーIDを利用して再登録するためには1週間がかかります。商品の購入手続きが完了されていない場合、退会手続きによる不利益は一切責任を負いませんので、ご了<br>
                承ください。</p>
            </div>
          </div>
          <div>
            <h3>退会に当たりご意見をご入力ください。<span class="color_grey">（選択）</span></h3>
            <div class="bx_write">
              <textarea placeholder="ご意見をご入力ください。" v-model="opinion"></textarea>
            </div>
            <div class="label_combo">
              <span class="bx_input">
                <input id="personal-5" type="checkbox" v-model="agree">
                <label for="personal-5">"save_id"</label>
                <label class="txt_2" for="personal-5">注意事項を確認いたしました。</label>
              </span>
            </div>
          </div>
          <ul class="retire_btn_combo">
            <li class="w-176 mr-8">
              <button class="btn" @click.prevent="goProfile">キャンセル</button>
            </li>
            <li class="w-176">
              <button class="btn btn_green" @click.prevent="submit">退会</button>
            </li>
          </ul>
        </div>
      </div>
      <!-- ↑↑↑↑↑ mypage-content ↑↑↑↑↑ -->
    </div>
    <!-- ↑↑↑↑↑ wrap ↑↑↑↑↑ -->

  </div>
</template>
<script>
import BreadCrumbs from '@/components/common/BreadCrumbs'
import { mapState } from 'vuex'
import { Alert } from '@/components/common/modal'
export default {
  components: {
    BreadCrumbs
  },
  data () {
    return {
      agree: false,
      opinion: ''
    }
  },
  computed: {
    ...mapState('common', ['malls'])
  },
  methods: {
    goProfile () {
      this.$router.go(-1)
    },
    submit () {
      if (!this.agree) {
        Alert('注意事項を確認してください。')
        return false
      }
      this.$store.dispatch('profile/delProfile', {
        reason: this.opinion
      }).then((response) => {
        Alert(this.malls.mall.mallName + 'から退会されました。ご利用頂きありがとうございました。').then(() => {
          this.$store.dispatch('authentication/logoutToLogin')
        })
      })
    }
  }
}
</script>
