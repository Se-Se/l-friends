<template>
  <div
    v-if="visible"
    class="layer-popup"
  >
    <div class="layer-popup__dim"></div>
    <div 
    :class="{
        'layer-popup__content': true,
        'layer-popup__content--cart': type === 'confirm' || 'login',
        'layer-popup__content--normal': type === 'normal',
        'layer-popup__content--goods': type === 'goods'
      }"
      >
      <header 
      :class="{
          'layer-popup__header': true,
          'login': type === types.ALERT || type === types.CONFIRM,
          'cart': type === 'confirm',
          '_nointerval': true,
        }"
        >
        <template v-if="header">
          <h2 class="layer-popup__header--title">
            {{ title }}
          </h2>
          <!-- <h2
            v-else-if="type === types.ALERT || type === types.CONFIRM"
            class="layer-popup__header--title__login"
          >
            {{ title }}
          </h2> -->
        </template>
        <button
          v-if="type != types.ALERT && type != types.CONFIRM && type != 'confirm'"
          type="button"
          class="layer-popup__header--btn"
          @click="close('headbtn')"
        >
          {{ $t('assets.close') }}
        </button>
      </header>
      <table
        v-if="type != 'noTable' && type != 'normal' && type != 'goods'"
        class="layer-popup__tbl"
      >
        <colgroup>
          <col
            style="width:15%;"
            span="1"
          >
          <col
            style="width:85%;"
            span="1"
          >
        </colgroup>
        <slot></slot>
      </table>
      <div v-else>
        <slot></slot>
      </div>
      <div
        v-if="text && type !== 'confirm'"
        :class="{ 'layer-popup__txt':true, '_nofooter': button === 'no'}"
      >
        <h2 v-html="text"></h2>
      </div>
      <div
        v-if="type == 'confirm'"
        :class="{
          'layer-popup__txt': true,
          'layer-popup__txt--cart': type === 'confirm',
        }"
      >
        <p v-html="text"></p>
        <p>{{ info }}</p>
      </div>
      <div
        v-if="description"
        class="layer-popup__description"
      >
        <p>{{ description }}</p>
      </div>
      <footer
        v-if="button === 'normal'"
        class="layer-popup__footer"
      >
        <button
          type="button"
          class="layer-popup__footer--btn cancel"
        >
          {{ buttons.cancel }}
        </button>
        <button
          type="submit"
          class="layer-popup__footer--btn add"
        >
          {{ $t('assets.add') }}
        </button>
      </footer>
      <footer
        v-else-if="button === 'single'"
        class="layer-popup__footer"
      >
        <button
          type="submit"
          class="layer-popup__footer--btn add"
          @click="close('cart')"
        >
          {{ buttons.confirm}}
        </button>
      </footer>
      <footer v-else-if="button === 'no'"></footer>
      <footer
        v-else-if="button === 'double'"
        class="layer-popup__footer double"
      >
        <button
          type="submit"
          class="layer-popup__footer--btn unchecked"
          @click="close()"
        >
          {{ buttons.cancel }}
        </button>
        <button
          type="submit"
          class="layer-popup__footer--btn checked"
          @click="confirm()"
        >
          {{ buttons.confirm }}
        </button>
      </footer>
      <footer
        v-if="button === 'question'"
        class="layer-popup__footer"
      >
        <button
          type="button"
          class="layer-popup__footer--btn close"
          @click="close()"
        >
          {{ buttons.cancel }}
        </button>
        <button
          type="submit"
          @click="confirm()"
          class="layer-popup__footer--btn up"
        >
          {{ buttons.confirm }}
        </button>
      </footer>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'

export default {
  name: 'LayerPopup',
  props: {
    header: {
      type: Boolean,
      required: false
    },
    description: {
      type: String,
      required: false
    },
    title: {
      type: String,
      required: false
    },
    type: {
      type: String,
      required: false,
      default: 'noTable'
    },
    text: {
      type: String,
      required: false
    },
    info: {
      type: String,
      default: ''
    },
    button: {
      type: String,
      required: false,
      default: 'noraml'
    },
    visible: {
      type: Boolean,
      required: false
    },
    buttons: {
      cancel: {
        type: String,
        default: '취소'
      },
      confirm: {
        type: String,
        default: '확인'
      }
    },
    path: {
      required: false
    }
  },
  data () {
    return {
      types: {
        ALERT: 'AlertModal',
        CONFIRM: 'ConfirmModal'
      }
    }
  },
  methods: {
    close (isClose) {
      if (isClose === 'headbtn' || isClose === 'cart') {
      }
      // if (isquiry === 'inquiry') {
      // }
      $('html').css('overflow', 'scroll')
      this.$emit('close', this.type)
    },
    confirm () {
      $('html').css('overflow', 'scroll')
      this.$emit('confirm')
      if (this.path) {
        this.$router.push(this.path)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.layer-popup {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 1000;
  &__dim {
    width: 100%;
    height: 100%;
    background-color: rgba(51, 51, 51, 0.5);
  }
  &__content {
    position: absolute;
    width: 800px;
    height: auto;
    padding: 27px 30px;
    border-radius: 8px;
    background-color: #ffffff;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    &--login {
      width: 360px;
    }
  }
  &__header {
    position: relative;
    padding-bottom: 20px;
    &.login:before {
      position: absolute;
      width: 100px;
      height: 77.5px;
      background-image: url(~@/assets/images/pc/icons/ic-brown-layer.png);
      background-size: 100% auto;
      background-repeat: no-repeat;
      top: -94px;
      left: 50%;
      transform: translateX(-50%);
      content: '';
    }
    &--title {
      font-family: 'Noto Sans KR';
      font-size: 22px;
      font-weight: bold;
      text-align: center;
      line-height: 1.36;
      letter-spacing: -0.1px;
      color: #333333;
    }
    &--title__login {
      padding-top: 13px;
      font-family: 'Noto Sans KR';
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      line-height: 1.4;
      letter-spacing: -0.1px;
      color: #333333;
    }
    &--btn {
      position: absolute;
      width: 40px;
      height: 40px;
      background-image: url(~@/assets/images/pc/icons/ic-layerpopup-close.svg);
      background-size: cover;
      background-repeat: no-repeat;
      text-indent: -9999px;
      top: -20px;
      right: -104px;
    }
  }
  &__txt {
    font-family: 'Noto Sans KR';
    font-size: 16px;
    font-weight: normal;
    line-height: 1.5;
    text-align: center;
    color: #666666;
  }
  &__description {
    width: 100%;
    padding: 17px 16px;
    margin-top: 20px;
    background-color: #fafafa;
    & > p {
      font-family: 'Noto Sans KR';
      font-size: 12px;
      font-weight: normal;
      letter-spacing: -0.1px;
      color: #666666;
    }
  }
  &__footer {
    margin-top: 28px;
    font-size: 0;
    text-align: center;
    &--btn {
      width: 156px;
      height: 40px;
      font-family: 'Noto Sans KR';
      font-size: 16px;
      font-weight: normal;
      letter-spacing: -0.1px;
      border-radius: 4px;
      &.cancel {
        margin-right: 8px;
        background-color: #f6f6f6;
        color: #333333;
      }
      &.add {
        background-color: #00d664;
        color: #ffffff;
      }
    }
  }
  &__tbl {
    width: 100%;
    border-top: 2px solid #333333;
    & > tr {
      border-bottom: 1px solid #ededed;
      & > th,td {
        padding: 20px 0;
        font-family: 'Noto Sans KR';
        font-size: 14px;
        font-weight: normal;
        color: #333333;
        vertical-align: middle;
      }
      & > th {
        background-color: #fafafa;
      }
      & > td {
        position: relative;
        padding-left: 10px;
        & .review {
          position: relative;
          width: 100%;
          height: 200px;
          padding: 17px 20px;
          border: 1px solid #ededed;
          border-radius: 4px;
        }
      }
      & .active {
        font-weight: normal;
        font-size: 14px;
        letter-spacing: -0.1px;
        color: #999999;
        &:after {
          position: absolute;
          left: 31px;
          top: 37px;
          content: '- 광고, 저작권침해, 욕설, 비방, 음란 등 문의와 관계없는 글은 임의 삭제가 됨을 알려드립니다.';
        }
        &:before {
          position: absolute;
          left: 31px;
          top: 55px;
          content: '- 전화번호, 메일 주소 등 고객님의 소중한 개인정보를 남기지 않도록 주의하세요.';
        }
      }
    }
  }
}
</style>
