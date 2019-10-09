<template>
  <div>
    <input :type="type" />
  </div>
</template>
<script>
export default {
  name: 'Input',
  props: {
    type: {
      type: String,
      required: true
    }
  }
}
</script>
