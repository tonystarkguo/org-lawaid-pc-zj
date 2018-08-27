import { request, config } from '../utils'
const { api } = config
const { getOrgList } = api

export async function query (params) {
  return request({
    url: getOrgList,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: getOrgList,
    method: 'get',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: getOrgList,
    method: 'get',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: getOrgList,
    method: 'get',
    data: params,
  })
}
