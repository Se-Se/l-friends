<template>
  <section class="main-title">
    <h2>{{ title }}</h2>
  </section>
</template>
<script>
export default {
  name: 'MainTitle',
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>
