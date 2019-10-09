<template>
  <div class="character-box">
    <div 
      class="character-box__wrapper"
      :style="{bottom: (box.wrapperBottom) + 'px'}"
    >
      <div class="character-box__header">
        <figure
          class="character-box__header-fig"
          :style="{width: (box.figureWidth) + 'px'}"
        >
          <img
            :src="box.charImage"
          >
        </figure>
      </div>
      <div class="character-box__info">
        <dl class="character-box__info-wrapper">
          <dt class="character-box__info-header">
            <figure
              class="character-box__info-title"
              :style="{width: (box.titleWidth) + 'px'}"
            >
              <img
                :src="box.chartitle"
              >
            </figure>
            <p class="character-box__info-status">{{box.status}}</p>
          </dt>
          <dd
            v-html="box.guide"
            class="character-box__info-guide"
          />
          <dd class="character-box__info-more">
            <router-link :to="box.path">
            상품 더보기<em></em>
            </router-link>
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Bt21Box',
  props: {
    box: {
      type: Object,
      required: true
    }
  }
}
</script>
