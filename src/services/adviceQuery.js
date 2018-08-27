import { request, config } from '../utils'
const { api } = config
const { getAdviceList } = api

export async function query (params) {
  return request({
    url: getAdviceList,
    method: 'get',
    data: params,
  })
}
