import { request, config } from '../utils'
const { api } = config
const { dictionary } = api

export async function query (params) {
  return request({
    url: dictionary,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: dictionary + 'create_dict',
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: dictionary,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: dictionary,
    method: 'patch',
    data: params,
  })
}
