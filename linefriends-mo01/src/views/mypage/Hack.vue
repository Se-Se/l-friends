<template>
  <div id="container" class="qa">
    <Breadcrumb :title="'退会'"></Breadcrumb>
    <!-- ↓↓↓↓↓ qa_wrapper ↓↓↓↓↓ -->
    <div class="qa_wrapper">
      <ul class="qa_list">
        <li>
          <div class="qa-div">
            <p class="qa-name">サービスへのご意見をお聞かせてく<br>
              ださい。</p>
            <div class="qa_list-content">
              <p class="qa-out-info">
                ショッピングモールより発送するメルマガは<router-link to="/m/mypage/profile" class="link_blue">マイページ＞会員情報修正</router-link>メニューで配信停止をすることができます。
              </p>
            </div>
          </div>
        </li>
        <li>
          <div class="qa-div">
            <p class="qa-name">退会時の注意事項</p>
            <div class="qa_list-content">
              <p>会員を脱退すると、会員専用サービスの利用はできません。また保有しているクーポンなど、会員専用のメリットは失効し、元に戻すことはできません。
              </p>
              <p>
                注文履歴がある場合、電子商取引などの消費者保護に関する法令により契約、又は誓約撤回に関する記録、代金決済及び財貨などの供給に関する記録は退会後5年間保存いたします。
              </p>
              <p>
                お問い合わせを利用した記録のある場合、電子商取引などの消費者保護に関する法令により、消費者の苦情、又は紛争処理に関する記録は退会後3年間保存いたします。
              </p>
              <p>
                退会完了の際、個人情報は削除いたしますが、会員の時に作成した商品に関するお問い合わせ及び評価コメントは削除いたしません。商品に関するお問い合わせ及び評価コメントの削除のご希望の方は、まず書き込みを削除した上、退会手続きに進んでください。
              </p>
              <p>
                退会後、同じユーザーIDを利用して再登録するためには1週間がかかります。商品の購入手続きが完了されていない場合、退会手続きによる不利益は一切責任を負いませんので、ご了承ください。
              </p>

              <p class="checkbox_area">
                <span class="bx_input size_l">
                  <input id="personal-5" type="checkbox" v-model="agree">
                  <label for="personal-5">注意事項を確認いたしました。</label>
                </span>
              </p>
            </div>
          </div>
        </li>
        <li>
          <div class="qa-div">
            <p class="qa-name">退会に当たりご意見をご入力ください。(選択)</p>
            <div class="qa_list-content">
              <div class="bx_write">
                <textarea placeholder="ご意見をご入力ください。" maxlength="1000" v-model="opinion"></textarea>
              </div>
            </div>
            <div class="btn-area">
              <button class="btn" @click.prevent="goProfile">キャンセル</button>
              <button class="btn btn_green" @click.prevent="submit">退会</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- ↑↑↑↑↑ qa_wrapper ↑↑↑↑↑ -->
  </div>
</template>
<script>
import Breadcrumb from '@/components/common/Breadcrumb'
import { mapState } from 'vuex'
import { Alert } from '@/components/common/modal'
export default {
  components: {
    Breadcrumb
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
