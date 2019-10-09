<template>
  <span v-if="showAdultImg" class="ico_adult">19</span>
  <span v-else-if="!imgLoading" class="sp ico_item_default">
    <img @load="loadImg" style="display: none" :src="src" />
  </span>
  <img v-else @load="loadImg" :src="src"/>
</template>
<script>
  export default {
    props: ['src', 'adult'],
    data () {
      return {
        imgLoading: false
      }
    },
    computed: {
      showAdultImg () {
        return this.adult && !this.src
      }
    },
    methods: {
      loadImg () {
        this.imgLoading = true
      }
    }
  }
</script>
