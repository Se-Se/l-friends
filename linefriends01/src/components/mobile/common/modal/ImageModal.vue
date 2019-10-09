<template>
  <modal :bus="bus">
    <div class="image-modal">
      <div class="image-current">
        <a
          href="#"
          :class="{ 'image-prev-btn': true, disable: isFirst }"
          @click.prevent="prevImage"
        >&lt;</a>
        <div class="image-current__img-block">
          <img
            class="image-current__img"
            :src="images ? images[active] : ''"
          >
        </div>
        <a
          href="#"
          :class="{ 'image-next-btn': true, disable: isLast }"
          @click.prevent="nextImage"
        >&gt;</a>
      </div>
      <ul class="image-nav">
        <li
          v-for="(image, key) in images"
          :key="key"
          :style="{ backgroundImage: 'url(' + image + ')' }"
          :class="['image-nav__item', active === key ? 'active' : '']"
          @click="active = key"
        />
      </ul>
    </div>
  </modal>
</template>

<script>
import Vue from 'vue'
import Modal from './Modal'

export default {
  name: 'ImageModal',
  components: {
    Modal
  },
  props: {
    bus: {
      type: Vue,
      required: true
    }
  },
  data () {
    return {
      images: [],
      active: 0
    }
  },
  computed: {
    isFirst () {
      return this.active === 0
    },
    isLast () {
      return this.active === (this.images.length - 1)
    }
  },
  created () {
    this.bus.$on('open', (images, index) => {
      this.images = images
      this.active = index || 0
    })
  },
  methods: {
    prevImage () {
      if (!this.isFirst) {
        this.active--
      }
    },
    nextImage () {
      if (!this.isLast) {
        this.active++
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.image-prev-btn, .image-next-btn {
  display: inline-block;
  width: 3.8rem;
  height: 3.8rem;
  font-size: 0;
  background-size: 100% 100%;
}

.image-prev-btn {
  background-image: url(~@/assets/images/mobile/left-arrow-round.svg);
}

.image-next-btn {
  background-image: url(~@/assets/images/mobile/right-arrow-round.svg);
}

.image-current {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  width: 27.8rem;

  &__img-block {
    width: 15rem;

    img {
      width: 100%;
    }
  }
}

.image-nav {
  margin: 3.6rem auto 0;
  padding-bottom: 6.2rem;
  width: 25.6rem;
  display: grid;
  grid-gap: 0.4rem 0.4rem;
  grid-template-columns: repeat(auto-fit, 6rem);

  &__item {
    width: 6rem;
    height: 6rem;
    background-size: cover;
    border: 1px solid #ededed;

    &.active {
      border-bottom-width: 3px;
    }
  }
}
</style>
