<template>
  <div class="popup-layer">
    <div class="member-popup">
      <div class="popup-header">
        <h1>個人情報の取得・利用同意</h1>
      </div>
      <div class="popup-text">
        <p><strong>個人情報の取得・利用同意</strong>
          個人情報の取得・利用同意</p>
      </div>
      <div class="popup-footer">
        <button class="btn btn_green" @click="closeTermPrivate()">確認</button>
      </div>
      <button class="btn_close" @click="closeTermPrivate()">X</button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    closeTermPrivate () {
      this.$emit('closeTermPrivate')
    }
  }
}
</script>

<style type = "text/css" >
p.p1 {
  margin: 0px 0px 0px 0px;
  text-align: justify;
  font: 12px ".Apple SD Gothic NeoI";
}
p.p2 {
  margin: 0px 0px 0px 0px;
  text-align: justify;
  font: 12px "Helvetica Neue";
  min-height: 14px;
}
p.p3 {
  margin: 0px 0px 0px 0px;
  text-align: justify;
  font: 12px "Helvetica Neue";
}
span.s1 {
  font: 12px "Helvetica Neue";
}
span.s2 {
  font: 12px "Lucida Grande";
}
span.s3 {
  font: 12px ".Apple SD Gothic NeoI";
}
</style>
