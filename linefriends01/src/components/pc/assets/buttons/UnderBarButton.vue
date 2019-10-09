
<template>
  <div
    v-if="data.action === 'button'"
    :class="{
      'under-bar-button' : true
    }"
    @click="actions()"
  >
    {{ data.title }}
  </div>
  <a
    v-else-if="data.action === 'link'"
    :href="data.to"
    :class="{
      'under-bar-button' : true,
      link: true
    }"
  >
    {{ data.title }}
  </a>
</template>
<script>
export default {
  name: 'UnderBarButton',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  methods: {
    actions () {
      this.$emit('childs-event', false)
    }
  }
}
</script>
