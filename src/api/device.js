import request from '@/utils/request'
import qs from 'qs'
export function getImei(deviceNo) {
  return request({
    url: '/device/getImei',
    method: 'get',
    params: {deviceNo:deviceNo }
  })
}

export function getuserstatusrealsingle(iccid) {
  return request({
    url: '/device/userstatusrealsingle',
    method: 'get',
    params: {iccid:iccid }
  })
}
export function querycardlifecycle(iccid) {
  return request({
    url: '/device/querycardlifecycle',
    method: 'get',
    params: {iccid:iccid }
  })
}
export function querycardopentime(iccid) {
  return request({
    url: '/device/querycardopentime',
    method: 'get',
    params: {iccid:iccid }
  })
}
export function balancerealsingle(iccid) {
  return request({
    url: '/device/balancerealsingle',
    method: 'get',
    params: {iccid:iccid }
  })
}
