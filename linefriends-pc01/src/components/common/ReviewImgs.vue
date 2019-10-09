<template>
  <div>
    <div class="img_area">
      <ul class="review_img cf">
        <li v-for=" (imageUrl, index) in images" :key="index" @click="openPopup(index)">
          <div class="thumbnail">
            <img class="item_img" :src="imageUrl" alt="" >
          </div>
        </li>
      </ul>
    </div>
    <template v-if="popupOn">
      <review-img-popup ref="imgPopup" :num="theIndex" :images="popupImgs" @close="closePopup" />
    </template>
  </div>

</template>

<script>
import $ from 'jquery'
import ReviewImgPopup from '@/components/common/ReviewImgPopup'
export default {
  data () {
    return {
      popupOn: false,
      popupImgs: [],
      theIndex: 0
    }
  },
  props: {
    images: {}
  },
  components: {
    ReviewImgPopup
  },
  computed: {

  },
  created () {
    this.popupImgs = this.images
  },
  methods: {
    openPopup (index) {
      this.theIndex = index + 1
      this.popupOn = true
      this.$nextTick(() => {
        this.$refs.imgPopup.swiperSlideTo(index)
      })
      $('body').css('overflow', 'hidden')
    },
    closePopup () {
      this.popupOn = false
      $('body').css('overflow', '')
    }
  },
  mounted () {
  },
  destroyed () {
    $('body').css('overflow', '')
  }
}
</script>
