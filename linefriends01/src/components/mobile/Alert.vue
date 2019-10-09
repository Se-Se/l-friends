<template>
  <div class="alert-component">
    <transition name="alert">
      <article
        v-if="open"
        class="alert__wrapper"
        @click.self="closeAlert"
      >
        <div class="alert">
          <div class="alert-content">
            <h3
              v-if="title && false"
              class="alert__title"
            >
              {{ title }}
            </h3>
            <p class="alert__message" v-html="message"></p>
          </div>

          <div class="alert-buttons">
            <a
              v-if="type === types.CONFIRM"
              class="alert-buttons__item"
              @click="closeAlert"
            >
              {{ buttons.cancel }}
            </a>
            <a
              v-if="type === types.ALERT || type === types.CONFIRM"
              class="alert-buttons__item success"
              @click="clickOk"
            >
              {{ buttons.confirm }}
            </a>
          </div>
        </div>
      </article>
    </transition>
  </div>
</template>

<script>
import * as $ from 'jquery'
import AppButton from '@/components/mobile/common/button/Button'
import { EventBus } from '@/utils/event-bus.js'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'
import cookies from 'js-cookie'

export default {
  name: 'Alert',
  components: {
    AppButton
  },
  data () {
    return {
      types: {
        ALERT: 'Alert',
        CONFIRM: 'Confirm',
        MESSAGE: 'Message'
      },
      open: false,
      type: 'Alert',
      $elem: null,
      title: null,
      message: null,
      callBack: null,
      onClose: null,
      cancelRedirect: null,
      buttons: {
        cancel: '취소',
        confirm: '확인'
      }
    }
  },
  watch: {
    open (next) {
      if (next) {
        disablePageScroll()
        this.$elem.css('overflow', 'hidden')
      } else {
        if (this.onClose) {
          this.onClose()
        }

        enablePageScroll()
        this.$elem.css('overflow', '')

        this.title = null
        this.message = null
        this.callback = null
        this.onClose = null
      }
    }
  },
  created () {
    this.$elem = $('html, body')
    EventBus.$on('alert', params => {
      this.type = this.types.ALERT
      this.openAlert(params)
    })

    EventBus.$on('confirm', params => {
      this.type = this.types.CONFIRM
      this.openAlert(params)
    })

    this.$emit('init')
  },
  methods: {
    openAlert ({ title, message, callback, onCancel, onClose, buttons, cancelRedirect }) {
      this.title = title
      this.message = message
      this.callback = callback
      this.onClose = onClose
      this.onCancel = onCancel
      if (buttons) {
        this.buttons = {
          ...this.buttons,
          ...buttons
        }
      }
      if (cancelRedirect) {
        this.cancelRedirect = cancelRedirect
      }

      this.open = true
    },
    clickOk () {
      if (this.callback) {
        this.callback()
      }
      this.open = false
    },
    closeAlert () {
      if (this.type === this.types.ALERT && this.callback) {
        this.callback()
      }
      if (this.cancelRedirect) {
        window.location.href = this.cancelRedirect
      }
      if (this.onCancel) {
        this.onCancel()
      }
      this.open = false
    }
  }
}
</script>

<style lang="scss" scoped>
.alert {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 29.5rem;

  &__wrapper {
    z-index: 99999;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(17, 17, 17, 0.5);
  }

  &-enter-active,
  &-leave-active {
    transition: all .3s;

    .alert {
      transition: all .3s;
    }
  }

  &-enter,
  &-leave-to {
    background: rgba(17, 17, 17, 0);

    .alert {
      transform: translate(-50%, -40%);
      opacity: 0;
    }
  }

  &::before {
    content: '';
    left: 50%;
    top: -9.2rem;
    transform: translateX(-50%);
    position: absolute;
    display: block;
    width: 15rem;
    height: 10rem;
    background-size: 100% 100%;
    background-image: url(~@/assets/images/mobile/ic-alert-brown.png);
  }

  &-content {
    background: #fff;
    padding: 3.2rem 3.2rem;
    border-radius: 0.8rem 0.8rem 0 0;
    overflow: hidden;
  }

  &__title {
    margin-bottom: 0.733rem;
    font-family: 'Noto Sans KR';
    font-weight: bold;
    font-size: 1.8rem;
    text-align: center;
    line-height: 1.44;
    letter-spacing: -0.01rem;
    color: #333;
  }

  &__message {
    font-family: 'Noto Sans KR';
    font-weight: normal;
    font-size: 1.4rem;
    text-align: center;
    line-height: 1.5;
    color: #666;
  }

  &-buttons {
    background: #fff;
    border-radius: 0 0 0.8rem 0.8rem;
    overflow: hidden;
    display: flex;

    &__item {
      flex: 1;
      display: block;
      border-top: 1px solid #eee;
      padding: 1.4rem 0;
      font-family: 'Noto Sans KR';
      font-size: 1.6rem;
      font-weight: 500;
      line-height: 1.5;
      letter-spacing: -0.1rem;
      text-align: center;
      color: #666;

      &.success {
        color: #00d664;
      }

      &:not(:last-child) {
        border-right: 1px solid #eee;
      }
    }
  }
}
</style>
