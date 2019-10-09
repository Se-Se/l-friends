<template>
  <div class="character-list">
    <div class="character-list__banner">
      <img src="~@/assets/images/pc/others/bt21-banner.png" alt="BT21">
    </div>
    <main-wrapper :main="true">
      <layout-width>
        <div class="character-list__header">
          <h2 class="character-list__header-title">우주스타 BT21</h2>
          <p class="character-list__header-description">
            BT 행성의 왕자 TATA는 VAN과 함께 여행하던 중<br/>
            지구에 불시착하게 되고 사랑을 전파하기 위해 스타가 되기로 결심합니다.<br/>
            그리고 마침내 KOYA, RJ, SHOOKY, MANG, CHIMMY, COOKY.<br/>
            6명의 매력 넘치는 멤버를 만나 우주 최고의 스타를 꿈꾸는 ‘BT21’을 만들게 되는데…<br/>
            BT21은 과연 우주에서 제일 가는 스타가 될 수 있을까요?
          </p>
          <a
            class="character-list__header-router"
            href="https://bt21.com/character?mode=relations"
            target="_blanck">
            FAMILY & FRIENDS
          </a>
        </div>
        <div class="character-list__items">
          <character-box
            v-for="(box, key) in boxes"
            :key = "key"
            :box = "box"
          />
        </div>
      </layout-width>
    </main-wrapper>
  </div>
</template>
<script>
import LayoutWidth from '../../layout/common/LayoutWidth'
import CharacterBox from '../../others/Bt21Box'
import MainWrapper from '../../layout/common/MainWrapper'
import config from '@/config'

export default {
  name: 'CharacterList',
  components: {
    LayoutWidth,
    CharacterBox,
    MainWrapper
  },
  data () {
    return {
      boxes: [
        {
          charImage: '/static/images/pc/char/char-rj.png',
          chartitle: '/static/images/pc/char/name-rj.png',
          status: '다정보스 미식가',
          guide: `요리하는 것도, 맛보는 것도 모두 좋아하는 RJ.<br>
보송보송한 털과 따뜻한 마음으로 모두를 보듬어 줍니다.<br>
#인사 #온순 #파카 #오물오물
`,
          figureWidth: '220',
          titleWidth: '41.3',
          path: `/goods?brandNo=${config.brands[1].brands[2].brandNo}`
        },
        {
          charImage: '/static/images/pc/char/char-chimmy.png',
          chartitle: '/static/images/pc/char/name-chimmy.png',
          status: '천진난만 노력파',
          guide: `노란 후디를 즐겨 입는 CHIMMY<br>
무엇이든 끝없이 노력할 수 있는 열정을 타고났습니다.<br>
#열심 #노력 #하모니카 #노랑후디
`,
          figureWidth: '248',
          titleWidth: '150.1',
          path: `/goods?brandNo=${config.brands[1].brands[3].brandNo}`
        },
        {
          charImage: '/static/images/pc/char/char-cooky.png',
          chartitle: '/static/images/pc/char/name-cooky.png',
          status: '하트 뒤태 반전 근육',
          guide: `귀여운 모습이지만 터프해지길 바라는<br>
반전 매력의 소유자입니다.<br>
#언밸런스 #눈썹 #하트엉덩이 #상상근육
`,
          figureWidth: '204',
          titleWidth: '124.3',
          path: `/goods?brandNo=${config.brands[1].brands[4].brandNo}`
        },
        {
          charImage: '/static/images/pc/char/char-tata.png',
          chartitle: '/static/images/pc/char/name-tata.png',
          status: '48차원 호기심왕자',
          guide: `BT행성에서 온 프린스 TATA<br>
자유자재로 몸이 늘어나며 초능력을 쓸 수 있습니다.<br>
#BT행성 #초능력 #엉뚱 #왕자
`,
          figureWidth: '256',
          titleWidth: '88.7',
          path: `/goods?brandNo=${config.brands[1].brands[0].brandNo}`
        },
        {
          charImage: '/static/images/pc/char/char-koya.png',
          chartitle: '/static/images/pc/char/name-koya.png',
          status: '똑똑한 잠꾸러기',
          guide: `똑똑하고 다재다능한 KOYA<br>
생각도 많고 잠도 많은 잠꾸러기입니다.<br>
#다재다능 #베개 #졸린눈 #탈부착귀
`,
          figureWidth: '204',
          titleWidth: '124.3',
          path: `/goods?brandNo=${config.brands[1].brands[7].brandNo}`
        },
        {
          charImage: '/static/images/pc/char/char-shooky.png',
          chartitle: '/static/images/pc/char/name-shooky.png',
          status: '쪼꼬미 장난부자',
          guide: `작은 몸집에 장난기 가득한 SHOOKY<br>
친구들과 장난을 치는 것을 즐기며 우유를 제일 싫어합니다.<br>
#장난부자 #표정부자 #쪼고미 #뽀시래기친구들
`,
          figureWidth: '246',
          titleWidth: '152.2',
          path: `/goods?brandNo=${config.brands[1].brands[5].brandNo}`
        },
        {
          charImage: '/static/images/pc/char/char-mang.png',
          chartitle: '/static/images/pc/char/name-mang.png',
          status: '미스터리 댄싱머신',
          guide: `춤출 때 가장 멋진 MANG<br>
언제나 가면을 쓰고 다녀 정체가 미스터리합니다.<br>
#하트코 #가면 #미스터리 #춤신춤왕
`,
          figureWidth: '230',
          titleWidth: '106.8',
          path: `/goods?brandNo=${config.brands[1].brands[6].brandNo}`
        },
        {
          charImage: '/static/images/pc/char/char-van.png',
          chartitle: '/static/images/pc/char/name-van.png',
          status: '수호자 우주로봇',
          guide: `세상 모든 지식을 알고 있는 VAN<br>
BT21을 언제나 든든하게 지켜줍니다.<br>
#수호자 #탈것 #변신 #만능로봇
`,
          figureWidth: '262',
          titleWidth: '73.2',
          path: `/goods?brandNo=${config.brands[1].brands[1].brandNo}`
        }
      ]
    }
  }
}
</script>
