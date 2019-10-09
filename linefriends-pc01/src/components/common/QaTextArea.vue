<template>
  <div class="bx_write">
    <textarea v-model="val" class="popup_qa_login_write" :placeholder="placeholder" :maxlength="maxLength" @input="onChange" />
    <span
      v-if="maxLength > 0"
      class="text_count"
    >
      <span class="num">{{ val.length.toLocaleString() }}</span>/{{ maxLength.toLocaleString() }}
    </span>
  </div>
</template>
<script>
export default {
  name: 'TexArea',
  props: {
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
      default: 320
    },
    maxLength: {
      type: Number,
      default: 0
    },
    contentValue: {
      type: String,
      default: ''
    }

  },
  watch: {
    contentValue (next) {
      this.val = this.contentValue
    }
  },
  data () {
    return {
      val: this.value
    }
  },
  methods: {
    onChange () {
      this.$emit('input', this.val)
    }
  }
}
</script>
