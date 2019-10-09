<template>
  <article
    class="main-article"
    :style="{
      background: background,
      'padding-top': !title ? paddingTop + 'rem' : '4rem',
      'padding-bottom': paddingBottom + 'rem',
      'padding-left': paddingSide + 'rem',
      'padding-right': paddingSide + 'rem'
    }"
  >
    <header
      v-if="title"
      class="main-article__header"
      :style="{ 'padding-bottom': paddingTop + 'rem', 'text-align': left ? 'left' : 'center' }"
    >
      <span
        v-if="label"
        class="main-article__label"
        :style="{ backgroundColor: label.color }"
      >{{ label.name }}</span>
      <h3 class="main-article__title">
        {{ title }}
      </h3>
      <p
        v-if="subtitle"
        class="main-article__subtitle"
      >
        {{ subtitle }}
      </p>
    </header>
    <slot />
  </article>
</template>

<script>
export default {
  props: {
    label: {
      type: [Object, Boolean],
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    background: {
      type: String,
      default: '#ffffff'
    },
    paddingTop: {
      type: Number,
      default: 1.5
    },
    paddingBottom: {
      type: Number,
      default: 4
    },
    paddingSide: {
      type: Number,
      default: 2
    },
    left: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.main-article {
  padding: 4rem 2rem;

  &__header {
    text-align: center;
    padding: 0 2rem;
  }

  &__label {
    display: inline-block;
    margin-bottom: 0.7rem;
    padding: 0.3rem 0.833rem 0;
    font-family: Volte, sans-serif;
    font-weight: 600;
    font-size: 1.3rem;
    color: #fff;
    line-height: 1;
    letter-spacing: -0.01rem;
    height: 1.8rem;
    border-radius: 0.9rem;
  }

  &__title {
    font-family: "Noto Sans KR",sans-self;
    font-size: 2.2rem;
    font-weight: bold;
    line-height: 1.33;
    letter-spacing: -0.01rem;
    color: #333;
  }

  &__subtitle {
    font-family: 'Noto Sans KR';
    font-size: 1.4rem;
    font-weight: normal;
    line-height: 1.3rem;
    padding-top: 0.8rem;
    letter-spacing: -0.011rem;
    color: #666;
  }
}
</style>
