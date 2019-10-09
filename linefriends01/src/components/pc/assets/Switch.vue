<template>
  <div v-if="type === 'radio'">
    <input
      :id="id"
      type="radio"
      :name="name"
      class="switch-input"
      :checked="radioChecked || isCheck"
      :value="value"
      @change="$emit('change', $event.target)"
    >
    <label
      :for="id"
      class="switch-label"
    >
      <span
        class="switch-label__action _radios"
      >test</span>
      <p
        :class="{
          'switch-label__title': true,
          '_bold': bold === true
        }"
      >
        {{ title }}
      </p>
    </label>
  </div>
  <div v-else-if="type === 'checkbox'">
    <input
      :id="id"
      ref="checkbox"
      type="checkbox"
      :name="name"
      class="switch-input"
      :checked="isCheck"
      :value="value"
      :disabled="disabled"
      @input="$emit('input', $refs.checkbox.checked)"
      @change="$emit('input', $refs.checkbox.checked)"
    >
    <label
      :for="id"
      class="switch-label"
    >
      <span
        class="switch-label__action checkbox"
      >{{ name }}</span>
      <p
        :class="{
          'switch-label__title': true,
          '_bold': bold === true
        }"
      >
        {{ title }}
      </p>
    </label>
  </div>
</template>
<script>
export default {
  name: 'Switch-name',
  props: {
    type: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: false
    },
    name: {
      type: String,
      required: false
    },
    bold: {
      type: Boolean,
      required: false
    },
    value: {
      default: false,
      required: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    radioChecked: {
      type: Boolean,
      required: false
    }
  },
  data () {
    return {
      id: 'Switch___' + Math.floor(Math.random() * 100000)
    }
  },
  computed: {
    isCheck () {
      return this.value === true
    }
  },
  methods: {
    onChange (e) {
      this.$emit('change', e)
    }
  }
}
</script>
