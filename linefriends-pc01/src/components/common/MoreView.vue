<template>
  <div>
    <li class="comments_content_area" :class="{ 'more': isActive }">
      <div v-if="isRichText === 'true'" v-html="_xssFilter(content)">
      </div>
      <div v-else>
        <pre>{{content | toHtml}}</pre>
      </div>
    </li>
    <li v-if="btnShow">
      <p class="more_view">
        <template v-if="stop">
          <a @click.stop="isShow()">
            {{!this.isActive?' 続きを読む':'閉じる'}}
          </a>
        </template>
        <template v-else>
          <a @click="isShow()">
            {{!this.isActive?' 続きを読む':'閉じる'}}
          </a>
        </template>
      </p>
    </li>
  </div>
</template>
<script>
import { xssFilter } from '@/utils/utils'
export default {
  props: {
    content: String,
    MoreViewIsOpen: Boolean,
    stop: {
      type: Boolean,
      default: false
    },
    isRichText: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      isActive: false,
      btnShow: Boolean
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    MoreViewIsOpen (val) {
      this.init()
      this.isActive = false
    },
    content (val) {
      this.$nextTick(() => {
        this.init()
      })
    }
  },
  methods: {
    _xssFilter (str) {
      return xssFilter(str)
    },
    init () {
      let height = this.$el.getElementsByTagName('div')[0].offsetHeight
      if (height > 90) {
        this.btnShow = true
      } else {
        this.btnShow = false
      }
    },
    isShow () {
      this.isActive = !this.isActive
    }
  }
}
</script>
