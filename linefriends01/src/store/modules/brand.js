import { createNcpApiStore } from '@/api'
import config from '@/config'
import Hangul from 'hangul-js'

const apiStore = createNcpApiStore([
  {
    action: '_fetchAllBrand',
    property: 'brand',
    path: 'display/brands',
    onSuccess (state, payload) {
      state.brand.push(...payload.data.items)
      state.totalCount = payload.data.totalCount
    }
  },
  {
    action: '_fetchBrand',
    property: 'detailBrand',
    path: 'display/brands/{brandNo}',
    pathParams: ['brandNo'],
    method: 'get'
  }
])

export default {
  namespaced: true,
  mixins: [apiStore],
  state: {
    current: 'Hangul',
    txt: '',
    totalCount: 0,
    fetchListParams: {
      hasTotalCount: true,
      pageSize: 500,
      pageNumber: 1
    },
    brands: config.brands
  },
  actions: {
    async execFetchAllBrand ({ state, commit, dispatch }) {
      await dispatch('_fetchAllBrand', { params: state.fetchListParams })
      if (state.totalCount !== state.brand.length) {
        state.fetchListParams.pageNumber++
        dispatch('execFetchAllBrand')
      }
    },
    fetchAllBrand ({ state, commit, dispatch }) {
      commit('ININ_DATA')
      dispatch('execFetchAllBrand')
    },
    fetchBrand ({ state, dispatch, commit, rootState }, brandNo) {
      return dispatch('_fetchBrand', { params: { brandNo } })
    }
  },
  getters: {
    flatBrands (state) {
      let brands = []
      for (let brand of state.brands) {
        brands.push(brand)

        if (brand.brands) {
          for (let child of brand.brands) {
            brands.push(child)
          }
        }
      }

      return brands
    },
    currentBrandName (state, getters, rootState) {
      if (state.brand && state.brand.length > 0) {
        const brandNo = rootState.route.params.brandNo
        let brands = state.brand.filter(b => b.brandNo === brandNo)
        return brands && brands[0] && brands[0].name
      }
    },
    currentGroup (state, getters) {
      if (state.current === 'Hangul') {
        return getters.groupByHangul
      }
      return getters.groupByAlphabet
    },
    groupBy (state) {
      if (!state.brand || state.brand.length === 0) {
        return null
      }

      const hangulGroup = {}
      const alphabetGroup = {}
      const korEtcGroup = []
      const engEtcGroup = []

      state.brand.forEach(brand => {
        if (brand.nameType === 'NAME_KO') {
          if (!brand.name) {
            return
          }
          if (/^[가-힣]/.test(brand.name)) {
            const korSplited = Hangul.disassemble(brand.name)
            // 쌍자음 -> 단자음
            if (korSplited[0] === 'ㄲ') {
              korSplited[0] = 'ㄱ'
            } else if (korSplited[0] === 'ㄸ') {
              korSplited[0] = 'ㄷ'
            } else if (korSplited[0] === 'ㅃ') {
              korSplited[0] = 'ㅂ'
            } else if (korSplited[0] === 'ㅆ') {
              korSplited[0] = 'ㅅ'
            } else if (korSplited[0] === 'ㅉ') {
              korSplited[0] = 'ㅈ'
            }

            if (!hangulGroup[korSplited[0]]) {
              hangulGroup[korSplited[0]] = []
            }
            hangulGroup[korSplited[0]].push(brand)
          } else {
            korEtcGroup.push(brand)
          }
        }
        if (brand.nameType === 'NAME_EN') {
          if (!brand.nameEn) {
            return
          }
          if (/^[a-zA-Z\s]/.test(brand.nameEn)) {
            if (!alphabetGroup[brand.nameEn[0].toUpperCase()]) {
              alphabetGroup[brand.nameEn[0].toUpperCase()] = []
            }
            alphabetGroup[brand.nameEn[0].toUpperCase()].push(brand)
          } else {
            engEtcGroup.push(brand)
          }
        }
      })

      return {
        hangul: hangulGroup,
        korEtc: korEtcGroup,
        alphabet: alphabetGroup,
        engEtc: engEtcGroup
      }
    },
    searchResult (state) {
      if (!state.txt.trim()) {
        return []
      }
      return state.brand.filter(brand => (
        brand.name.toUpperCase().indexOf(state.txt.toUpperCase()) >= 0 ||
        Hangul.search(brand.name, state.txt) >= 0
      )).slice(0, 10)
    }
  },
  mutations: {
    toggleGroup (state, payload) {
      if (payload) {
        state.current = payload
        return
      }
      if (state.current === 'Hangul') {
        state.current = 'Alphabet'
      } else {
        state.current = 'Hangul'
      }
    },
    setTxt (state, payload) {
      state.txt = payload
    },
    ININ_DATA (state) {
      state.brand = []
      state.totalCount = 0
      state.fetchListParams.pageNumber = 1
    }
  }
}
