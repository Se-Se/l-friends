<template>
  <transition name="modal">
    <div
      v-if="active"
      class="modal__wrapper"
      @click.self="closeModal"
    >
      <div
        ref="modal"
        class="modal"
      >
        <div class="modal-header">
          <a
            href="#"
            class="modal-header__close"
            @click.prevent="closeModal"
          >
            x
          </a>
        </div>
        <div class="modal-body">
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import * as $ from 'jquery'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'
import Vue from 'vue'

export default {
  name: 'Modal',
  props: {
    bus: {
      type: Vue,
      required: true
    }
  },
  data () {
    return {
      active: false
    }
  },
  watch: {
    active (next) {
      const modalElem = this.$refs.modal
      const $elem = $('html, body')
      if (next) {
        disablePageScroll(modalElem)
        $elem.css({ overflow: 'hidden' })
      } else {
        enablePageScroll(modalElem)
        $elem.css({ overflow: '' })
      }
    }
  },
  created () {
    this.bus.$on('open', () => {
      this.active = true
    })
  },
  methods: {
    closeModal () {
      this.active = false
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
  position: absolute;
  margin: auto;
  width: 33.5rem;
  max-height: 90%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fff;

  &__wrapper {
    z-index: 99998;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }

  &-enter-active, &-leave-active {
    transition: all .3s;

    .modal {
      transition: all .3s;
    }
  }

  &-enter, &-leave-to {
    opacity: 0;

    .modal {
      transform: translate(-50%, -45%);
    }
  }

  &-header {
    padding: 2.9rem 3.3rem 0;
    text-align: right;

    &__close {
      display: inline-block;
      width: 1.1rem;
      height: 1.1rem;
      font-size: 0;
      background-image: url(~@/assets/images/mobile/small-close.svg);
      background-size: 100% 100%;
    }
  }
}
</style>
