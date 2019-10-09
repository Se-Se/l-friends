<template>
  <div class="character-box">
    <div class="character-box__wrapper">
      <div class="character-box__header">
        <figure
          class="character-box__header-fig"
          :style="{width: (char.figureWidth) + 'rem'}"
        >
          <img
            :src="char.charImage"
          >
        </figure>
      </div>
      <div class="character-box__info">
        <dl class="character-box__info-wrapper">
          <dt class="character-box__info-header">
            <figure
              class="character-box__info-title"
              :style="{width: (char.titleWidth) + 'rem'}"
            >
              <img
                :src="char.chartitle"
              >
            </figure>
            <p class="character-box__info-status">
              {{ char.status }}
            </p>
          </dt>
          <dd
            class="character-box__info-guide"
            v-html="char.guide"
          />
          <dd class="character-box__info-more">
            <router-link :to="char.path">상품 더보기<em /></router-link>
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CharacterBox',
  props: {
    char: {
      type: Object,
      required: true
    }
  }
}
</script>
