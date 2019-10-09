<template>
  <div id="container" class="mypage">
    <div class="wrap">
      <!-- ↓↓↓↓↓ wrap_category ↓↓↓↓↓ -->
      <BreadCrumbs :breadCrumbs="'会員情報修正'"></BreadCrumbs>
      <!-- ↑↑↑↑↑ wrap_category ↑↑↑↑↑ -->
      <div class="profile-edit-content">
        <h1>会員情報修正</h1>
        <template v-if="!infoShow">
          <table class="table_data have_padding">
            <tbody>
              <tr>
                <th>メールアドレス(ID)</th>
                <td>{{profile && profile.email}}</td>
              </tr>
              <tr>
                <th>パスワード</th>
                <td>
                  <input type="text" style="position: absolute; z-index: -999;">
                  <input type="password" ref="password" :class="error.password ? 'error':''" style="width: 240px;" placeholder="パスワードを入力してください" v-model="password" maxlength="20" @keypress.enter="authProfile" @blur="validationCheck">
                  <span class="input-notice" v-if="error.password">{{error.password}}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <ul class="person-info_btn btn-m-t_80">
            <li><button class="btn" @click.prevent="goHome">キャンセル</button></li>
            <li><button class="btn btn_green" @click.prevent="authProfile">確認</button></li>
          </ul>
        </template>

        <template v-if="infoShow">
          <table class="table_data have_padding">
            <colgroup>
              <col style="width:200px;">
              <col>
            </colgroup>
            <tbody>
              <tr>
                <th>メールアドレス(ID)</th>
                <td>{{profileNonMasking && profileNonMasking.email}}</td>
              </tr>
              <tr>
                <th>ニックネーム</th>
                <td>
                  <input type="text" style="position: absolute; z-index: -999;">
                  <input type="password" style="position: absolute; z-index: -999;">
                  <input type="text" placeholder="" autocomplete='off' maxlength="20" v-model="nickname">
                </td>
              </tr>
              <tr>
                <th>パスワード変更</th>
                <td class="font-size_0" v-if="!passwordShow">
                  <input type="password" placeholder="" v-model="password" disabled="disable">
                  <button class="btn modify-btn" @click.prevent="passwordShow = true">変更</button>
                </td>
                <td class="profile-modify-ps" v-if="passwordShow">
                  <p class="mofify-ps-name">前のパスワード</p>
                  <div class="profile-reset-ps-block">
                    <input type="password" placeholder="8文字以上/英文字、数字、記号を含む" v-model="password" disabled="disable" class="ps_bg">
                  </div>
                  <p class="mofify-ps-name">新しいパスワード</p>
                  <div class="profile-reset-ps-block">
                    <input type="password" :class="error.password ? 'error':''" placeholder="8文字以上/英文字、数字、記号を含む" maxlength="20" v-model="changePassObj.newPassword" @keyup.enter="validationPwd" @blur="validationPwd">
                    <span class="input-notice" v-if="error.newPassword">{{error.newPassword}}</span>
                  </div>
                  <p class="mofify-ps-name">新しいパスワード確認</p>
                  <div class="profile-reset-ps-block">
                    <input type="password" :class="error.confirmPassword ? 'error':''" placeholder="パスワードをもう一度入力" maxlength="20" v-model="changePassObj.confirmPassword" @keypress.enter="editPasswordAction" @blur="validationConfirmPwd">
                    <span class="input-notice" v-if="error.confirmPassword">{{error.confirmPassword}}</span>
                  </div>
                  <ul class="modify-ps-btns">
                    <li><button class="btn btn_green" @click.prevent="editPasswordAction">パスワード変更</button></li>
                    <li><button class="btn" @click.prevent="passwordShow = false">キャンセル</button></li>
                  </ul>
                </td>
              </tr>
              <tr>
                <th>電話番号<span class="green-point"></span></th>
                <td class="padding-16-15">
                  <div class="telephone">
                    <input type="text" class="wid-96" :maxlength="contectOneLengh" v-model="myInput.contactOne" @keypress="onlyNumber" @keyup="phoneNumberCheck">
                    <span>-</span>
                    <input type="text" class="wid-96" :maxlength='contactTwoLengh' required="" v-model="showContactTwo" ref="contactTwo" @keypress="onlyNumber" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
                    <span>-</span>
                    <input type="text" class="wid-96" maxlength="4" required="" v-model="showContactThree" ref="contactThree" @keypress="onlyNumber" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
                  </div>
                </td>
              </tr>
              <tr>
                <th>生年月日</th>
                <td>
                  <ul class="data_select_list">
                    <li class="width_94">
                      <div class="bx_select" v-click-outside="closeYear">
                        <div class="txt_select" :class="birthClick.yearClick ? 'on' : ''" @click="birthClick.yearClick = !birthClick.yearClick">
                          <span class="select_vle">{{birthObj.year}}</span>
                          <span class="ico_arrow">リストを開く</span>
                        </div>
                        <ul class="lst_select_content">
                          <li v-for="(key, index) in BirthYmd().year" :key="index">
                            <a href="#" @click.prevent="theYearClick(key)">{{key}}</a>
                          </li>
                        </ul>
                      </div>

                    </li>
                    <li class="data_txt">
                      <span>年</span>
                    </li>
                    <li>
                      <div class="bx_select" v-click-outside="closeMonth">
                        <div class="txt_select" :class="birthClick.monthClick ? 'on' : ''" @click="birthClick.monthClick = !birthClick.monthClick">
                          <span class="select_vle">{{birthObj.month}}</span>
                          <span class="ico_arrow">リストを開く</span>
                        </div>
                        <ul class="lst_select_content">
                          <li v-for="(key, index) in BirthYmd().month" :key="index">
                            <a href="#" @click.prevent="theMonthClick(key)">{{key}}</a>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li class="data_txt">
                      <span>月</span>
                    </li>
                    <li>
                      <div class="bx_select" v-click-outside="closeDay">
                        <div class="txt_select" :class="birthClick.dayClick ? 'on' : ''" @click="birthClick.dayClick = !birthClick.dayClick">
                          <span class="select_vle">{{birthObj.day}}</span>
                          <span class="ico_arrow">リストを開く</span>
                        </div>
                        <ul class="lst_select_content">
                          <li v-for="(key, index) in BirthYmd(birthObj.year, birthObj.month).day" :key="index">
                            <a href="#" @click.prevent="theDayClick(key)">{{key}}</a>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li class="data_txt">
                      <span>日</span>
                    </li>
                  </ul>

                </td>
              </tr>
              <tr>
                <th>SNS連携</th>
                <td>
                  <div class="sns-layout bg-f9">
                    <ul class="sns-login">
                      <li :class="getConnectSns['line'] === 'ing' ? 'relieve' : ''">
                        <div class="line sns-login__action sns_txt-style">LINE連携</div>
                        <p class="text-add" v-if="getConnectSns['line'] === 'ing'">連携済み
                          <button class="btn btn_primary size_s" @click.prevent="snsConnect('line')">解除</button>
                        </p>
                        <p class="text-add sns-m-r_18" v-else @click.prevent="snsConnect('line')">連携</p>
                      </li>
                      <li :class="getConnectSns['facebook'] === 'ing' ? 'relieve' : ''">
                        <div class="facebook sns-login__action">facebook連携</div>
                        <p class="text-add" v-if="getConnectSns['facebook'] === 'ing'">連携済み
                          <button class="btn btn_primary size_s" @click.prevent="snsConnect('facebook')">解除</button>
                        </p>
                        <p class="text-add sns-m-r_18" v-else @click.prevent="snsConnect('facebook')">連携</p>
                      </li>
                      <li :class="getConnectSns['google'] === 'ing' ? 'relieve' : ''">
                        <div class="google sns-login__action">google連携</div>
                        <p class="text-add" v-if="getConnectSns['google'] === 'ing'">連携済み
                          <button class="btn btn_primary size_s" @click.prevent="snsConnect('google')">解除</button>
                        </p>
                        <p class="text-add sns-m-r_18" v-else @click.prevent="snsConnect('google')">連携</p>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
              <tr>
                <th>おトクな情報の通知</th>
                <td>
                  <div class="profile-check-box">
                    <span class="bx_input">
                      <input id="input6" type="checkbox" v-model="notify">
                      <label for="input6">メール</label>
                    </span>
                    <p class="person-notes">会員情報、購入情報及びサービスに関する重要なお知らせは受信設定に関係なく配信されます。</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <p class="member-check">退会をご希望の場合は、「退会」ボタンを押してください。<button class="btn btn_primary size_s" @click.prevent="$router.push('/mypage/hack')">退会</button></p>
          <ul class="person-info_btn btn-m-t_46">
            <li class="width_360"><button class="btn btn_green" @click.prevent="editProfile">確認</button></li>
          </ul>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import BreadCrumbs from '@/components/common/BreadCrumbs'
import { mapState, mapGetters } from 'vuex'
import { joinPasswordValidation, validateNumber, changeKoreanToEmptyString } from '@/utils/validateUtils'
import { BirthYmd } from '@/utils/dateUtils'
import { Alert } from '@/components/common/modal'
import filters from '@/filters/index'
import ClickOutside from 'vue-click-outside'
export default {
  components: {
    BreadCrumbs
  },
  directives: {
    ClickOutside
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
      birthObj: {
        year: new Date().getFullYear() - 14,
        month: new Date().getMonth() + 1 >= 10 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1),
        day: new Date().getDate() >= 10 ? new Date().getDate() : '0' + new Date().getDate()
      },
      birthClick: {
        yearClick: false,
        monthClick: false,
        dayClick: false
      },
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
    BirthYmd,
    closeYear () {
      this.birthClick.yearClick = false
    },
    closeMonth () {
      this.birthClick.monthClick = false
    },
    closeDay () {
      this.birthClick.dayClick = false
    },
    theYearClick (key) {
      this.birthObj.year = key
      this.birthObj.month = '01'
      this.birthObj.day = '01'
      this.birthClick.yearClick = false
      this.birthClick.monthClick = false
      this.birthClick.dayClick = false
    },
    theMonthClick (key) {
      this.birthObj.month = key
      this.birthObj.day = '01'
      this.birthClick.monthClick = false
      this.birthClick.dayClick = false
    },
    theDayClick (key) {
      this.birthObj.day = key
      this.birthClick.dayClick = false
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
          redirectUri: location.origin + '/mypage/profile/callback/' + sns,
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
      let birthday = this.birthObj.year + this.birthObj.month + this.birthObj.day
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
            this.$router.push('/mypage')
          })
        })
      } else {
        this.$router.push('/mypage')
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
      if (this.profileNonMasking && this.profileNonMasking.birthday) {
        this.birthObj.year = this.profileNonMasking.birthday.substring(0, 4)
        this.birthObj.month = this.profileNonMasking.birthday.substring(4, 6)
        this.birthObj.day = this.profileNonMasking.birthday.substring(6, 8)
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
      if (this.profileNonMasking) {
        this.nickname = this.profileNonMasking.nickname
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
        redirectUri: location.origin + '/mypage/profile/callback/' + sns,
        state: this.$route.query.state
      })
    }
  }
}
</script>
