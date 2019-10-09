<template>
  <div v-if="show" class="popup-layer">
    <div class="message-popup">
      <div v-if="w.title" class="popup-header">
        <h1>{{w.title}}</h1>
      </div>
      <div class="popup-text">
        <p v-html="w.message">{{w.message}}</p>
      </div>
      <div class="popup-footer">
        <button type="button" @click="cancel" class="btn-cancel btn-size">{{w.cancel}}</button>
        <button type="button" @click="success" class="btn-sure btn-size">{{w.confirm}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import preventPageScroll from './prevent-page-scroll'

export default {
  data () {
    return {
      show: false,
      w: {
        message: '',
        title: '',
        confirm: '確認',
        cancel: 'キャンセル'
      }
    }
  },
  mounted () {
    preventPageScroll.prevent()
    window.addEventListener('hashchange', this.listener)
    window.addEventListener('popstate', this.listener)
    window.addEventListener('pagehide', this.listener)
  },
  beforeDestroy () {
    window.removeEventListener('hashchange', this.listener)
    window.removeEventListener('popstate', this.listener)
    window.removeEventListener('pagehide', this.listener)
  },
  methods: {
    listener () {
      this.show = false
    },
    success () {
      preventPageScroll.recover()
      this.show = false
    },
    cancel () {
      preventPageScroll.recover()
      this.show = false
    }
  }
}
</script>
