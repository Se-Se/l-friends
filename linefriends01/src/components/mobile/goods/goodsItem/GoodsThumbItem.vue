<template>
  <div class="goods-item">
    <router-link :to="'/goods/detail/' + goods.productNo" class="goods-item__link">
      <lazy-img
        class="goods-item__thumbnail"
        :src="goods.imageUrls[0]"
      />
    </router-link>
  </div>
</template>

<script>
import AOS from 'aos'
import 'aos/dist/aos.css'
import LazyImg from '@/components/common/LazyImg'

export default {
  name: 'GoodsThumbItem',
  components: {
    LazyImg
  },
  props: {
    goods: {
      type: Object,
      require: true,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped>
.goods-item {
  font-size: 0;
  height: 100%;

  &__thumbnail {
    width: 100%;
    height: 100% !important;
    object-fit: cover;
  }

  &__link{
    display: inline-block;
    width: 100%;
    height: 7.2rem;
    overflow: hidden;
    font-size: 0;
  }
}
</style>
