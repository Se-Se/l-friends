<template>
  <div
    :class="['faq-item__wrapper', active ? 'active' : '']"
    @click="onClick"
  >
    <div class="faq-item">
      <div class="faq-info">
        <p class="faq__type">
          {{ faq.categoryLabel }}
        </p>
        <p class="faq__title">
          {{ faq.title }}
        </p>
        <!-- <p
          v-if="seen" 
          class="faq__title"
        >
          {{ faq.title }}
        </p>
        <p
          v-if="!seen" 
          class="faq__title-full"
        >
          {{ faq.title }}
        </p>
        <p
          v-on:click="toggleSeen"
        >
          {{button.text}}
        </p> -->
      </div>
      <div :class="['faq__icon', active ? 'active' : '']">
        <span class="arrow"></span>
      </div>
    </div>
    <transition-expand>
      <div
        v-if="active"
        class="faq-detail"
      >
        <div class="faq-detail__item">
          <div class="faq-detail__answer">
            <img
              class="faq-detail__icon"
              src="~@/assets/images/mobile/qna-brown.png"
            >
            <span class="faq-detail__manager">라인프렌즈</span>
          </div>
          <div class="faq-detail-info">
            <p
              class="faq__question"
              v-html="content"
            />
          </div>
        </div>
      </div>
    </transition-expand>
  </div>
</template>

<script>
import fliter from '@/filters'
import TransitionExpand from '@/components/common/transition/TransitionExpand'

export default {
  name: 'FaqItem',
  components: {
    TransitionExpand
  },
  props: {
    faq: {
      type: Object,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      content: '',
      seen: true,
      button: {
        text: '자세히 보기'
      }
    }
  },
  methods: {
    async onClick () {
      if (!this.content) {
        const res = await this.$store.dispatch('board/faqDetail', this.faq.articleNo)

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
      }

      this.$emit('click')
    }
    // async toggleSeen () {
    //   this.seen = !this.seen
    //   this.button.text = this.seen ? '자세히 보기' : '간결히'
    // }
  }
}
</script>
