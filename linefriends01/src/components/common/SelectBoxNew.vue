<template>
  <div>
    <div class="bx_select width-270" style="z-index: 101">
      <span class="blind"></span>
      <a href="#" class="txt_select" :class="{ 'on': selectOn}" @click.prevent="selectBoxClick">
        <template v-if="!update">{{ (selectedItem && selectedItem.label) || placeholder }}</template>
        <template v-else>{{inquiryTypeName}}</template>
        <span class="sp ico_arrow">목록 열기</span>
      </a>
      <ul class="lst_select_content">
        <li v-for="(item,index) in items" :key="index">
          <a href="#" @click.prevent="selectItem(item)">{{ item.label }}</a>
        </li>
      </ul>
    </div>
    <div v-if="selectOn" class="background_selectbox" @click="backgroundClick" />
  </div>
</template>
<style scoped>
#container.mypage .popup_common .bx_select .txt_select {
  padding: 0 38px 0 16px;
  font-size: 14px;
  color: #5a5a5a;
}
#container.mypage .layer_qna_report .bx_select .lst_select_content {
  top: 39px !important;
}
</style>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: function () {
        return []
      }
    },
    placeholder: {
      type: String,
      default: '선택해주세요'
    },
    inquiryTypeName: '',
    update: ''
  },
  data () {
    return {
      selectOn: false,
      selectedItem: {}
    }
  },
  methods: {
    initSelectedItem () {
      Object.assign(this.$data, this.$options.data())
    },
    selectBoxClick () {
      if (this.update) { return }
      this.selectOn = !this.selectOn
    },
    backgroundClick () {
      this.selectOn = false
    },
    selectItem (item) {
      if (!this.selectedItem.label ||
        this.selectedItem.label !== item.label ||
        !this.selectedItem.value ||
        this.selectedItem.value !== item.value) {
        this.$emit('change', item)
        this.selectedItem = item
      }
      this.selectOn = false
    }
  }
}
</script>

<style scoped>
.background_selectbox {
  background-color: rgba(0, 0, 0, 0) !important;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}
</style>
