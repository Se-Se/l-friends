<template>
  <div
    :class="{
      input: true,
      interval: data.interval === true,
      free: data.mode === 'free'
    }"
    :style="{ width: data.size + 'px' }"
  >
    <label
      v-if="data.title"
      :for="data.title"
    >
      <p class="input-title">{{ data.title }}</p>
    </label>
    <input
      :id="id"
      :type="data.type"
      :placeholder="data.placeholder"
      :required="data.reChk"
      :value="value"
      :style="{ 'height': data.height + 'px' }"
      :class="{ 'password': data.type === 'password', error: error }"
      :maxlength="(data.max) ? data.max : null"
      :readonly="data.readonly"
      @input="onChange($event.target.value)"
      @blur="blurAction"
    >
  </div>
</template>
<script>
export default {
  name: 'Input',
  props: {
    data: {
      type: Object,
      required: true
    },
    value: {
      default: null
    },
    error: {
      default: null
    },
    checktype: {
      type: String,
      default: 'text'
    },
    mode: {
      type: String,
      default: ''
    },
    tabindex: {
      type: Number,
      required: false
    }
  },
  data () {
    return {
      id: 'Input___' + Math.floor(Math.random() * 100000)
    }
  },
  methods: {
    blurAction () {
      this.$emit('blur')
    },
    onChange (value) {
      if (this.checktype === 'email') {
        value = value.replace(/[^A-Za-z0-9~\-.!@#$%^&*()_+']/g, '')
        document.getElementById(this.id).value = value
      }
      this.$emit('input', value)
    }
  }
}
</script>
