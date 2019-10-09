<template>
  <div
    class="bx_select size_m">
    <div
      :class="{
        'txt_select': true,
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
    </div>
  </div>
</template>
<script>

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
