import axios from 'axios'
// 引入接口
import { baseUrl } from './config.js'

export function Login(config) {
  const instance = axios.create({
    url: baseUrl,
    method:'GET'
  })
  return instance(config)
}
