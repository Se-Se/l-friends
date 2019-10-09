<template>
  <div class="comments_list">
    <div class="list_head">
      <span class="info">{{ item.registerName }} | {{ item.registerGroupNames }}</span>
      <span class="date">{{ formatDate(item.registerYmdt) }}</span>
    </div>
    <div class="list_content">
      <pre :class="{'hideComment':hideComment}">{{ item.content }}</pre>
      <button type="button" class="btn_detail" @click="hideComment = !hideComment" v-if="detailshow">
        <span class="txt" v-if="hideComment">더 보기</span>
        <span class="txt" v-else>접기</span>
      </button>
    </div>
  </div>
</template>
<script>
import filters from '@/filters/index'
export default {
  props: ['item'],
  data () {
    return {
      hideComment: false,
      detailshow: false
    }
  },
  created () {
    this.$nextTick(() => {
      if (this.$el.querySelector('pre').offsetHeight > 66) {
        this.hideComment = true
        this.detailshow = true
      } else {
        this.detailshow = false
      }
    })
  },
  methods: {
    formatDate (dateStr) {
      return filters.dateFormatStr(dateStr, 'yyyy.MM.dd HH:mm')
    }
  }
}
</script>
<style scoped>
.hideComment {
  overflow-y: hidden;
  max-height: 66px;
}
</style>