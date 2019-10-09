<template>
  <div class="join-sended-email">
    <sub-page-header :title="$t('member.joinSendEmail.subject')" :back="false" />

    <div id="container">
      <img
        src="~@/assets/images/mobile/progress.jpg"
        class="progress-image"
      >
      <p class="join-sended-message">
        <strong>{{ $route.query.email }}</strong> {{ $t('member.joinSendEmail.description.to') }}<br>
        {{ $t('member.joinSendEmail.description.send') }}
      </p>
      <p class="join-sended-description">
        {{ $t('member.joinSendEmail.description.content1') }}
      </p>
    </div>

    <bottom-fixed>
      <app-button
        to='/'
        type="success"
        bold
      >
        {{ $t('button.goHome') }}
      </app-button>
    </bottom-fixed>
  </div>
</template>

<script>
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import BottomFixed from '@/components/mobile/common/BottomFixed'
import AppButton from '@/components/mobile/common/button/Button'

export default {
  name: 'JoinSendEmail',
  components: {
    SubPageHeader,
    BottomFixed,
    AppButton
  }
}
</script>

<style lang="scss" scoped>
.button-list {
  display: flex;
  justify-content: space-between;

  > * {
    width: 48.959%;
  }
}

#container {
  padding: 8rem 0 0;
  text-align: center;
}

.progress-image {
  width: 17.2rem;
  margin-right: 0.3rem;
}

.join-sended {
  &-message {
    width: 28rem;
    margin: 2.4rem auto 0;
    font-family: 'Noto Sans KR';
    font-size: 1.6rem;
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

  &-description {
    margin-top: 1.6rem;
    font-family: 'Noto Sans KR';
    font-weight: normal;
    line-height: 1.5;
    letter-spacing: -0.01rem;
    color: #999;
  }
}
</style>
