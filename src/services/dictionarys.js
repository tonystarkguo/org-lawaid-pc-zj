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
