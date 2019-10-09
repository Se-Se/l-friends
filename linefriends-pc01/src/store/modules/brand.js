import { createNcpApiStore } from '@/api'
import dev from '../../data/dev-brands'
import prod from '../../data/prod-brands'

const apiStore = createNcpApiStore([
])

export default {
  namespaced: true,
  mixins: [apiStore],
  state: {
    brands: process.env.NODE_ENV === 'production' ? prod : dev
  },
  actions: {
  },
  getters: {
  },
  mutations: {
  }
}
