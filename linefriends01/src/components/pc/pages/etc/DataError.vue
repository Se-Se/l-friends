<template>
  <div>
    <div id="container" class="etc_warning">
      <div class="etc_inner">
        <div class="con_1">
          <span class="ico_ti sp">warning</span>
          <h1>데이터를 불러올 수 없습니다.</h1>
          <p class="txt_1 mar-top-20">일시적으로 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p>
          <ul class="btn_area">
            <li>
              <button class="btn btn_red" @click.prevent="goBack">재시도</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import MinHeader from '@/components/header/MinHeader'
export default {
  methods: {
    goBack () {
      window.history.back()
    }
  }
}
</script>
