<template>
  <div class="layer-popup" v-if="visible">
    <div class="layer-popup__dim"></div>
    <div :class="{
          'layer-popup__content': true,
          }">
      <header :class="{
            'layer-popup__header': true
          }">
        <h2 class="layer-popup__header--title">{{ title }}</h2>
        <button type="button"
                class="layer-popup__header--btn"
                v-if="type != 'login'"
                @click="close()">{{ $t('assets.close') }}</button>
      </header>
      <slot></slot>
      <footer class="layer-popup__footer">
        <button type="submit"
                class="layer-popup__footer--btn upload"
                @click="close()">{{ $t('assets.ok') }}</button>
      </footer>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'

export default {
  name: 'layer-popup',
  props: {
    description: {
      type: String,
      required: false
    },
    title: {
      type: String,
      required: false
    },
    bus: {
      type: Vue,
      required: true
    },
    type: {
      type: String,
      required: false,
      default: 'default'
    },
    text: {
      type: String,
      required: false
    },
    button: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      visible: false
    }
  },
  created () {
    this.bus.$on('openPopup', (e) => {
      this.visible = true
    })
  },
  methods: {
    close () {
      this.visible = false
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
    width: 680px;
    height: auto;
    padding: 40px 40px 32px 40px;
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
    &--title {
      font-family: 'Noto Sans KR';
      font-size: 20px;
      font-weight: bold;
      line-height: 1.6;
      letter-spacing: -0.1px;
      text-align: center;
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
