<template>
  <ul class="image-grid">
    <li
      v-for="(image, key) in images"
      :key="key"
      :style="{ width: width, height: width, marginLeft: isFirst(key) ? 0 : margin + 'rem' }"
      class="image-grid__item"
      @click="onClick(image)"
    >
      <lazy-img
        :src="links[key]"
      />
      <p v-if="image.label && label">
        {{ image.label }}
      </p>
    </li>
  </ul>
</template>

<script>
import LazyImg from '@/components/common/LazyImg'

export default {
  name: 'ImageGrid',
  components: {
    LazyImg
  },
  props: {
    images: {
      type: Array,
      required: true
    },
    cols: {
      type: Number,
      default: 3
    },
    label: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      margin: 0.8
    }
  },
  computed: {
    width () {
      return 'calc(' + (89.3 / this.cols) + 'vw - ' + (((this.cols - 1) * this.margin) / this.cols) + 'rem)'
    },
    links () {
      let links = []
      for (let image of this.images) {
        links.push(image.src || image)
      }

      return links
    }
  },
  methods: {
    onClick (image) {
      if (!image.link) return

      if (image.link.substr(0, 1) === '/') {
        this.$router.push(image.link)
      } else {
        window.open(image.link)
      }
    },
    isFirst (key) {
      return (key % this.cols) === 0
    }
  }
}
</script>

<style lang="scss" scoped>
.image-grid {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1.2rem;

  &__item {
    margin-bottom: 0.8rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
