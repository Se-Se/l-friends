<template>
  <div :style="hide ? 'display:block;' : 'display:none;'" v-click-outside="closeItem">
    <div class="txt_select" :class="openSelect ? 'on' : ''" @click.prevent="changeType">
      <template v-if="isStandard">
      <span class="select_vle">オプション選択</span>
      </template>
      <span class="select_vle" v-else>{{ inquiryType(select) }}</span>
      <span class="ico_arrow">arrow</span>
    </div>
    <ul class="lst_select_content">
      <li v-for="(option, key) in options" :key="key">
        <template v-if="isStandard ">
          <a href="#" @click.prevent="selectType(option.value,option.disabled,key)" v-if="key > 0">{{ option.standardLabel}} : {{option.label}}</a>
          <a href="#" @click.prevent="selectType(option.value,option.disabled,key)" v-else>オプション選択</a>
        </template>
        <template v-else>
          <a href="#" @click.prevent="selectType(option.value,option.disabled,key)">{{option.label}}</a>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
import ClickOutside from '@/utils/VueClickOutside.js'
import * as $ from 'jquery'
export default {
  name: 'Select',
  props: {
    options: {
      type: Array,
      required: true
    },
    isStandard: {
      default: false,
      required: false
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
      hide: true
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
        this.$emit('addHeight', $('.lst_select_content').height())
        this.openSelect = !this.openSelect
      }
    },
    onChange () {
      this.$emit('input', this.select)
      this.$emit('change')
    }
  }
}
</script>

<style  scoped>
</style>
