<template>
  <span class="myreview-popup">
    <template v-if="mode === 'WRITE'">
      <ul class="btn_style_4">
        <li>
          <button class="white-button review btn_horizontal" @click="openAddPopup">상품평 작성하기</button>
        </li>
      </ul>
    </template>
    <template v-if="mode === 'MODIFY'">
      <button type="button" class="white-button review btn_horizontal" @click="openModifyPopup">
        수정
      </button>
    </template>

    <div class="layer-popup" v-if="popupOn">
      <div class="layer-popup__dim"></div>
      <div class="layer-popup__reviewContent">
        <header class="layer-popup__header">
          <h2 class="layer-popup__header--title">
            <h1>상품평 작성</h1>
          </h2>
          <button 
            class="layer-popup__header--btn"
            @click="closePopup"
          >
            닫기
          </button>
        </header>
        <div>
          <div class="con">
            <table class="table_info sp_2">
              <tbody>
                <tr>
                  <th>
                    <span class="must">만족도</span>
                  </th>
                  <td class="review">
                    <div class="review_info">
                      <span class="review_score" @click.stop="getPoint" ref="star">
                        <span class="graph sp" :style="{width: starPoint * 20 + `%`}">
                          <strong class="blind">{{starPoint}}</strong>
                        </span>
                        <span class="blind">/ 5.0</span>
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>
                    <span class="must">상품평</span>
                  </th>
                  <td
                    :class="{
                      active : textArea === true
                    }"
                    @click="textAreaChk"
                  >
                    <textarea :placeholder="$t('mypage.productinquiry.placeholder.pc.content')" v-model="content" maxlength="1000" style="font-size:12px;"></textarea>
                  </td>
                </tr>
                <tr>
                  <th>첨부</th>
                  <td>
                    <div class="btn_file review-file">
                      <input type="file" id="fileElem" class="fileElem" name="fileElem" multiple ref="inputFile" accept="image/*" @change="onFileChange">
                      <label class="btn btn_gray2 review-file__action" for="fileElem" @click="addImage">파일선택</label>
                    </div>
                    <div class="upload_view_new">
                      <ul>
                        <template v-for="(image, index) in images">
                          <li :key="index">
                            <product-img :image='image.filedata'></product-img>
                            <button class="btn_close review-file__close" @click="removeImage(index)">close</button>
                          </li>
                        </template>
                      </ul>
                    </div>
                    <div class="review-tip">
                      <span>사진은 최대 10장까지 등록 가능합니다.</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="txt_ex_2">
              <p>상품평 작성을 완료하시면 구매확정으로 처리됩니다.</p>
            </div>
            <div class="btn_list">
                <button class="btn cancel" @click="closePopup">취소</button>
                <button class="btn add" @click="registReview">등록</button>
            </div>
          </div>
        </div>
      </div> 
    </div>
  </span>
</template>
<style scoped>
#container.mypage .popup_common .tip_1 {
  position: inherit;
  margin-left: 0;
}
#container.mypage .popup_common .txt_ex_2 {
  float: inherit;
  text-align: left;
}
.popup_wrap .popup_common .upload_view_new {
  margin-top: 20px;
  font-size: 0;
}

.popup_wrap .popup_common .upload_view_new li {
  width: 100px;
  height: 100px;
  display: inline-block;
  position: relative;
  margin: 0 10px 10px 0;
}

.popup_wrap .popup_common .upload_view_new .btn_close {
  width: 20px;
  height: 20px;
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  /* background: url('../../../../assets/img/btn_pic_close.png') no-repeat 0 0; */
}
</style>

<script>
import AddReviewNew from '@/components/mixins/mypage/review/leaf/AddReviewNew'

export default {
  mixins: [AddReviewNew]
}
</script>

<style>
.btn_circle {
  padding: 0 14px;
  border: 1px solid #ddd;
  border-radius: 15px;
  line-height: 28px;
}

.must {
  position: relative;
}

.must:after {
  display: block;
  content: "";
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #00d664;
  position: absolute;
  top: 0;
  right: -7px;
}
</style>
