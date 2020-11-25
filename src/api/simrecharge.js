import request from '@/utils/request'
import qs from 'qs'
export function getSim(data) {
  return request({
    url: '/simonlinehistory/find',
    method: 'get',
     params: {startTime:data.starttime,endTime:data.endtime }
  })
}

