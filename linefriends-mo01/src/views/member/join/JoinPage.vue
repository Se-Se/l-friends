<template>
  <div id="container" class="login">
    <Breadcrumb :title="'会員登録'"></Breadcrumb>
    <Join-form></Join-form>
  </div>
</template>
<script>
import JoinForm from '@/components/member/join/JoinForm'
import Breadcrumb from '@/components/common/Breadcrumb'
export default {
  components: {
    JoinForm,
    Breadcrumb
  }
}
</script>
