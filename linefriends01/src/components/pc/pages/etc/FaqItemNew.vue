<template>
  <tbody>
    <tr :class="{active: currentIndex === index}" @click.prevent="onClick">
      <td v-html="tag"></td>
      <td>
        <div class="ellipsis">
          <p v-html="faqItem.title"></p>
        </div>
      </td>
      <td>
        <button class="btn_open">
          <span>{{ currentIndex === index ? '목록 닫힘' : '목록 열림' }}</span>
        </button>
      </td>
    </tr>
    <tr class="open" v-if="currentIndex === index">
      <td></td>
      <td>
        <div class="explain" v-html="content"></div>
      </td>
      <td></td>
    </tr>
  </tbody>
</template>
<script>
import fliter from '@/filters'
export default {
  props: ['faqItem', 'index', 'search', 'categoryNo', 'index', 'currentIndex', 'pageNo'],
  data () {
    return {
      content: ''
    }
  },
  computed: {
    tag () {
      return this.faqItem.categoryLabel
    }
  },
  created () {
    if (this.search) {
      this.faqItem.title = fliter.warpTag(this.faqItem.title, this.search, 'span')
    }
  },
  methods: {
    onClick () {
      this.$emit('openIndex', this.index)
      if (this.currentIndex === this.index) {
        this.$emit('openIndex', '-1')
      }
      if (!this.content) {
        this.$store.dispatch('board/faqDetail', this.faqItem.articleNo).then(res => {
          this.content = res.data && res.data.content
          if (this.search) {
            let keyword = this.search
            let div = document.createElement('div')
            div.innerHTML = this.content
            const childNodes = div.getElementsByTagName('*')
            const length = childNodes.length
            let result = ''
            for (var i = 0; i < length; i++) {
              let content = childNodes[i].innerText
              const filterResult = fliter.warpTag(content, keyword, 'span')
              result += `<${childNodes[i].tagName}>${filterResult}</${childNodes[i].tagName}>`
            }
            this.content = result
          }
        })
      }
    }
  }
}
</script>
<style>
.open div.explain img {
  max-width: 885px !important;
}
</style>
