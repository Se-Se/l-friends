<template>
  <div class="thumbnail" :class="{itemcard_type: stockCnt !== 0, ico_soldout: stockCnt === 0}">
    <template v-if="isDelLazy">
      <img :src="image" :key="image" alt="" :class="isTransverse?'transverse':'vertical'">
    </template>
    <template else>
      <img v-if="image" v-lazy="image" :key="image" alt="" :class="isTransverse?'transverse':'vertical'">
      <span v-else class="sp ico_item_default"></span>
    </template>
  </div>
</template>

<script>
// import cookies from 'js-cookie'
// import { isLogined } from '@/utils/utils'
export default {
  props: ['image', 'stockCnt', 'isDelLazy'],
  data: function () {
    return {
      isTransverse: true
      // onerrorImg: `this.src="${require('../../assets/images/sub/img_payco.jpg')}"`
    }
  },
  methods: {
    formatImg () {
      let image = new Image()
      image.src = this.image
      image.onload = () => {
        this.isTransverse = (image.width > image.height)
        image = null
      }
    }
  },
  mounted () {
    this.formatImg()
  },
  updated () {
    this.formatImg()
  }
}
</script>