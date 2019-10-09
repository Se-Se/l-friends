<template>
  <ModalLayerPopup :visible.sync="inquiryPopup" layer_class="layer_qna_report" popup_size_class="roller_area popup_size_3" :close_confirm_msg="cancleConfirmMsg" popup_name="inquiry" @closeInquiryPopup="closeInquiryPopup">
    <div class="old-css">
      <div class="popup_wrap">
        <div class="layer-popup__content">
          <div class="popup_common">
            <header class="layer-popup__header">
              <h2 class="layer-popup__header--title">
                <span class="num">1:1</span>{{ $t('mypage.inquiry.addText') }}
              </h2>
              <button
                type="button"
                class="layer-popup__header--btn"
                @click="closeInquiryPopup"
              >
                {{ $t('mypage.inquiry.close') }}
              </button>
            </header>
            <div class="con">
              <table class="table_info sp_2">
                <tbody>
                  <tr>
                    <th>
                      <span class="must">{{ $t('mypage.inquiry.kinds.type') }}</span>
                    </th>
                    <td>
                      <SelectBox ref="selectBox" :inquiryTypeName="inquiryTypeName" :items="inquiryTypeItems" @change="selectInquiryType" />
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <span class="must">{{ $t('mypage.inquiry.kinds.title') }}</span>
                    </th>
                    <td>
                      <div class="input" style="margin-left:0;">
                        <input type="text" maxlength="200" title="문의제목 입력" v-model="inquiryTitle">
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <span class="must">{{ $t('mypage.inquiry.kinds.area') }}</span>
                    </th>
                    <td>
                      <div class="contact-modify__area" style="padding-top:0;">
                        <textarea :placeholder="inquiryTypeDescription" maxlength="2000" v-model="inquiryContent" style="resize: none;"></textarea>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>첨부</th>
                    <td>
                      <div class="btn_file">
                        <input type="file" id="fileElem" class="fileElem" name="fileElem" multiple="" accept="image/*" @change="changeFile">
                        <div class="file-list">
                          <label class="file-label" for="fileElem">
                            <span class="file__action">파일선택</span>
                          </label>
                        </div>
                      </div>
                      <div class="file_list">
                        <ul>
                          <li>
                            <span>{{originalFileName}}</span>
                            <button
                              v-if="originalFileName !== ''"
                              class="btn_del"
                              @click.prevent="deleteFile"></button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>답변알림</th>
                    <td>
                      <div class="check_list_1">
                        <ul>
                          <li v-if="profile && profile.email">
                            <span class="bx_input">
                              <input
                                id="email"
                                type="checkbox"
                                class="switch-input"
                                :checked="answerEmailSendYn"
                                @click="answerEmailSendYn = !answerEmailSendYn"
                              >
                              <label for="email">
                                <span
                                  class="switch-label__action checkbox"
                                ></span>
                                <p
                                  :class="{
                                    'switch-label__title': true
                                  }"
                                >
                                  <strong>이메일 :</strong> {{ profile && profile.email }}
                                  <!-- <template v-if="profile.memberGroups && profile.memberGroups.length > 0">
                                    <br />
                                    <br />
                                    <strong>휴대전화 :</strong> {{ getProfileMobileNo }}
                                  </template> -->
                                </p>
                              </label>
                              <!-- <input type="checkbox" id="email" :checked="answerEmailSendYn" @click="answerEmailSendYn = !answerEmailSendYn"> -->
                              <!-- <label for="email">이메일</label> -->
                            </span>
                            <!-- <span class="contact num">{{ profile && profile.email }}</span> -->
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <ul class="btn_list">
                <li>
                  <button class="default-button _half" @click="closeInquiryPopup">취소</button>
                </li>
                <li>
                  <button class="default-button _half active" v-not-double-click @click.prevent="signInInquiry">등록</button>
                </li>
              </ul>
            </div>
          </div>
          <button class="btn_close" @click="closeInquiryPopup">close</button>
        </div>
      </div>
    </div>
  </ModalLayerPopup>
</template>
<style scoped>
#container.mypage .popup_common h1 {
  text-align: left;
}
.layer_popup .popup_common .btn_close {
  top: 40px;
  right: 40px;
}
#container.mypage .popup_common .table_info.sp_2 th {
  height: 72px;
  width: 132px;
}
#container.mypage .popup_common .table_info.sp_2 td {
  border-bottom: none;
  padding-left: 20px;
}
#container.mypage .popup_common .check_list_1 {
  margin: 0;
}
#container.mypage .popup_common .check_list_1 ul li {
  display: list-item;
  margin-right: 0;
  width: auto;
}
</style>

<script>
import { telnoFormat } from '@/utils/StringUtils'
import ModalLayerPopup from '@/components/popup/ModalLayerPopupNew'
import SelectBox from '@/components/common/SelectBoxNew'
import InputApp from '../../../assets/Input'
import SignInInquiry from '@/components/mixins/mypage/inquiry/SignInInquiryNew'

export default {
  mixins: [SignInInquiry],
  components: {
    ModalLayerPopup,
    SelectBox,
    InputApp
  },
  computed: {
    getProfileMobileNo () {
      if (this.profile) {
        let formatResult = telnoFormat(this.profile.mobileNo)
        return `${formatResult[0]}-${formatResult[1]}-${formatResult[2]}`
      }
    }
  }
}
</script>
