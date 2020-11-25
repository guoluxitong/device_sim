import request from '@/utils/request'
import qs from 'qs'
export function getSimPayment(data) {
  return request({
    url: '/webapi/wechat/smsPaymentRecords/list',
    method: 'post',
    data: data
  })
}
export function editSimPayment(data) {
  return request({
    url: '/webapi/wechat/smsPaymentRecords/modify',
    method: 'post',
    data: data
  })
}
