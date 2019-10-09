<template>
  <div class="join-complete">
    <sub-page-header :title="$t('member.joinComplate.title')" :back="false" />

    <div id="container" v-if="status">
      <img
        src="~@/assets/images/mobile/join-complete.jpg"
        class="join-complete-image"
      >
      <p class="join-sended-message">
        <strong>{{ memberId }}</strong> {{ $t('common.sir')}}<br>
        {{ $t('common.welcome')}} {{ $t('common.hi')}}
      </p>
    </div>

    <bottom-fixed>
      <app-button
        type="success"
        bold
        @click="goHome"
      >
        {{ $t('button.ok')}}
      </app-button>
    </bottom-fixed>
  </div>
</template>

<script>
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import BottomFixed from '@/components/mobile/common/BottomFixed'
import AppButton from '@/components/mobile/common/button/Button'

import JoinComplete from '@/components/mixins/member/JoinComplete'

export default {
  name: 'JoinComplete',
  components: {
    SubPageHeader,
    BottomFixed,
    AppButton
  },
  mixins: [JoinComplete]
}
</script>

<style lang="scss" scoped>
#container {
  padding: 8rem 0 0;
  text-align: center;
}

.join-complete-image {
  width: 29.5rem;
  margin-right: 0.3rem;
}

.join-sended {
  &-message {
    width: 28rem;
    margin: 2.4rem auto 0;
    font-family: 'Noto Sans KR';
    font-size: 1.6rem;
    text-align: 1.6rem;
    font-weight: normal;
    letter-spacing: -0.01rem;
    line-height: 1.2;
    color: #333;

    strong {
      word-break: break-all;
      font-family: Volte, sans-serif;
      font-size: 2rem;
      font-weight: 600;
      color: #00d664;
    }
  }
}
</style>
