import { createNcpApiStore } from '@/api'
import Vue from 'vue'

const apiStore = createNcpApiStore([
  {
    action: 'fetchAll',
    property: 'categories',
    path: 'categories',
    onSuccess (state, res) {
      state.categories = res.data.multiLevelCategories.filter((multiLevelCategorie) => !!multiLevelCategorie.children)
    },
    cacheable: true,
    cacheMaxAge: 60e3 * 60
  }
])

export default {
  namespaced: true,
  state: {
    currentCategory: null,
    subCategoryData: '',
    slickCategories: []
  },
  mixins: [apiStore],
  actions: {
  },
  getters: {
    subList (state, getters, rootState) {
      if (state.categories && rootState.route.params.depth1No) {
        let subList = null
        const depth1 = state.categories.find(item => item.categoryNo === Number(rootState.route.params.depth1No))
        subList = depth1 && depth1.children
        if (rootState.route.params.depth2No) {
          let tempCategory = subList && subList.find(item => item.categoryNo === Number(rootState.route.params.depth2No))
          subList = tempCategory && tempCategory.children
          if (rootState.route.params.depth3No) {
            tempCategory = subList && subList.find(item => item.categoryNo === Number(rootState.route.params.depth3No))
            if (tempCategory) {
              Vue.set(tempCategory, 'isSelected', true)
              subList = tempCategory && tempCategory.children
              if (rootState.route.params.depth4No) {
                tempCategory = subList && subList.find(item => item.categoryNo === Number(rootState.route.params.depth4No))
                if (tempCategory) {
                  Vue.set(tempCategory, 'isSelected', true)
                }
              }
            }
          }
        }

        if (subList) {
          return subList
        }
      }
    },
    categorieTabDepth1 (state, getters, rootState) {
      if (state.categories) {
        const depth1 = state.categories.find(item => item.categoryNo === Number(rootState.route.params.depth1No))
        return depth1
      }
    },
    categorieTabDepth2 (state, getters, rootState) {
      if (state.categories && rootState.route.params.depth2No) {
        const depth1 = state.categories.find(item => item.categoryNo === Number(rootState.route.params.depth1No))
        const depth2 = depth1 && depth1.children.find(item => item.categoryNo === Number(rootState.route.params.depth2No))
        return depth2
      }
    },
    categorieTabDepth3 (state, getters, rootState) {
      if (state.categories && rootState.route.params.depth3No) {
        const depth1 = state.categories.find(item => item.categoryNo === Number(rootState.route.params.depth1No))
        const depth2 = depth1 && depth1.children.find(item => item.categoryNo === Number(rootState.route.params.depth2No))
        const depth3 = depth2 && depth2.children.find(item => item.categoryNo === Number(rootState.route.params.depth3No))
        return depth3
      }
    }
  },
  mutations: {
    SET_CATEGORY (state, to) {
      if (state.categories) {
        const depth1 = state.categories.find(item => item.categoryNo === Number(to.params.depth1No))
        let depth2 = null
        let depth3 = null
        let depth4 = null
        if (depth1 && to.params.depth2No) {
          depth2 = depth1.children.find(item => item.categoryNo === Number(to.params.depth2No))
          if (depth2 && to.params.depth3No) {
            depth3 = depth2.children.find(item => item.categoryNo === Number(to.params.depth3No))
            if (depth3 && to.params.depth4No) {
              depth4 = depth3.children.find(item => item.categoryNo === Number(to.params.depth4No))
            }
          }
        }

        state.currentCategory = depth4 || depth3 || depth2 || depth1
      }
    },
    CHECK_NO (state, to) {
      if (state.categories) {
        let err = false
        const depth1 = state.categories.find(item => item.categoryNo === Number(to.params.depth1No))
        let depth2 = null
        let depth3 = null
        let depth4 = null
        if (depth1 && to.params.depth2No) {
          depth2 = depth1.children.find(item => item.categoryNo === Number(to.params.depth2No))
          if (depth2 && to.params.depth3No) {
            depth3 = depth2.children.find(item => item.categoryNo === Number(to.params.depth3No))
            if (depth3 && to.params.depth4No) {
              depth4 = depth3.children.find(item => item.categoryNo === Number(to.params.depth4No))
            }
          }
        }

        if (to.params.depth4No) {
          if (!depth4) {
            err = true
          }
        } else if (to.params.depth3No) {
          if (!depth3) {
            err = true
          }
        } else if (to.params.depth2No) {
          if (!depth2) {
            err = true
          }
        } else {
          if (!depth1) {
            err = true
          }
        }

        if (err) {
          window.location.href = '/etc/pagenotfound'
        }
      }
    },
    SELECTED_SET (state, to) {
      if (state.categories) {
        state.categories.forEach(c => {
          Vue.set(c, 'isSelected', c.categoryNo === Number(to.params.depth1No))
          if (c.categoryNo === Number(to.params.depth1No)) {
            c.children && c.children.forEach(cc => {
              Vue.set(cc, 'isSelected', cc.categoryNo === Number(to.params.depth2No))
              if (cc.categoryNo === Number(to.params.depth2No)) {
                cc.children && cc.children.forEach(ccc => {
                  Vue.set(ccc, 'isSelected', ccc.categoryNo === Number(to.params.depth3No))
                  if (ccc.categoryNo === Number(to.params.depth3No)) {
                    ccc.children && ccc.children.forEach(cccc => {
                      Vue.set(cccc, 'isSelected', cccc.categoryNo === Number(to.params.depth4No))
                    })
                  }
                })
              }
            })
          }
        })
      }
    }
  }
}
