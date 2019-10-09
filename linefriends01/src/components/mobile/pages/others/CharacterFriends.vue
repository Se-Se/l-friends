<template>
  <div class="character-intro">
    <sub-page-header title="브라운앤프렌즈"/>
    <div class="character-intro__banner">
      <div class="character-intro__banner-friends">
        <img src="~@/assets/images/mobile/friends-banner.png" alt="브라운앤프렌즈">
        <character-guide
          v-for="(guide, key) in guides"
          :key="key"
          :guide="guide"
        />
      </div>
    </div>
    <characters-container>
      <div class="character-intro__friends">
        <character-box
          v-for="(friend, key) in friends"
          :key="key"
          :char="friend"
        />
      </div>
    </characters-container>
  </div>
</template>

<script>
import SubPageHeader from '../../layout/header/SubPageHeader'
import CharacterGuide from '@/components/mobile/others/CharacterGuide'
import CharactersContainer from '@/components/mobile/others/CharactersContainer'
import CharacterBox from '@/components/mobile/others/CharacterBox'
import config from '@/config'

export default {
  name: 'CharacterIntro',
  components: {
    SubPageHeader,
    CharacterGuide,
    CharactersContainer,
    CharacterBox
  },
  data () {
    return {
      guides: [
        {
          title: '브라운앤프렌즈가 궁금해?',
          intro: `당신의 하루는 어땠나요?<br>
일상적인 아침, 조금 힘들었던 순간,<br>
작은 한마디에 마음이 따뜻했던 오후.<br>
브라운과 친구들도 사랑하는 이들과 함께 웃고,<br>
가끔은 투닥거리기도 합니다.<br><br>
우리의 모습과 닮은 11명의 친구들.<br>
당신의 모든 순간에 브라운과 친구들이<br>
함께할 거예요!
`
        }
      ],
      friends: [
        {
          charImage: '/static/images/pc/char/char-brown.png',
          chartitle: '/static/images/pc/char/name-brown.png',
          status: '내가 다 들어줄게',
          guide: `무심한 듯 무뚝뚝해 보이는 브라운.<br>
하지만 그는 늘 옆에 있어 주고<br>
마음을 들어주는 친구입니다. <br>
에너지 넘치는 코니를 사랑하고,<br>
귀여운 초코의 든든한 오빠입니다. 
`,
          figureWidth: '15.3',
          titleWidth: '9.44',
          path: `/goods?brandNo=${config.brands[0].brands[0].brandNo}`
        },
        {
          charImage: '/static/images/pc/char/char-cony.png',
          chartitle: '/static/images/pc/char/name-cony.png',
          status: '내가 다 사랑해!',
          guide: `열정과 에너지가 넘치는 생기발랄 코니.<br>
사랑하는 브라운 앞에선<br>
자신만의 톡톡 튀는 매력을 마음껏 보여줍니다.
`,
          figureWidth: '13.3',
          titleWidth: '6.98',
          path: `/goods?brandNo=${config.brands[0].brands[1].brandNo}`
        },
        {
          charImage: '/static/images/pc/char/char-sally.png',
          chartitle: '/static/images/pc/char/name-sally.png',
          status: '야호, 내가 최고시다!!',
          guide: `반전 매력을 가진 샐리.<br>
작고 귀여운 샐리는 동에 번쩍, 서에 번쩍!<br>
기발한 행동과 엉뚱한 생각으로 친구들에게<br>
웃음과 즐거움을 주는 매력만점 친구입니다.
`,
          figureWidth: '8.2',
          titleWidth: '8.11',
          path: `/goods?brandNo=${config.brands[0].brands[2].brandNo}`
        },
        {
          charImage: '/static/images/pc/char/char-choco.png',
          chartitle: '/static/images/pc/char/name-choco.png',
          status: '#귀여워 #달콤해 #초코',
          guide: `달콤한 것을 좋아하는 사랑스러운 초코.<br>
브라운을 닮아 무표정이지만,<br>
오빠의 친구들과도 잘 어울리는<br>
귀여운 여동생입니다. 
`,
          figureWidth: '12.4',
          titleWidth: '8.59',
          path: `/goods?brandNo=${config.brands[0].brands[3].brandNo}`
        },
        {
          charImage: '/static/images/pc/char/char-leonard.png',
          chartitle: '/static/images/pc/char/name-leonard.png',
          status: '랄랄라~ 노래할래!',
          guide: `감성 충만 레너드.<br> 
빗소리에 맞춰 노래하는 것을 좋아하고,<br> 
샐리, 에드워드와 함께 꼬꼬마 트리오로<br>
신나게 노는 것도 좋아합니다.
`,
          figureWidth: '11.3',
          titleWidth: '12.11',
          path: `/goods?brandNo=${config.brands[0].brands[5].brandNo}`
        },
        {
          charImage: '/static/images/pc/char/char-moon.png',
          chartitle: '/static/images/pc/char/name-moon.png',
          status: '웃게 해줄게!',
          guide: `보름달을 닮은 재치만점 문.<br> 
어디에서 왔는지 아무도 모르지만,<br> 
빛나는 재치와 유머로 친구들에게<br>
유쾌한 웃음을 안겨줍니다.
`,
          figureWidth: '15.3',
          titleWidth: '7.37',
          path: `/goods?brandNo=${config.brands[0].brands[4].brandNo}`
        },
        {
          charImage: '/static/images/pc/char/char-boss.png',
          chartitle: '/static/images/pc/char/name-boss.png',
          status: '누가 나 불렀어?',
          guide: `호탕한 허당맨 보스.<br>
평범한 직장인이지만 여기저기 뜬금없이 등장해<br>
알 수 없는 매력을 발산합니다. 
`,
          figureWidth: '13.3',
          titleWidth: '6.54',
          path: `/goods?brandNo=${config.brands[0].brands[9].brandNo}`
        },
        {
          charImage: '/static/images/pc/char/char-jessica.png',
          chartitle: '/static/images/pc/char/name-jessica.png',
          status: '우리 얘기할래?',
          guide: `새침하고 똑 부러지는 제시카.<br> 
언제나 명쾌한 해답을 제시하기 때문에<br>
친구들이 자주 찾는 의논 상대입니다.
`,
          figureWidth: '13.4',
          titleWidth: '10.77',
          path: `/goods?brandNo=${config.brands[0].brands[10].brandNo}`
        },
        {
          charImage: '/static/images/pc/char/char-james.png',
          chartitle: '/static/images/pc/char/name-james.png',
          status: '난 내가 너무 좋아!',
          guide: `자신을 누구보다 사랑하는<br>
금발의 멋쟁이 제임스.<br>
쿨하고 시크한 겉모습과는 달리<br>
섬세하고 여린 감성을 지니고 있습니다. 
`,
          figureWidth: '13.3',
          titleWidth: '8.7',
          path: `/goods?brandNo=${config.brands[0].brands[6].brandNo}`
        },
        {
          charImage: '/static/images/pc/char/char-edward.png',
          chartitle: '/static/images/pc/char/name-edward.png',
          status: '언젠간 날아오를 거야!',
          guide: `궁금한 것이 많은 만큼 아는 것도 많은 에드워드.<br>
레이싱을 즐기는 스피드광이자 탐험가로서,<br/>
나비로 날아오를 순간을 꿈꾸고 있습니다. 
`,
          figureWidth: '4.3',
          titleWidth: '11.04',
          path: `/goods?brandNo=${config.brands[0].brands[8].brandNo}`
        },
        {
          charImage: '/static/images/pc/char/char-pangyo.png',
          chartitle: '/static/images/pc/char/name-pangyo.png',
          status: '괜찮아! 걱정 마!',
          guide: `느릿느릿 팡요.<br>
생각하는 것과 만드는 것을 좋아하는 팡요는<br>
여유 있는 미소의 소유자입니다. 
`,
          figureWidth: '16',
          titleWidth: '10.17',
          path: `/goods?brandNo=${config.brands[0].brands[7].brandNo}`
        }
      ]
    }
  }
}
</script>
