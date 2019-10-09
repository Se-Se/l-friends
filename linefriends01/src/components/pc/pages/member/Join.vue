<template>
  <div class="join">
    <main-wrapper>
      <layout-width>
        <bread-crumbs
          :basic="basicCrumbs"
        />
        <member-title :title="$t('auth.join')" />
        <member-item />
        <form-content>
          <member-layout>
            <div class="join-input">
              <input-item :data="input.email" v-model="email" @keyup.enter.native="pcJoinFlow" :error="error.email" @blur="pcJoinFlow" />
              <p
                v-if="error.email"
                class="join-error"
              >
                {{ error.email }}
              </p>
            </div>
            <div class="join-input">
              <input-item :data="input.password" v-model="password" @keyup.enter.native="pcJoinFlow" :error="error.password" @blur="pcJoinFlow"/>
              <p
                v-if="error.password"
                class="join-error"
              >
                {{ error.password }}
              </p>
            </div>
            <div class="join-input">
              <input-item :data="input.passwordRechk" v-model="passwordConfirm" @keyup.enter.native="pcJoinFlow" :error="error.passwordConfirm" @blur="pcJoinFlow"/>
              <p
                v-if="error.passwordConfirm"
                class="join-error"
              >
                {{ error.passwordConfirm }}
              </p>
            </div>
            <privercy-list ref="agree" :privercyError="privercyError" />
            <div class="join-interval">
              <button
                type="button"
                class="join-btn"
                @click="signUp"
              >
                {{ $t('button.next') }}
              </button>
            </div>
          </member-layout>
        </form-content>
      </layout-width>
    </main-wrapper>
  </div>
</template>
<script>
  import cookies from 'js-cookie'
  import LayoutWidth from '../../layout/common/LayoutWidth'
  import MainWrapper from '../../layout/common/MainWrapper'
  import BreadCrumbs from '../../layout/common/BreadCrumbs'
  import InputItem from '../../assets/Input'
  import FormContent from '../../layout/common/FormContent'

  import MemberTitle from '../../member/MemberTitle'
  import MemberItem from '../../member/MemberItem'
  import MemberLayout from '../../member/MemberLayout'
  import PrivercyList from '../../member/PrivercyList'

  import Join from '@/components/mixins/member/Join'

  export default {
    name: 'Join',
    components: {
      LayoutWidth,
      MainWrapper,
      BreadCrumbs,
      MemberTitle,
      InputItem,
      MemberItem,
      PrivercyList,
      MemberLayout,
      FormContent
    },
    mixins: [Join],
    data () {
      return {
        privercyError: false
      }
    },
    methods: {
      async pcJoinFlow () {
        this.validationCheck().then(() => {
          this.privercyError = false
          if (Object.keys(this.error).length > 0) {
            return false
          }
          this.marketing = this.$refs.agree.agree.marketing
          if (this.$refs.agree.agree.service === false) {
            this.privercyError = true
            return false
          }
          if (this.$refs.agree.agree.privercy === false) {
            this.privercyError = true
            return false
          }
          if (this.$refs.agree.agree.age === false) {
            this.privercyError = true
            return false
          }
        })
      }
    }
  }
</script>
