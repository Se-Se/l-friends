<template>
  <article class="brand-container__wrapper">
    <div class="brand-header">
      <h3 class="brand-title">
        {{ brand.label }}
      </h3>
      <router-link
        v-if="hamberger"
        :to="brand.intro"
        class="character-link"
        
      >
        {{ $t('character.intro') }}
      </router-link>
    </div>
    <ul
      :class="{
        'brand-container': true,
        '_all': allcharacter === true
      }"
      :style="{ 'grid-column-gap': gap + 'rem' }"
    >
      <li class="brand-container__item">
        <brand-item
          :brand="all"
          @select="selectBrand"
          @commitLeftClose="commitLeftClose"
        />
      </li>
      <li
        v-for="(item, key) in brand.brands"
        :key="key"
        class="brand-container__item"
      >
        <brand-item
          :brand="item"
          @select="selectBrand"
          @commitLeftClose="commitLeftClose"
        />
      </li>
    </ul>
  </article>
</template>

<script>
import BrandItem from './BrandItem'

export default {
  name: 'BrandContainer',
  components: {
    BrandItem
  },
  props: {
    brand: {
      type: Object,
      required: true
    },
    gap: {
      type: Number,
      default: 1.9
    },
    hamberger: {
      type: Boolean,
      default: false
    },
    allcharacter: {
      type: Boolean,
      required: false
    }
  },
  computed: {
    all () {
      return {
        ...this.brand,
        label: this.$t('character.all')
      }
    }
  },
  methods: {
    selectBrand (brandNo) {
      this.$emit('select', brandNo)
    },
    commitLeftClose () {
      this.$emit('commitLeftClose')
    }
  }
}
</script>

<style lang="scss" scoped>
.brand {
  &-container {
    display: inline-block;
    position: relative;
    margin: -1rem -1.2rem;
    font-size: 0;
    
    &._all {
      display: inline-block;
      position: relative;
      width: 30.5rem;
      margin: -1rem -1.2rem;
      font-size: 0;
    
    }

    &__wrapper {
      background: #fafafa;
      padding: 2.2rem 2rem 2.45rem;
    }

    &__item{
      display: inline-block;
      width: 25%;
      padding: 1rem 1.2rem;
      vertical-align: top;
    }
  }

  &-header {
    display: flex;
    justify-content: space-between;
    align-content: bottom;
    margin-bottom: 1.8rem;
  }

  &-title {
    padding-left: 0.25rem;
    font-family: 'Noto Sans KR';
    font-weight: normal;
    font-size: 1.42rem;
    letter-spacing: -0.02rem;
    color: #999;
  }

  &-link {
    display: inline-block;
    color: #4ba4d9;
    text-decoration: underline;
    font-size: 1.2rem;
    font-family: 'Noto Sans KR';
    font-weight: normal;
    padding: 0.1rem 0.3rem 0 0;
  }
}
  
.character{
  &-link{
    color: #4BA4D9;
  }
}
</style>
