<template>
  <div>
    <div
      v-if="faqs && faqs.length > 0"
      class="faq-container"
    >
      <template v-for="(item, index) in faqs">
        <faq-item
          :key="index"
          :active="index === currentIndex"
          :faq="item"
          @click="() => { currentIndex = currentIndex === index ? -1 : index }"
        />
      </template>
    </div>
    <p
      v-else
      class="nodata"
    >
      검색결과가 없습니다.
    </p>
  </div>
</template>

<script>
import FaqItem from './FaqItem'

export default {
  name: 'FaqContainer',
  components: {
    FaqItem
  },
  props: {
    faqs: {
      type: Array,
      default: false
    }
  },
  watch: {
    faqs () {
      this.currentIndex = -1
    }
  },
  data () {
    return {
      currentIndex: -1
    }
  }
}
</script>

<style lang="scss" scoped>
.nodata{
  padding: 14.7rem 0 18.1rem;
  color: #333333;
  font-size: 1.4rem;
  font-family: 'Noto Sans KR';
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: -0.01rem;
  text-align: center;
  border-bottom: 1px solid #eeeeee;
}
</style>
