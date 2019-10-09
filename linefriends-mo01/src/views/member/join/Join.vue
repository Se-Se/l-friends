<template>
  <!-- ↓↓↓↓↓ container ↓↓↓↓↓ -->
  <div id="container" class="login">
    <Breadcrumb :title="'メンバーシップ規約に同意'"></Breadcrumb>
    <!-- ↓↓↓↓↓ login-wrapper ↓↓↓↓↓ -->
    <div class="login-wrapper login-psw-wrapper">
      <div class="member-layout">
        <div class="table-grid">
          <div class="table-grid__left">
            <span class="bx_input size_l">
              <input id="input1" type="checkbox" :checked="agreeAll" @click="clickAgreeAll()" />
              <label for="input1">規約への同意</label>
            </span>
          </div>
        </div>
        <div class="table-grid">
          <div class="table-grid__left">
            <span class="bx_input size_l">
              <input id="input2" type="checkbox" :checked="serviceAgree" @click="clickServiceAgree()" />
              <label for="input2">サービス利用約款(必須)</label>
            </span>
          </div>
          <div class="table-grid__right">
            <span><a @click="openTermService()" class="txt_1" href="#">表示</a></span>
          </div>
        </div>
        <div class="table-grid">
          <div class="table-grid__left">
            <span class="bx_input size_l">
              <input id="input3" type="checkbox" :checked="privateAgree" @click="clickPrivateAgree()" />
              <label for="input3">個人情報の取得・利用同意(必須)</label>
            </span>
          </div>
          <div class="table-grid__right">
            <span><a @click="openTermPrivate()" class="txt_1" href="#">表示</a></span>
          </div>
        </div>
        <div class="table-grid">
          <div class="table-grid__left">
            <span class="bx_input size_l">
              <input @click="clickMarketAgree()" id="input4" type="checkbox" :checked="marketAgree" />
              <label for="input4">広告の受信同意(選択)</label>
            </span>
          </div>
        </div>
        <div class="table-grid">
          <div class="table-grid__left">
            <span class="bx_input size_l">
              <input id="input5" type="checkbox" v-model="adultAgree" />
              <label for="input5">満14歳以上です。(必須)</label>
            </span>
          </div>
        </div>
      </div>
      <p v-if="error.agree" class="error-info">必須項目にチェックしてください</p>
      <button class="btn btn_green fixed_btn" @click="next()">次へ</button>
    </div>
    <!-- ↑↑↑↑↑ login-wrapper ↑↑↑↑↑ -->
    <Term-service v-if="serviceShow" @closeTermService="closeTermService"></Term-service>
    <Term-private v-if="privateShow" @closeTermPrivate="closeTermPrivate"></Term-private>
  </div>
  <!-- ↑↑↑↑↑ container ↑↑↑↑↑ -->
</template>
<script>
import Breadcrumb from '@/components/common/Breadcrumb'
import TermService from '@/components/member/join/TermService'
import TermPrivate from '@/components/member/join/TermPrivate'
export default {
  data () {
    return {
      error: {},
      agreeAll: false,
      serviceAgree: null,
      privateAgree: null,
      marketAgree: null,
      adultAgree: null,
      serviceShow: false,
      privateShow: false
    }
  },
  components: {
    Breadcrumb,
    TermService,
    TermPrivate
  },
  methods: {
    openTermService () {
      this.serviceShow = true
    },
    openTermPrivate () {
      this.privateShow = true
    },
    closeTermService () {
      this.serviceShow = false
    },
    closeTermPrivate () {
      this.privateShow = false
    },
    next () {
      if (!this.validationAgree()) return false
      this.$router.push('/m/member/joinpage?marketAgree=' + this.marketAgree)
    },
    clickAgreeAll () {
      this.agreeAll = !this.agreeAll
      if (this.agreeAll) {
        this.serviceAgree = true
        this.privateAgree = true
        this.marketAgree = true
      } else {
        this.serviceAgree = false
        this.privateAgree = false
        this.marketAgree = false
      }
    },
    clickServiceAgree () {
      this.serviceAgree = !this.serviceAgree
      this.initAllAgree()
    },
    clickPrivateAgree () {
      this.privateAgree = !this.privateAgree
      this.initAllAgree()
    },
    clickMarketAgree () {
      this.marketAgree = !this.marketAgree
      this.initAllAgree()
    },
    initAllAgree () {
      if (this.serviceAgree && this.privateAgree && this.marketAgree) {
        this.agreeAll = true
      } else {
        this.agreeAll = false
      }
    },
    validationAgree () {
      if (!this.serviceAgree || !this.privateAgree || !this.adultAgree) {
        this.error = {
          agree: true
        }
        return false
      }
      this.error = {
        agree: ''
      }
      return true
    }
  }
}
</script>
