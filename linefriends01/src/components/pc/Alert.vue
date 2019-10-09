<template>
  <layer-popup
    :visible="visible"
    :title="title"
    :text="message"
    :button="button"
    :buttons="buttons"
    :type="type"
    @close="action"
    @confirm="confirm"
  />
</template>

<script>
import LayerPopup from '@/components/pc/layout/common/LayerPopup'
import { EventBus } from '@/utils/event-bus.js'

export default {
  name: 'Alert',
  components: {
    LayerPopup
  },
  data () {
    return {
      types: {
        ALERT: 'AlertModal',
        CONFIRM: 'ConfirmModal'
      },
      visible: false,
      title: null,
      message: null,
      button: 'single',
      cancelRedirect: null,
      buttons: {
        cancel: '취소',
        confirm: '확인'
      },
      type: null
    }
  },
  created () {
    EventBus.$on('alert', ({ title, message, callback, cancelRedirect }) => {
      this.title = title
      this.message = message
      this.callback = callback
      this.visible = true
      this.type = this.types.ALERT
      if (cancelRedirect) {
        this.cancelRedirect = cancelRedirect
      }
    })
    EventBus.$on('confirm', ({ title, message, callback, buttons, cancelRedirect }) => {
      this.button = 'double'
      this.title = title
      this.message = message
      this.callback = callback
      this.visible = true
      this.type = this.types.CONFIRM
      if (buttons) {
        this.buttons = {
          ...this.buttons,
          ...buttons
        }
      }
      if (cancelRedirect) {
        this.cancelRedirect = cancelRedirect
      }
    })

    this.$emit('init')
  },
  methods: {
    confirm () {
      if (this.callback) {
        this.callback()
      }
      this.visible = false
    },
    action (type) {
      if (type === this.types.ALERT && this.callback) {
        this.callback()
      }
      if (this.cancelRedirect) {
        window.location.href = this.cancelRedirect
      }
      this.visible = false
    }
  }
}
</script>
