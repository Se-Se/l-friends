<template>
  <a href="#" @click.prevent="search">
    <div class="brand-item">
      <img :src="brand.icon" class="brand-thumb">
      <p class="brand-name">
        {{ brand.label }}
      </p>
    </div>
  </a>
</template>

<script>
export default {
  name: 'BrandItem',
  props: {
    brand: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      from: null
    }
  },
  methods: {
    search () {
      if (this.$route.name === 'BrandSelect') {
        this.$emit('select', this.brand.brandNo)
      } else {
        this.$router.push({
          path: '/goods',
          query: {
            ...this.$route.query,
            brandNo: this.brand.brandNo,
            brandName: this.brand.label
          }
        })
        this.$emit('commitLeftClose')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.brand {
  &-thumb {
    width: 100%;
  }

  &-name {
    margin-top: 0.4rem;
    text-align: center;
    font-family: "Noto Sans KR";
    font-size: 1.2rem;
    font-weight: normal;
    color: #666;
  }
}
</style>
