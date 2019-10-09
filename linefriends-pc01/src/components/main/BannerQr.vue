<template>
  <div class="accounts">
    <h2 class="ttl_1">公式アカウント</h2>
    <p class="ttl_sub">最新情報をお届けします。</p>
    <div class="accounts_con">
      <div class="qr" v-for="(banner, index) in banners" :key="`qr_${index}`">
        <div class="thumbnail" @click="moveTo(banner)">
          <img :src="banner.imageUrl">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['banners'],
  methods: {
    moveTo (data) {
      location.href = data.landingUrl
    }
  }
}
</script>
