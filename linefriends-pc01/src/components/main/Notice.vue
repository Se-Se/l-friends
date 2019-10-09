<template>
  <div class="news">
    <dl>
      <dt>お知らせ</dt>
      <dd><a href="/etc/notice">{{ notice[noticeIndex].title }}</a></dd>
    </dl>
    <ul class="btn_list">
      <li class="previous">
        <a href="" @click.prevent="change('p')">Previous</a>
      </li>
      <li class="next">
        <a href="" @click.prevent="change('n')">Next</a>
      </li>
    </ul>
  </div>
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
