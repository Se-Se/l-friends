<template>
  <div>
    <sub-page-header
      title="1:1문의 등록"
      :onClose="() => { $emit('close') }"
    />

    <div id="container">
      <div class="input-row">
        <app-label
          :style="{ 'line-height': 1.67 }"
          :required="true"
          target="type"
        >
          문의유형
        </app-label>
        <app-select
          id="type"
          ref="selectBox"
          v-model="inquiryTypeNo"
          :options="[
            { label: '선택해주세요', value: '', description: '' },
            ...inquiryTypeItems
          ]"
        />
      </div>
      <div class="input-row">
        <app-label
          target="title"
          :required="true"
        >
          문의제목
        </app-label>
        <app-input
          id="title"
          type="text"
          size="large"
          v-model="inquiryTitle"
        />
      </div>
      <div class="input-row">
        <app-label
          target="content"
          :required="true"
        >
          문의내용
        </app-label>
        <app-textarea
          id="content"
          v-model="inquiryContent"
          :height="21.6"
          :placeholder="getInquiryDescription"
          :maxLength="2000"
        />
      </div>
      <div class="input-row" style="font-size:12px;">
        <app-label>
          첨부
        </app-label>
        <file-selector
          id="file"
          v-model="file"
          single
        />
      </div>
      <div class="input-row">
        <app-label>
          답변알림
        </app-label>

        <ul class="receive-contact">
          <li class="receive-contact__item">
            <app-checkbox
              id="inquiry-email"
              v-model="answerEmailSendYn"
            >
              <span class="public-check">이메일</span>
              <span class="user-info">{{ profile.email }}</span>
              <!-- <template v-if="profile.memberGroups && profile.memberGroups.length > 0">
                <span class="public-check" style="margin-left: 37px">휴대전화</span>
                <span class="user-info">{{ getProfileMobileNo }}</span>
              </template> -->
            </app-checkbox>
          </li>
        </ul>
      </div>
      <div>
        <app-button
          type="success"
          size="normal"
          @click="submit"
        >
           등록
        </app-button>
      </div>
    </div>
  </div>
</template>

<script>
import SubPageHeader from '@/components/mobile/layout/header/SubPageHeader'
import AppButton from '@/components/mobile/common/button/Button'
import AppInput from '@/components/mobile/common/input/Input'
import AppSelect from '@/components/mobile/common/input/Select'
import AppCheckbox from '@/components/mobile/common/input/Checkbox'
import AppTextarea from '@/components/mobile/common/input/Textarea'
import AppLabel from '@/components/mobile/common/form/Label'
import FileSelector from '@/components/mobile/common/input/FileSelector'
import SignInInquiry from '@/components/mixins/mypage/inquiry/SignInInquiryNew'
import SelectBox from '@/components/common/SelectBoxNew'
import { telnoFormat } from '@/utils/StringUtils'

export default {
  name: 'ProfileInquiryNew',
  mixins: [SignInInquiry],
  components: {
    SelectBox,
    SubPageHeader,
    AppButton,
    AppTextarea,
    AppInput,
    AppSelect,
    AppCheckbox,
    AppLabel,
    FileSelector
  },
  data () {
    return {
      file: null
    }
  },
  computed: {
    getProfileMobileNo () {
      if (this.profile) {
        let formatResult = telnoFormat(this.profile.mobileNo)
        return `${formatResult[0]}-${formatResult[1]}-${formatResult[2]}`
      }
    },
    getInquiryDescription () {
      const type = this.inquiryTypeItems.filter(item => item.value === this.inquiryTypeNo)
      return type.length > 0 ? type[0].description : ''
    }
  },
  watch: {
    file (next) {
      if (next) {
        this.uploadFile = next[0].original
        this.originalFileName = this.uploadFile.name
      } else {
        this.uploadFile = null
        this.originalFileName = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#container {
  padding: 3.3rem 2rem 4rem;
}

.input-row {
  margin-bottom: 3.1rem;
}

#content {
  padding-bottom: 4rem;
  margin-bottom: 2rem;
}

.public-check {
  margin-left: 1.1rem;
  font-family: 'Noto Sans KR';
  font-size: 1.4rem;
  font-weight: normal;
  line-height: normal;
  letter-spacing: -0.01rem;
  color: #333;
}

.receive-contact {
  padding-top: 1rem;

  &__item {
    &:not(:last-child) {
      margin-bottom: 1.6rem;
    }

    .public-check {
      display: inline-block;
      width: 7.7rem;
      font-family: 'Noto Sans KR';
      font-size: 1.4rem;
      font-weight: normal;
      line-height: normal;
      letter-spacing: -0.01rem;
      color: #333;
    }

    .user-info {
      font-family: 'Noto Sans KR';
      font-size: 1.4rem;
      font-weight: normal;
      line-height: normal;
      letter-spacing: -0.01rem;
      color: #666;
    }
  }
}

input[type=file] {
  display: none;
}

.file-select-btn {
  width: 13.6rem;
}

.selected-files-text {
  margin-top: 1.3rem;

  &__item {
    font-family: 'Noto Sans KR';
    font-size: 1.4rem;
    font-weight: normal;
    line-height: normal;
    letter-spacing: -0.01rem;
    color: #333;

    a {
      display: inline-block;
      vertical-align: top;
      margin-top: 0.8rem;
      margin-left: 0.766rem;
      width: 0.7rem;
      height: 0.7rem;
      font-size: 0;
      background-size: 100% 100%;
      background-image: url(~@/assets/images/mobile/small-close.svg);
    }
  }
}

.selected-files-thumb {
  margin-top: 2rem;
  display: grid;
  grid-gap: 0.7rem 0.7rem;
  grid-template-columns: repeat(auto-fit, 6rem);

  &__item {
    font-size: 0;
    height: 6rem;
    background-size: cover;
    background-position: center center;
    border: 1px solid #ededed;
    text-align: right;

    a {
      display: inline-block;
      vertical-align: top;
      width: 1.7rem;
      height: 1.7rem;
      margin: -0.01rem -0.01rem 0 0;
      font-size: 0;
      background-size: 100% 100%;
      background-image: url(~@/assets/images/mobile/background-close.svg);
    }
  }
}
</style>
