<template>
  <div id="container" class="qa">
    <Breadcrumb :title="'会員情報修正'"></Breadcrumb>
    <!-- ↓↓↓↓↓ qa_wrapper ↓↓↓↓↓ -->
    <template v-if="!infoShow">
      <div class="qa_wrapper edit_wrapper_h">
        <ul class="qa_register edit">
          <li>
            <p class="title">メールアドレス(ID)</p>
            <div class="info">
              <p class="info_txt">{{profile && profile.email}}</p>
            </div>
          </li>
          <li>
            <p class="title">パスワード</p>
            <div class="info mt_8">
              <input type="password" ref="password" :class="['focus', {'error' : error.password}]" placeholder="パスワードを入力してください" v-model="password" maxlength="20" @keypress.enter="authProfile" @blur="validationCheck">
              <p class="error-info" v-if="error.password">{{error.password}}</p>
            </div>
          </li>
        </ul>
        <ul class="list_btn mt_11_8">
          <li><button class="btn" @click.prevent="goHome">キャンセル</button></li>
          <li><button class="btn btn_green" @click.prevent="authProfile">確認</button></li>
        </ul>
      </div>
    </template>
    <!-- ↑↑↑↑↑ qa_wrapper ↑↑↑↑↑ -->
    <template v-if="infoShow">
      <div class="qa_wrapper">
        <ul class="qa_register edit">
          <li>
            <p class="title">メールアドレス(ID)</p>
            <div class="info">
              <p class="info_txt">{{profileNonMasking && profileNonMasking.email}}</p>
            </div>
          </li>
          <li>
            <p class="title">ニックネーム</p>
            <div class="info mt_8">
              <input type="text" class="focus" maxlength="20" v-model="nickname">
            </div>
          </li>
          <li>
            <p class="title">パスワード変更</p>
            <div class="info" v-if="!passwordShow">
              <input class="pw_input" type="password" placeholder="" v-model="password" disabled="disable">
              <button class="btn pw_change_bt" @click.prevent="passwordShow = true">変更</button>
            </div>
            <div class="info" v-if="passwordShow">
              <div class="change-info">
                <dl class="password-change">
                  <dt>前のパスワード</dt>
                  <dd>
                    <input type="password" placeholder="" v-model="password">
                  </dd>
                </dl>
                <dl class="password-change edit_m_t_1_4">
                  <dt>新しいパスワード</dt>
                  <dd>
                    <input type="password" :class="error.password ? 'error':''" placeholder="8文字以上/英文字、数字、記号を含む" maxlength="20" v-model="changePassObj.newPassword" @keyup.enter="validationPwd" @blur="validationPwd">
                    <p class="error-info" v-if="error.newPassword">{{error.newPassword}}</p>
                  </dd>

                </dl>
                <dl class="password-change edit_m_t_1_4">
                  <dt>新しいパスワード確認</dt>
                  <dd>
                    <input type="password" :class="error.confirmPassword ? 'error':''" placeholder="パスワードをもう一度入力" maxlength="20" v-model="changePassObj.confirmPassword" @keypress.enter="editPasswordAction" @blur="validationConfirmPwd">
                    <p class="error-info" v-if="error.confirmPassword">同じパスワードを入力してください。</p>
                  </dd>
                  <dd class="btn-area">
                    <button class="btn" @click.prevent="passwordShow = false">キャンセル</button>
                    <button class="btn btn_green" @click.prevent="editPasswordAction">パスワード変更</button>
                  </dd>
                </dl>
              </div>

            </div>
          </li>
          <li>
            <p class="title">電話番号</p>
            <div class="telephone">
              <input type="text" :maxlength="contectOneLengh" v-model="myInput.contactOne" @keypress="onlyNumber" @keyup="phoneNumberCheck">
              <span>-</span>
              <input type="text" :maxlength='contactTwoLengh' required="" v-model="showContactTwo" ref="contactTwo" @keypress="onlyNumber" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
              <span>-</span>
              <input type="text" maxlength="4" required="" v-model="showContactThree" ref="contactThree" @keypress="onlyNumber" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
            </div>
          </li>
          <li>
            <p class="title">生年月日</p>
            <div class="birthday_sel mt-12">
              <input readonly="" type="text" ref="birthDate" id="birthDate" placeholder="YYYY-MM-DD">
            </div>
          </li>
          <li>
            <p class="title">SNS連携</p>
            <div class="sns-layout">
              <ul class="sns-login">
                <li :class="getConnectSns['line'] === 'ing' ? 'relieve' : ''">
                  <div class="line sns-login__action">LINE連携</div>
                  <p class="text-add text-ing" v-if="getConnectSns['line'] === 'ing'">
                    <span>連携済み</span>
                    <button class="btn btn_primary release" @click.prevent="snsConnect('line')">解除</button>
                  </p>
                  <p class="text-add" v-else @click.prevent="snsConnect('line')">連携</p>
                </li>
                <li :class="getConnectSns['facebook'] === 'ing' ? 'relieve' : ''">
                  <div class="facebook sns-login__action">Facebook連携</div>
                  <p class="text-add text-ing" v-if="getConnectSns['facebook'] === 'ing'">
                    <span>連携済み</span>
                    <button class="btn btn_primary release" @click.prevent="snsConnect('facebook')">解除</button>
                  </p>
                  <p class="text-add" v-else @click.prevent="snsConnect('facebook')">連携</p>
                </li>
                <li :class="getConnectSns['google'] === 'ing' ? 'relieve' : ''">
                  <div class="google sns-login__action">Google連携</div>
                  <p class="text-add text-ing" v-if="getConnectSns['google'] === 'ing'">
                    <span>連携済み</span>
                    <button class="btn btn_primary release" @click.prevent="snsConnect('google')">解除</button>
                  </p>
                  <p class="text-add" v-else @click.prevent="snsConnect('google')">連携</p>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <p class="title">おトクな情報の通知</p>
            <div class="e-mail_bx">
              <span class="bx_input size_l">
                <input id="personal-5" type="checkbox" v-model="notify">
                <label for="personal-5">メール</label>
              </span>
            </div>
          </li>
          <li>
            <p class="person-notes">会員情報、購入情報及びサービスに関する重要なお知らせは受信設定に関係なく配信されます。</p>
          </li>
        </ul>
        <ul class="list_btn mb-3">
          <li><button class="btn btn_green" @click.prevent="editProfile">確認</button></li>
        </ul>
        <p class="member_out">退会をご希望の場合は、 退会ボタンを押してください。<router-link to="/m/mypage/hack">退会</router-link>
        </p>
      </div>
    </template>
  </div>
</template>
<script>
import Breadcrumb from '@/components/common/Breadcrumb'
import { mapState, mapGetters } from 'vuex'
import { joinPasswordValidation, validateNumber, changeKoreanToEmptyString } from '@/utils/validateUtils'
import { Alert } from '@/components/common/modal'
import filters from '@/filters/index'
import Rolldate from 'rolldate'

export default {
  components: {
    Breadcrumb
  },
  data () {
    return {
      infoShow: false,
      password: '',
      nickname: '',
      error: {},
      passwordShow: false,
      changePassObj: {
        newPassword: '',
        confirmPassword: ''
      },
      snsState: Math.floor(Math.random() * 10000),
      notify: false,
      notifyFlag: false,
      rd: null,
      nickFlag: '',
      birthday: '',
      changeFlag: true,
      mobileNo: '',
      contactTwoLengh: 4,
      contectOneLengh: 5,
      myInput: {
        contactOne: '',
        contactTwo: '',
        contactThree: ''
      }
    }
  },
  computed: {
    ...mapState('profile', ['profile', 'profileNonMasking']),
    ...mapGetters('profile', ['getConnectSns']),
    birthDate () {
      return (this.profileNonMasking && this.profileNonMasking.birthday && `${this.profileNonMasking.birthday.substring(0, 4)}-${this.profileNonMasking.birthday.substring(4, 6)}-${this.profileNonMasking.birthday.substring(6, 8)}`) || `${new Date().getFullYear() - 14}-${new Date().getMonth() + 1 >= 10 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)}-${new Date().getDate() >= 10 ? new Date().getDate() : '0' + new Date().getDate()}`
    },
    showContactTwo: {
      get () {
        return this.myInput.contactTwo
      },
      set (value) {
        this.myInput.contactTwo = changeKoreanToEmptyString(value)
      }
    },
    showContactThree: {
      get () {
        return this.myInput.contactThree
      },
      set (value) {
        this.myInput.contactThree = changeKoreanToEmptyString(value)
      }
    }
  },
  methods: {
    birthDateFunc () {
      this.rd = new Rolldate({
        el: '#birthDate',
        format: 'YYYY-MM-DD',
        beginYear: new Date().getFullYear() - 114,
        endYear: new Date().getFullYear() - 14,
        value: this.birthDate,
        lang: {
          title: '生年月日',
          cancel: 'キャンセル',
          confirm: '確認'
        },
        confirm: (date) => {
          this.profileNonMasking.birthday = date.split('-').join('')
        }
      })
    },
    goHome () {
      this.$router.go(-1)
    },
    async authProfile () {
      this.$refs.password.blur()
      if (this.validationCheck()) {
        this.$store.dispatch('profile/checkPassword', this.password).then((response) => {
          this.$store.dispatch('profile/_fetchProfileNonMasking', {
            data: { password: this.password }
          }).then((res) => {
            this.infoShow = true
            this.$nextTick(() => {
              this.birthDateFunc()
            })
          })
        }).catch(() => {
          this.error = {
            password: '入力した内容をもう一度確認してください。'
          }
        })
      }
    },
    validationPwd () {
      if (!this.changePassObj.newPassword) {
        this.error = {
          newPassword: 'パスワードを入力してください。'
        }
        return false
      }
      if (this.changePassObj.newPassword.length < 8) {
        this.error = {
          newPassword: 'パスワードは8桁以上入力してください。'
        }
        return false
      }
      const validationResult = joinPasswordValidation(this.changePassObj.newPassword)
      if (!validationResult.code) {
        this.error = {
          newPassword: 'パスワードは' + validationResult.pattern + 'を含めて入力してください。'
        }
        return false
      }
      if (this.changePassObj.confirmPassword && this.changePassObj.newPassword !== this.changePassObj.confirmPassword) {
        this.error = {
          confirmPassword: '同じパスワードを入力してください。'
        }
        return false
      }
      this.error = {
        password: '',
        confirmPassword: ''
      }
      return true
    },
    validationConfirmPwd () {
      if (!this.changePassObj.confirmPassword) {
        this.error = {
          confirmPassword: 'パスワード再確認を入力してください。'
        }
        return false
      }

      if (this.changePassObj.newPassword !== this.changePassObj.confirmPassword) {
        this.error = {
          confirmPassword: '同じパスワードを入力してください。'
        }
        return false
      }
      this.error = {
        confirmPassword: ''
      }
      return true
    },
    validationCheck () {
      if (!this.password) {
        this.error = {
          password: 'パスワードを入力してください。'
        }
        return false
      }

      if (this.password.length < 8) {
        this.error = {
          password: 'パスワードは8桁以上入力してください。'
        }
        return false
      }
      this.error = {}
      return true
    },
    editPasswordAction () {
      if (this.validationPwd() && this.validationConfirmPwd()) {
        this.$store.dispatch('profile/updatePassword', {
          currentPassword: this.password,
          newPassword: this.changePassObj.newPassword
        }).then(() => {
          Alert('パスワードが変更されました。再ログインしてください。').then(() => {
            this.$store.dispatch('authentication/logoutToLogin')
          })
        })
      }
    },
    snsConnect (sns) {
      let provider = ''
      if (this.getConnectSns[sns] === 'ing') {
        switch (sns) {
          case 'line':
            provider = 'line'
            break
          case 'facebook':
            provider = 'facebook'
            break
          case 'google':
            provider = 'google'
            break
        }
        this.$store.dispatch('authentication/_unlinkOpenId', {
          params: { providerType: provider }
        }).then((response) => {
          this.$store.dispatch('profile/memberFetch')
        })
      } else {
        switch (sns) {
          case 'line':
            provider = 'ncp_line'
            break
          case 'facebook':
            provider = 'ncp_facebook'
            break
          case 'google':
            provider = 'ncp_google'
            break
        }
        this.$store.dispatch('authentication/getSnsLoginUrl', {
          provider: provider,
          redirectUri: location.origin + '/m/mypage/profile/callback/' + sns,
          state: this.snsState
        }).then((response) => {
          location.href = response.data.loginUrl
        })
      }
    },
    validationNickNm () {
      if (this.nickname === '') {
        this.error = {
          nickname: 'ニックネームを入力してください。'
        }
        return false
      }
      if (this.nickname.length < 3) {
        this.error = {
          nickname: 'ニックネームは3文字以上入力してください。'
        }
        return false
      }
      this.error = {
        nickname: ''
      }
      return true
    },
    editProfile () {
      if (!this.validationNickNm()) {
        Alert({
          message: this.error.nickname
        })
        return false
      }
      let mobileNo = this.myInput.contactOne + this.myInput.contactTwo + this.myInput.contactThree
      if (mobileNo && mobileNo !== '') {
        if (this.myInput.contactOne === '' || this.myInput.contactTwo === '' || this.myInput.contactThree === '' || this.myInput.contactOne.substring(0, 1) !== '0' || mobileNo.length > 11) {
          Alert({
            message: '正しい電話番号を入力してください。'
          })
          return false
        }
      }
      let alertmsg = '会員情報が変更されました。'
      let birthday = this.birthDate.split('-').join('')
      let params = {}
      if (this.birthday !== birthday) {
        params.birthday = birthday
      }
      if (this.mobileNo !== mobileNo) {
        params.mobileNo = mobileNo
      }
      if (this.nickFlag !== this.nickname) {
        params.nickname = this.nickname
      }
      if (this.notifyFlag !== this.notify) {
        if (this.notify === true) {
          alertmsg = 'お得な情報を配信するメール受信に同意しました。 (' + filters.dateFormat(new Date(), 'yyyy.MM.dd HH:mm:ss') + ')'
        } else {
          alertmsg = 'お得な情報を配信するメール受信に同意しませんでした。 (' + filters.dateFormat(new Date(), 'yyyy.MM.dd HH:mm:ss') + ')'
        }
        params.directMailAgreed = this.notify
      }
      if (JSON.stringify(params) !== '{}') {
        this.$store.dispatch('profile/updateProfile', params).then((result) => {
          Alert(alertmsg).then(() => {
            this.$router.push('/m/mypage')
          })
        })
      } else {
        this.$router.push('/m/mypage')
      }
    },
    validateNumber (event) {
      validateNumber(event)
    },
    onlyNumber ($event) {
      let keyCode = ($event.keyCode ? $event.keyCode : $event.which)
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) { // 46 is dot
        $event.preventDefault()
      }
    },
    phoneNumberCheck ($event) {
      switch (this.myInput.contactOne.length) {
        case 5:
          this.contactTwoLengh = 1
          break
        case 4:
          this.contactTwoLengh = 2
          break
        case 3:
          this.contactTwoLengh = 4
          break
        default:
          this.contactTwoLengh = 4
          break
      }

      switch (this.myInput.contactTwo.length) {
        case 4:
          this.contectOneLengh = 3
          break
        case 3:
          this.contectOneLengh = 3
          break
        case 2:
          this.contectOneLengh = 4
          break
        case 1:
          this.contectOneLengh = 5
          break
        default:
          this.contectOneLengh = 5
          break
      }
    }
  },
  watch: {
    'profileNonMasking' () {
      if (this.profileNonMasking) {
        this.nickname = this.profileNonMasking.nickname
      }
      if (this.profileNonMasking && this.profileNonMasking.mobileNo) {
        if (this.profileNonMasking.mobileNo.indexOf('-') > -1) {
          let mobileArr = this.profileNonMasking.mobileNo.split('-')
          this.myInput.contactOne = mobileArr[0]
          this.myInput.contactTwo = mobileArr[1]
          this.myInput.contactThree = mobileArr[2]
        } else {
          let thelength = this.profileNonMasking.mobileNo.length
          this.myInput.contactOne = this.profileNonMasking.mobileNo.substring(0, thelength - 8)
          this.myInput.contactTwo = this.profileNonMasking.mobileNo.substring(thelength - 8, thelength - 4)
          this.myInput.contactThree = this.profileNonMasking.mobileNo.substring(thelength - 4, thelength)
        }
      }
      if (this.profileNonMasking && this.changeFlag) {
        this.nickFlag = this.profileNonMasking.nickname
        this.birthday = this.profileNonMasking.birthday
        this.mobileNo = this.myInput.contactOne + this.myInput.contactTwo + this.myInput.contactThree
        this.changeFlag = false
      }
    }
  },
  mounted () {
    if (this.$route.name === 'SNSConnect') {
      this.infoShow = true
    }
    if (this.profileNonMasking && this.profileNonMasking.directMailAgreed) {
      this.notify = this.profileNonMasking.directMailAgreed
      this.notifyFlag = this.notify
    }
    if (this.$route.params.sns) {
      let sns = this.$route.params.sns
      let type = 'connect'
      let provider = ''
      switch (sns) {
        case 'line':
          provider = 'ncp_line'
          break
        case 'facebook':
          provider = 'ncp_facebook'
          break
        case 'google':
          provider = 'ncp_google'
          break
      }
      this.$store.dispatch('authentication/getSnsAccessToken', {
        type: type,
        provider: provider,
        code: this.$route.query.code,
        redirectUri: location.origin + '/m/mypage/profile/callback/' + sns,
        state: this.$route.query.state
      })
    }
  }
}
</script>
