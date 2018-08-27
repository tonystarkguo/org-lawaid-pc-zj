import { request, config } from '../utils'
const { api } = config
const { user, userLogout, userLogin, getMenuUrl } = api

export async function login (params) {
  return request({
    url: userLogin,
    method: 'post',
    data: params,
  })
}

export async function logout (params) {
  return request({
    url: userLogout,
    method: 'post',
    data: params,
  })
}

export async function query (params) {//登录之后需要获取用户信息
  return request({
    url: user.replace('/:id', ''),
    method: 'get',
    data: params,
  })
}

export async function getMenu (params) {//登录之后需要获取用户信息
  return request({
    url: getMenuUrl,
    method: 'get',
    data: params,
  })
}
