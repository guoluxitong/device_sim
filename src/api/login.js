import request from '@/utils/request'

export function login(loginId, password) {
  return request({
    url: '/account/enterprise/login',
    method: 'post',
    params: { loginId, password }
  })
}
