<template>
  <div class="password-confirm">
    <sub-page-header :title="$t('mypage.profile.subject')" />

    <div id="container">
      <div>
        <div class="input-row">
          <app-label :style="{ fontSize: '1.4rem' }">
            {{ $t('mypage.profile.title.email') }}
          </app-label>
          <span class="user-email">
            {{ memberId }}
          </span>
        </div>
        <div class="input-row">
          <app-label :style="{ fontSize: '1.4rem' }">
            {{ $t('mypage.profile.title.name') }}
          </app-label>

          <app-input
            id="id"
            type="text"
            size="large"
            :max="20"
            v-model="name"
            :value="name"
            @input="setName"
            no-hint
          />
        </div>
        <div class="input-row">
          <app-label
            :style="{ fontSize: '1.4rem' }"
            target="password"
          >
            {{ $t('mypage.profile.title.password') }}
          </app-label>
          <password-change ref='password' />
        </div>
        <div class="input-row">
          <app-label :style="{ fontSize: '1.4rem' }">
            {{ connectedSns > 0 ? this.$t('mypage.profile.title.useSns') : $t('mypage.profile.title.sns') }}
          </app-label>
          <sns-login
            :logined="true"
            :connect="getConnectSns"
            :style="{ marginTop: 0 }"
            @connect="snsConnect"
          />
        </div>
        <div class="input-row">
          <app-label :style="{ fontSize: '1.4rem' }">
            {{ $t('mypage.profile.title.notice') }}
          </app-label>
          <ul class="event-notify">
            <li class="event-notify__item">
              <app-checkbox
                v-model="notify.email"
                size="large"
              >
                <span class="event-notify__label">{{ $t('mypage.profile.notice.email') }}</span>
              </app-checkbox>
            </li>
          </ul>
        </div>
        <information class="event-notify__information">
          {{ $t('mypage.profile.description.content1') }}<br>
          {{ $t('mypage.profile.description.content2') }}
        </information>

        <app-button
          type="success"
          class="submit-btn"
          @click="editProfile"
        >
          {{ this.$t('button.ok') }}
        </app-button>

        <p class="withdrawal-message">
          {{ $t('mypage.profile.description.hack') }} <router-link to="/mypage/hack">{{ $t('mypage.profile.button.hack') }}</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import AppCheckbox from '@/components/mobile/common/input/Checkbox'
import AppButton from '@/components/mobile/common/button/Button'
import AppLabel from '@/components/mobile/common/form/Label'
import AppInput from '@/components/mobile/common/input/Input'
import Information from '@/components/mobile/common/Information'
import SnsLogin from '@/components/mobile/auth/SNSLogin'
import PasswordChange from '@/components/mobile/auth/PasswordChange'

import Profile from '@/components/mixins/mypage/Profile'

export default {
  name: 'Profile',
  mixins: [Profile],
  components: {
    SubPageHeader,
    AppCheckbox,
    AppButton,
    AppLabel,
    AppInput,
    Information,
    SnsLogin,
    PasswordChange
  },
  computed: {
    ...mapGetters('profile', ['getConnectSns']),
    connectedSns () {
      let count = 0
      for (const key in this.getConnectSns) {
        count = count + (this.getConnectSns[key] === 'ing' ? 1 : 0)
      }
      return count
    }
  }
}
</script>

<style lang="scss" scoped>
#container {
  position: relative;
  padding: 3.2rem 2rem 4rem;
}

.input-row {
  &:not(:last-child) {
    margin-bottom: 3.2rem;
  }
}

.user-email {
  display: inline-block;
  margin-top: 0.4rem;
  font-family: 'Noto Sans KR';
  font-size: 1.4rem;
  font-weight: normal;
  line-height: 1.5;
  letter-spacing: -0.01rem;
  color: #333;
}

.input-error {
  margin-top: 0.8rem;
  color: #ff414e;
  font-family: 'Noto Sans KR';
  font-weight: normal;
  font-size: 1.2rem;
  letter-spacing: -0.01rem;
  line-height: 1.5;
}

.event-notify {
  padding-top: 1.133rem;

  &__label {
    display: inline-block;
    margin-top: 0.2rem;
    margin-left: 1.2rem;
    font-family: 'Noto Sans KR';
    font-size: 1.4rem;
    font-weight: normal;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #333;
  }

  &__information {
    /deep/ .information-icon {
      margin-top: 0.3rem;
    }
  }
}

.submit-btn {
  margin: 3.2rem 0 3.8rem;
}

.withdrawal-message {
  font-family: 'Noto Sans KR';
  font-size: 1.4rem;
  font-weight: normal;
  line-height: 1.43;
  letter-spacing: -0.01rem;
  color: #999;

  a {
    color: #4ba4d9;
    text-decoration: underline;
  }
}
</style>
