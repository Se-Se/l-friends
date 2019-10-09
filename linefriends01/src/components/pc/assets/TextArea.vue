<template>
  <div
    class="textarea-item"
    :class="{ length: maxLength > 0 }"
    :style="{ height: height + 'px' }"
  >
    <textarea
      v-model="val"
      class="textarea-item__default"
      :placeholder="placeholder"
      :maxlength="maxLength"
      @input="onChange"
    />
    <span
      v-if="maxLength > 0"
      class="textarea-item__length"
    >
      <strong class="textarea-item__length-current">{{ val.length.toLocaleString() }}</strong>/{{ maxLength.toLocaleString() }}
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
    }
  },
  watch: {
    value (next) {
      this.val = next
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
