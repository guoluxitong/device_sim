import request from '@/utils/request'
import qs from 'qs'
export function getupdateHistory(data) {
  return request({
    url: '/updateHistory/find',
    method: 'post',
    data: data
  })
}
