import axios from 'axios'
import config from '@/config'
import normalizeAxiosError, {
  SERVER_ERROR,
  TIMEOUT_ERROR,
  NETWORK_ERROR
} from './normalizeAxiosError'

const API_TIMEOUT = 30000 // 30s

const pinkdiaryApi = axios.create({
  baseURL: config.pinkdiaryApiBaseUrl,
  timeout: API_TIMEOUT
})

pinkdiaryApi.interceptors.response.use(null, normalizeAxiosError)
pinkdiaryApi.interceptors.response.use(null, function (err) {
  if (err.code === TIMEOUT_ERROR || err.code === NETWORK_ERROR) {
    // soter.commit('error...', err)
  }
  if (err.code === SERVER_ERROR) {
    // soter.commit('error...', err)
  }
  return Promise.reject(err)
})

export default pinkdiaryApi
