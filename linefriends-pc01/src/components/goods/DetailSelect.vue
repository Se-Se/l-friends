<template>
  <div v-click-outside="closeItem">
    <div class="txt_select" :class="openSelect ? 'on': ''" @click.prevent="changeType" :disabled="disabled">
      <template v-if="isStandard">
        <span class="select_vle">オプション選択</span>
      </template>
      <span class="select_vle" v-else>{{ inquiryType(select) }}</span>
      <span class="ico_arrow">arrow</span>
    </div>
    <ul class="lst_select_content">
      <li v-for="(option, key) in options" :key="key">
        <template v-if="isStandard">
          <template v-if="key > 0">
            <a href="#" @click.prevent="selectType(option.value,option.disabled,key)">{{ option.standardLabel}} : {{ option.label}}</a>
          </template>
          <template v-else>
            <a href="#" @click.prevent="closeItem(option.value,option.disabled,key)">オプション選択</a>
          </template>
        </template>
        <template v-else>
          <a href="#" @click.prevent="selectType(option.value,option.disabled,key)">{{ option.label}}</a>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
export default {
  name: 'DetailSelect',
  props: {
    options: {
      type: [Array, Object],
      required: false
    },
    optionPrice: {
      required: false
    },
    isStandard: {
      default: false,
      required: false
    },
    size: {
      type: String,
      default: 'normal'
    },
    value: {
      required: false
    },
    disabled: {
      required: false
    }
  },
  directives: {
    ClickOutside
  },
  data () {
    return {
      select: this.value,
      openSelect: false,
      checkValue: false
    }
  },
  watch: {
    value (next) {
      this.select = this.value
    }
  },
  methods: {
    closeItem () {
      this.openSelect = false
    },
    selectType (type, able, key) {
      if (able === false || able === undefined) {
        this.select = type
        this.openSelect = false
        this.onChange()
      } else {
        this.select = type
        this.onChange()
        this.$emit('checkStatus', key)
      }
    },
    inquiryType (type) {
      let lable = '商品'
      if (this.options) {
        this.options.forEach(item => {
          if (item.value === type) {
            lable = item.label
          }
        })
      }
      return lable
    },
    changeType () {
      if (!this.disabled) {
        this.openSelect = !this.openSelect
      }
    },
    onChange () {
      this.$emit('input', this.select)
    }
  }
}
</script>
<style scoped>
#select {
  width: 100%;
  height: 100%;
  list-style: none;
  margin-left: -12px;
  position: absolute;
  border: none;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  padding-left: 12px;
  background-color: white;
}
</style>
