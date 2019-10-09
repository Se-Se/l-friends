<template>
  <div class="character-guide">
    <h2>{{ guide.title }}</h2>
    <p v-html="guide.intro" />
    <template v-if="$route.name === 'Bt21'">
      <div class="character-guide__link">
        <a href="https://bt21.com/character?mode=relations" target="_blanck">FAMILY & FRIENDS </a>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'CharacterGuide',
  props: {
    guide: {
      type: Object,
      required: true
    }
  }
}
</script>
