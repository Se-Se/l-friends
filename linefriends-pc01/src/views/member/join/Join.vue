<template>
  <div id="container" class="login">
    <Join-form @openTermService="openTermService" @openTermPrivate="openTermPrivate"></Join-form>
    <Term-service v-if="serviceShow" @closeTermService="closeTermService"></Term-service>
    <Term-private v-if="privateShow" @closeTermPrivate="closeTermPrivate"></Term-private>
  </div>
</template>
<script>
import JoinForm from '@/components/member/join/JoinForm'
import TermService from '@/components/member/join/TermService'
import TermPrivate from '@/components/member/join/TermPrivate'
export default {
  data () {
    return {
      serviceShow: false,
      privateShow: false
    }
  },
  components: {
    JoinForm,
    TermService,
    TermPrivate
  },
  methods: {
    openTermService () {
      this.serviceShow = true
    },
    openTermPrivate () {
      this.privateShow = true
    },
    closeTermService () {
      this.serviceShow = false
    },
    closeTermPrivate () {
      this.privateShow = false
    }
  }
}
</script>
