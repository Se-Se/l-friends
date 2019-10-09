import createApiStoreCreator from './createApiStoreCreator'
import ncpApi from './ncpApi'
import pinkdiaryApi from './pinkdiaryApi'

const createNcpApiStore = createApiStoreCreator(ncpApi)
const createPinkdiaryApiStore = createApiStoreCreator(pinkdiaryApi)

export {
  ncpApi as default,
  ncpApi,
  pinkdiaryApi,
  createNcpApiStore,
  createPinkdiaryApiStore
}
