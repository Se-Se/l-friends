<template>
  <div class="info">
    <div :class="{bx_select:true}">
      <div class="txt_select" @click.prevent="changeType">
        <span class="select_vle">{{ inquiryType(select) }}</span>
        <span class="ico_arrow">リストを開く</span>
      </div>
      <ul class="lst_select_content" :style="openSelect ? 'display:block;' : 'display:none;'">
        <li v-for="(item,index) in options" :key="index">
          <a href="#" @click.prevent="selectType(item.value)">{{item.label}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Select',
  props: {
    options: {
      type: Array,
      required: true
    },
    size: {
      type: String,
      default: 'normal'
    },
    value: {
      required: false
    }
  },
  data () {
    return {
      select: this.value,
      openSelect: false
    }
  },
  watch: {
    value (next) {
      this.select = this.value
    }
  },
  methods: {
    changeType () {
      this.openSelect = !this.openSelect
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
    selectType (type) {
      this.select = type
      this.openSelect = false
      this.onChange()
    },
    onChange () {
      this.$emit('input', this.select)
      this.$emit('change')
    }
  }
}
</script>

<style scoped>
.txt_select {
  width: 100%;
  height: 100%;
  list-style: none;
  position: absolute;
  border: none;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
}
.ico_arrow {
  right: 2rem !important;
}
</style>
