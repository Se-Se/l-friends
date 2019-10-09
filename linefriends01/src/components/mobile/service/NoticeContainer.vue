<template>
  <div>
    <div
      v-if="notices"
      class="notice-container"
    >
    <ul class="service-upper">
      <li class="service-upper__item">
        <router-link to="/etc/faq">FAQ</router-link>
      </li>
      <li class="service-upper__item">
        <router-link to="/notice/list">공지사항</router-link>
      </li>
    </ul>
      <notice-item
        v-for="(item, index) in notices"
        :key="index"
        :notice="item"
      />
    </div>
  </div>
</template>

<script>
import NoticeItem from './NoticeItem'

export default {
  name: 'NoticeContainer',
  components: {
    NoticeItem
  },
  props: {
    notices: {
      type: Array,
      reqquired: true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
