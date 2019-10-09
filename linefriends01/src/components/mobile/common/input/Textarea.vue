<template>
  <div
    :class="{ length: maxLength > 0 }"
    :style="{ height: height + 'rem' }"
  >
    <textarea
      v-model="val"
      id="app_textarea"
      ref="textbox"
      :class="['app-textarea', type]"
      :maxlength="maxLength || false"
      @input="onChange"
    />
    <pre
      v-if="val.length === 0 && !isTyping"
      class="app-textarea__placeholder"
      @click="() => $refs.textbox.focus()"
    >{{ placeholder }}</pre>
    <span
      v-if="maxLength > 0"
      class="app-textarea-length"
    >
      <strong class="current-length">{{ val.length.toLocaleString() }}</strong>/{{ maxLength.toLocaleString() }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'Textarea',
  props: {
    type: {
      type: String,
      default: 'primary'
    },
    placeholder: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 16
    },
    maxLength: {
      type: Number,
      default: 160
    }
  },
  watch: {
    value (next) {
      this.val = next
    }
  },
  data () {
    return {
      val: this.value,
      isTyping: false
    }
  },
  methods: {
    onChange () {
      this.$emit('input', this.val)
    },
    onCompositionStart (e) {
      this.isTyping = true
    },
    onCompositionEnd (e) {
      this.isTyping = false
    }
  },
  mounted () {
    setTimeout(() => {
      const el = document.querySelector('#app_textarea')
      el.addEventListener('compositionstart', this.onCompositionStart)
      el.addEventListener('compositionend', this.onCompositionEnd)
    }, 1000)
  }
}
</script>

<style lang="scss" scoped>
div {
  position: relative;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 0.4rem;
  font-size: 0;
  padding: 1.5rem 2rem;

  &.length {
    padding-bottom: 3.3rem;
  }
  &.inquiry {
    padding-bottom: 4rem;
  }
}

.app-textarea {
  width: 100%;
  height: 100%;
  resize: none;
  font-family: 'Noto Sans KR';
  font-size: 1.4rem;
  color: #333;
  letter-spacing: -0.01rem;
  line-height: 1.5;
  outline: none;

  &__placeholder {
    position: absolute;
    left: 2rem;
    top: 1.5rem;
    padding: 0.2rem 0.3rem;
    width: calc(100% - 4rem);
    height: calc(100% - 3rem);
    color: rgba(51, 51, 51, 0.4);
    letter-spacing: -0.01rem;
    line-height: 1.5;
    font-family: 'Noto Sans KR';
    font-size: 1.4rem;
    font-weight: normal;
    white-space: pre-wrap;
  }

  &.black &__placeholder{
    color: rgba(51, 51, 51, 1);
  }

  &-length {
    position: absolute;
    right: 1.9rem;
    bottom: 1.4rem;

    font-family: Volte, sans-serif;
    font-size: 1.4rem;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #999;

    .current-length {
      color: #333;
    }
  }
}
</style>
