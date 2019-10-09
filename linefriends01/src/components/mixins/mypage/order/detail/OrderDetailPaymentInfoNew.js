import { mapState } from 'vuex'
export default {
  props: ['order'],
  computed: {
    ...mapState('myorder', ['pointName'])
  }
}
