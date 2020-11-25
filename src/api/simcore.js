import request from '@/utils/request'
import qs from 'qs'
export function getSim(data) {
  return request({
    url: '/sim/find',
    method: 'post',
    data: data
  })
}
export function editSim(data) {
  return request({
    url: '/sim/update',
    method: 'post',
    params: { simNo:data.simNo, topupState:data.topupState }
  })
}
