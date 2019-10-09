<template>
  <ul
    class="select">
    <li
      :class="{
        'select-item': true,
        '__disable': disable === true
      }"
    >
      <select
        v-if="mode === 'detail'"
        :disabled="disable"
        v-model="select"
        @change="onChange"
      >
        <option
          v-for="( item, key ) in data"
          :key="key"
          :value="item.value"
        >
          {{ item.label }}
        </option>
      </select>
      <select
        v-else
        :disabled="disable"
        v-model="select"
        @change="onChange"
      >
        <option
          v-for="( item, key ) in data"
          :key="key"
          :value="item.value"
        >
          {{ item.label }}
        </option>
      </select>
      
    </li>
  </ul>
</template>
<script>
import * as $ from 'jquery'

export default {
  name: 'Select',
  props: {
    data: {
      type: Array,
      required: false
    },
    disable: {
      type: Boolean,
      required: false
    },
    placeholder: {
      type: String,
      required: false
    },
    value: {
      required: false
    },
    mode: {
      required: false
    }
  },
  data () {
    return {
      select: this.value,
      optionSelector: []
    }
  },
  watch: {
    value (next) {
      this.select = this.value
    },
    openOption (next) {
      const hambergerElem = this.$refs.hamberger
      const $elem = $('html, body')
      if (next) {
        this.optionSelector = []
      }
    }
  },
  methods: {
    onChange () {
      this.$emit('input', this.select)
    }
  }
}
</script>
