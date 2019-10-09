<template>
  <div>
    <div class="comments_content_more_view " :class="{ 'more_view': isActive }">
      <pre class="txt" v-if="isRichText" v-html="content"></pre>
      <pre class="txt" v-else>{{content | toHtml}}</pre>
    </div>
    <template v-if="stop">
      <div v-if="btnShow" class="more_view_btn">
        <a @click.stop="isShow()">
          {{!this.isActive?' 続きを読む':'閉じる'}}
        </a>
      </div>
    </template>
    <template v-else>
      <div v-if="btnShow" class="more_view_btn">
        <a @click="isShow()">
          {{!this.isActive?' 続きを読む':'閉じる'}}
        </a>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    content: String,
    MoreViewIsOpen: Boolean,
    stop: {
      type: Boolean,
      default: false
    },
    isRichText: {
      type: Boolean,
      default: false
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
    init () {
      let height = this.$el.getElementsByClassName('comments_content_more_view')[0].children[0].offsetHeight
      if (height > 65) {
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
