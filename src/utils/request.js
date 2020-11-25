import axios from 'axios'
import { Message } from 'element-ui'
import { config } from '../config'

const baseURL = process.env.NODE_ENV === config.env_Prod
  ? config.base_apis_prod + ':' + config.base_apis_port_prod
  : config.base_apis_dev + ':' + config.base_apis_port_dev

const service = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  withCredentials: true
});
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    Promise.reject(error)
  }
);
service.interceptors.response.use(
  response => response,
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error)
  }
);
export default service
