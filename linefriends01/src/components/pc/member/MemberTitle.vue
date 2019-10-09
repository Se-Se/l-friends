<template>
  <div class="member-title">
    <h2>{{ title }}</h2>
  </div>
</template>
<script>
export default {
  name: 'MemberTitle',
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>
