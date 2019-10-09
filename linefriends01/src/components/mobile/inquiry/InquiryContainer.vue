<template>
  <div>
    <div
      v-if="inquiries"
      class="inquiry-container"
    >
      <inquiry-item
        v-for="(item, index) in inquiries"
        :key="index"
        :inquiry="item"
        @openIndex="openIndex"
        :currentIndex="currentIndex"
        :index="index"
      />
    </div>
    <not-found
      v-else
      :height="39.6"
      description="작성한 1:1 문의가 없습니다."
    />
  </div>
</template>

<script>
import NotFound from '../common/list/NotFound'
import InquiryItem from './InquiryItem'
import { mapState } from 'vuex'

export default {
  name: 'InquiryContainer',
  components: {
    InquiryItem,
    NotFound
  },
  computed: {
    ...mapState('profileinquiry', ['inquiries'])
  },
  data () {
    return {
      currentIndex: -1
    }
  },
  methods: {
    openIndex (index) {
      this.currentIndex = index
    }
  }
}
</script>

<style lang="scss" scoped>
.inquiry-container {
  margin-bottom: 2rem
}
</style>
