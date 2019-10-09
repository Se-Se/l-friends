<template>
  <div class="sns-login__wrapper">
    <ul class="sns-login">
      <li
        v-if="mode === 'login'"
        class="sns-login__item"
        @click.prevent="$emit('connect', 'naver')"
      >
        <div
          class="naver sns-login__action"
        >{{ $t('auth.naver.login') }}</div>
      </li>
      <li
        v-else-if="mode === 'mypage'"
        class="sns-login__item"
      >
        <div
          v-if="data.naver !== 'ing'"
          class="naver sns-login__action _connect"
        >
          <p>{{ $t('auth.naver.title') }}</p>
          <p
            @click.prevent="$emit('connect', 'naver')"
            class="sns-login__item-connect"
          >{{ $t('auth.synchronization.do') }}</p>
        </div>
        <div
          v-else-if="data.naver === 'ing'"
          class="naver sns-login__action"
        >
          <p>{{ $t('auth.naver.title') }}</p>
          <div class="sns-connect">
            <p>{{ $t('auth.synchronization.ing') }}</p>
            <white-btn :data="connectToggle" @click="$emit('connect', 'naver')" />
          </div>
        </div>
      </li>
      <li
        v-if="mode === 'login'"
        class="sns-login__item"
        @click.prevent="$emit('connect', 'line')"
      >
        <div
          class="line sns-login__action"
        >{{ $t('auth.line.login') }}</div>
      </li>
      <li
        v-else-if="mode === 'mypage'"
        class="sns-login__item"
      >
        <div
          v-if="data.line !== 'ing'"
          href="#"
          class="line sns-login__action _connect"
        >
          <p>{{ $t('auth.line.title') }}</p>
          <p
            @click.prevent="$emit('connect', 'line')"
            class="sns-login__item-connect">{{ $t('auth.synchronization.do') }}</p>
        </div>
        <div
          v-else-if="data.line === 'ing'"
          class="line sns-login__action"
        >
          <p>{{ $t('auth.line.title') }}</p>
          <div class="sns-connect">
            <p>{{ $t('auth.synchronization.ing') }}</p>
            <white-btn :data="connectToggle" @click="$emit('connect', 'line')" />
          </div>
        </div>
      </li>
      <li
        v-if="mode === 'login'"
        class="sns-login__item"
        @click.prevent="$emit('connect', 'facebook')"
      >
        <div
          class="facebook sns-login__action"
        >{{ $t('auth.facebook.login') }}</div>
      </li>
      <li
        v-else-if="mode === 'mypage'"
        class="sns-login__item"
      >
        <div
          v-if="data.facebook !== 'ing'"
          class="facebook sns-login__action _connect"
        >
          <p>{{ $t('auth.facebook.title') }}</p>
          <p
            @click.prevent="$emit('connect', 'facebook')"
            class="sns-login__item-connect"
          >{{ $t('auth.synchronization.do') }}</p>
        </div>
        <div
          v-else-if="data.facebook === 'ing'"
          class="facebook sns-login__action"
        >
          <p>{{ $t('auth.facebook.title') }}</p>
          <div class="sns-connect">
            <p>{{ $t('auth.synchronization.ing') }}</p>
            <white-btn :data="connectToggle" @click="$emit('connect', 'facebook')" />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import WhiteBtn from '../assets/buttons/WhiteButton'

export default {
  name: 'Snslogin',
  components: {
    WhiteBtn
  },
  props: {
    mode: {
      type: String,
      required: false,
      default: 'login'
    },
    data: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
      connectToggle: {
        action: 'button',
        to: '',
        title: '해제',
        type: 'short',
        width: 60
      }
    }
  }
}
</script>
