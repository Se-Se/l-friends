<template>
  <v-touch @swipeleft="change('n')" @swiperight="change('p')" class="news">
    <dl>
      <dt>お知らせ</dt>
      <dd><a href="/m/etc/notice">{{ notice[noticeIndex].title }}</a></dd>
    </dl>
  </v-touch>
</template>

<script>
export default {
  props: ['notice'],
  data () {
    return {
      noticeIndex: 0
    }
  },
  methods: {
    change (flag) {
      if (flag === 'p') {
        if (this.noticeIndex === 0) {
          this.noticeIndex = this.notice.length - 1
        } else {
          this.noticeIndex--
        }
      }
      if (flag === 'n') {
        if (this.noticeIndex === this.notice.length - 1) {
          this.noticeIndex = 0
        } else {
          this.noticeIndex++
        }
      }
    }
  }
}
</script>
