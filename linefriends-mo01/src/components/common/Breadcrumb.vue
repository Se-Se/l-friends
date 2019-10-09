<template>
  <div class="wrap_category">
    <div class="category_left">
      <a href="#" class="btn_back" @click.prevent="goBack">Back</a>
    </div>
    <h2>{{title}}</h2>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    path: {
      type: String
    }
  },
  data () {
    return {}
  },
  methods: {
    goBack () {
      if (this.path) {
        this.$router.push(this.path)
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>
