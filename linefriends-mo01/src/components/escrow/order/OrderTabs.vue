<template>
    <ul class="tab_list">
        <!--<li><a href="#">最近の配送紙</a></li>-->
        <!--<li class="on"><a href="#">新規配送</a></li>-->
        <li v-for="(id, label) in tabs" :key="id" :class="{ '': true, 'on': id === active }" @click="tabUpdate(id)"><a href="#">{{label}}</a></li>
    </ul>
</template>

<script>
export default {
  name: 'OrderTabs',
  props: ['value', 'tabs'],
  data () {
    return {
      active: this.value
    }
  },
  watch: {
    value (next) {
      this.active = next
    }
  },
  methods: {
    tabUpdate (id) {
      this.$emit('input', id)
    }
  }
}
</script>
