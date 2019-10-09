<template>
  <div class="sns-login__wrapper">
    <ul class="sns-login">
      <li
        v-for="(item, key) in sns"
        :key="key"
        :class="['sns-login__item', connect[key] ? 'connected' : '']"
        @click.prevent="() => !connect[key] ? action(key) : null"
      >
        <span
          v-if="!logined"
          :class="['sns-login__label', item.icon]"
        >{{ item.label }}</span>
        <div
          v-else
          :class="{ 'sns-login__group': connectedCount > 0 }"
        >
          <span :class="['sns-login__label', item.icon]">{{ item.name }}</span>
          <a
            v-if="!connect[key]"
            href="#"
            class="sns-login__connect"
          >연동하기</a>
          <div
            v-else
            class="sns-login__connected"
          >
            <small>연동 중</small>
            <app-button
              size="small"
              class="sns-login__remove-connect"
              @click="action(key)"
            >
              해제
            </app-button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import AppButton from '@/components/mobile/common/button/Button'

export default {
  name: 'SNSLogin',
  components: {
    AppButton
  },
  props: {
    logined: {
      type: Boolean,
      default: false
    },
    connect: {
      type: Object
    }
  },
  data () {
    return {
      sns: {
        naver: {
          icon: 'ic-naver',
          name: '네이버',
          label: '네이버로 로그인'
        },
        line: {
          icon: 'ic-line',
          name: '라인',
          label: '라인으로 로그인'
        },
        facebook: {
          icon: 'ic-facebook',
          name: '페이스북',
          label: '페이스북으로 로그인'
        }
      }
    }
  },
  methods: {
    action (key) {
      this.$emit('connect', key)
    }
  },
  computed: {
    connectedCount () {
      let count = 0
      for (const key in this.connect) {
        count = count + (this.connect[key] === 'ing' ? 1 : 0)
      }
      return count
    }
  }
}
</script>

<style lang="scss" scoped>
.sns-login {
  &__wrapper {
    margin-top: 4rem;
    padding: 0.8rem 2.8rem;
    background: #fafafa;
  }

  &__group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-right: 0.3rem;
  }

  &__item {
    display: flex;
    justify-content: space-between;

    &:not(:last-child) {
      border-bottom: 1px solid #eee;
    }

    &:not(.connected)::after {
      content: '';
      display: inline-block;
      margin-top: 2.5rem;
      margin-right: 0.7rem;
      width: 0.7rem;
      height: 1.2rem;
      vertical-align: top;
      background-image: url(~@/assets/images/mobile/ic-arrow2.svg);
      background-size: 100% 100%;
    }
  }

  &__connect {
    font-family: 'Noto Sans KR';
    font-size: 1.4rem;
    font-weight: 500;
    line-height: 3.71;
    letter-spacing: -0.01rem;
    color: #666;
    margin-left: 0.3rem;
    margin-right: 0.816rem;
  }

  &__connected {
    padding-right: 0.4rem;
    display: flex;
    align-items: center;

    small {
      font-family: 'Noto Sans KR';
      font-size: 1.2rem;
      font-weight: 500;
      line-height: 4.33;
      letter-spacing: -0.01rem;
      color: #999;
    }
  }

  &__remove-connect {
    width: 5.3rem;
    margin-left: 1.033rem;
  }

  &__label {
    display: inline-block;
    font-family: 'Noto Sans KR';
    font-weight: 500;
    font-size: 1.4rem;
    height: 6rem;
    line-height: 3.71;
    letter-spacing: -0.01rem;
    color: #666;
    padding: 0.5rem 0 0.3rem;

    &::before {
      content: '';
      display: inline-block;
      margin-top: 1.1rem;
      margin-right: 1rem;
      width: 2.4rem;
      height: 2.4rem;
      vertical-align: top;
      background-size: 100% 100%;
    }

    &.ic-naver::before {
      background-image: url(~@/assets/images/mobile/ic-naver.svg);
      margin-top: 1.5rem;
    }

    &.ic-line::before {
      background-image: url(~@/assets/images/mobile/ic-line.svg);
    }

    &.ic-facebook::before {
      background-image: url(~@/assets/images/mobile/ic-facebook.svg);
    }
  }
}
</style>
